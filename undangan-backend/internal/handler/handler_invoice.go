package handler

import (
	"bytes"
	"crypto/sha512"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/go-chi/chi"
	"github.com/haikalimamridha/niikah/internal/auth"
	"github.com/haikalimamridha/niikah/internal/database"
)

func (apiCfg ApiConfig) HandlerGetMyInvoice(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(auth.UserIDKey).(int32)
	if !ok {
		respondWithError(w, 401, "invalid user context")
		return
	}

	invoices, err := apiCfg.DB.GetInvoicesByUserID(
		r.Context(),
		sql.NullInt32{Int32: userID, Valid: true},
	)
	if err != nil {
		respondWithError(w, 500, "failed to get invoices")
		return
	}

	type InvoiceResponse struct {
		ID             int32     `json:"id"`
		InvitationID   int32     `json:"invitation_id"`
		Subdomain      string    `json:"subdomain"`
		TemplateName   string    `json:"template_name"`
		CreatedAt      time.Time `json:"createdAt"`
		TotalPrice     int32     `json:"total_price"`
		PaymentDueDate time.Time `json:"payment_due_date"`
		Status         string    `json:"status"`
		IsPaid         bool      `json:"is_paid"`
		ReceiptProof   string    `json:"receipt_proof"`
	}

	responses := make([]InvoiceResponse, 0, len(invoices))

	for _, inv := range invoices {
		responses = append(responses, InvoiceResponse{
			ID:             inv.ID,
			InvitationID:   inv.InvitationID.Int32,
			Subdomain:      inv.Subdomain,
			TemplateName:   inv.TemplateName.String,
			CreatedAt:      inv.CreatedAt,
			TotalPrice:     inv.TotalPrice,
			PaymentDueDate: inv.PaymentDueDate,
			Status:         inv.Status,
			IsPaid:         inv.IsPaid,
			ReceiptProof:   inv.ReceiptProof.String,
		})
	}

	respondWithJSON(w, 200, map[string]interface{}{
		"items": responses,
	})
}

func (apiCfg ApiConfig) HandlerCreateMidtransTransaction(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(auth.UserIDKey).(int32)
	if !ok {
		respondWithError(w, 401, "invalid user context")
		return
	}

	invoiceIDStr := chi.URLParam(r, "invoiceId")
	invoiceID, err := strconv.Atoi(invoiceIDStr)
	if err != nil {
		respondWithError(w, 400, "invalid invoice id")
		return
	}

	invoice, err := apiCfg.DB.GetInvoiceByID(r.Context(), int32(invoiceID))
	if err != nil {
		respondWithError(w, 404, "invoice not found")
		return
	}

	if !invoice.UserID.Valid || invoice.UserID.Int32 != userID {
		respondWithError(w, 403, "forbidden")
		return
	}

	if invoice.IsPaid || invoice.Status == "paid" {
		respondWithError(w, 400, "invoice already paid")
		return
	}

	if time.Now().After(invoice.PaymentDueDate) {
		respondWithError(w, 400, "invoice payment due date has expired")
		return
	}

	serverKey := strings.TrimSpace(os.Getenv("MIDTRANS_SERVER_KEY"))
	if serverKey == "" {
		respondWithError(w, 500, "midtrans server key is not configured")
		return
	}

	user, err := apiCfg.DB.GetUserByID(r.Context(), userID)
	if err != nil {
		respondWithError(w, 500, "failed to resolve invoice customer")
		return
	}

	orderID := fmt.Sprintf("INV-%d-%d", invoice.ID, time.Now().Unix())
	paymentReq := midtransSnapRequest{
		TransactionDetails: midtransTransactionDetails{
			OrderID:     orderID,
			GrossAmount: invoice.TotalPrice,
		},
		CustomerDetails: midtransCustomerDetails{
			FirstName: user.Name,
			Email:     user.Email,
			Phone:     user.Phone.String,
		},
	}

	snapResponse, err := requestMidtransSnapTransaction(serverKey, paymentReq)
	if err != nil {
		respondWithError(w, 500, err.Error())
		return
	}

	metaPayload, err := json.Marshal(map[string]string{
		"midtrans_order_id":     snapResponse.OrderID,
		"midtrans_redirect_url": snapResponse.RedirectURL,
	})
	if err != nil {
		respondWithError(w, 500, "failed to serialize payment metadata")
		return
	}

	err = apiCfg.DB.UpdateInvoicePaymentStatus(r.Context(), database.UpdateInvoicePaymentStatusParams{
		ID:          invoice.ID,
		Status:      "waiting",
		IsPaid:      false,
		ConfirmedAt: sql.NullTime{Valid: false},
		Meta:        sql.NullString{String: string(metaPayload), Valid: true},
	})
	if err != nil {
		respondWithError(w, 500, "failed to update invoice payment status")
		return
	}

	respondWithJSON(w, 200, map[string]string{
		"token":        snapResponse.Token,
		"redirect_url": snapResponse.RedirectURL,
		"order_id":     snapResponse.OrderID,
		"client_key":   strings.TrimSpace(os.Getenv("MIDTRANS_CLIENT_KEY")),
	})
}

func (apiCfg ApiConfig) HandlerMidtransNotification(w http.ResponseWriter, r *http.Request) {
	serverKey := strings.TrimSpace(os.Getenv("MIDTRANS_SERVER_KEY"))
	if serverKey == "" {
		respondWithError(w, 500, "midtrans server key is not configured")
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		respondWithError(w, 400, "invalid request body")
		return
	}

	var notification midtransNotificationRequest
	if err := json.Unmarshal(body, &notification); err != nil {
		respondWithError(w, 400, "invalid notification payload")
		return
	}

	expectedSignature := sha512Hex(notification.OrderID + notification.StatusCode + notification.GrossAmount + serverKey)
	if !strings.EqualFold(expectedSignature, notification.SignatureKey) {
		respondWithError(w, 401, "invalid notification signature")
		return
	}

	invoiceID, err := parseInvoiceIDFromOrderID(notification.OrderID)
	if err != nil {
		respondWithError(w, 400, "invalid order id")
		return
	}

	status, isPaid, confirmedAt := normalizeMidtransInvoiceStatus(notification.TransactionStatus, notification.FraudStatus)
	err = apiCfg.DB.UpdateInvoicePaymentStatus(r.Context(), database.UpdateInvoicePaymentStatusParams{
		ID:          invoiceID,
		Status:      status,
		IsPaid:      isPaid,
		ConfirmedAt: confirmedAt,
		Meta: sql.NullString{
			String: string(body),
			Valid:  true,
		},
	})
	if err != nil {
		respondWithError(w, 500, "failed to update invoice")
		return
	}

	respondWithJSON(w, 200, map[string]string{
		"message": "notification processed",
	})
}

type midtransSnapRequest struct {
	TransactionDetails midtransTransactionDetails `json:"transaction_details"`
	CustomerDetails    midtransCustomerDetails    `json:"customer_details"`
}

type midtransTransactionDetails struct {
	OrderID     string `json:"order_id"`
	GrossAmount int32  `json:"gross_amount"`
}

type midtransCustomerDetails struct {
	FirstName string `json:"first_name"`
	Email     string `json:"email"`
	Phone     string `json:"phone,omitempty"`
}

type midtransSnapResponse struct {
	Token       string `json:"token"`
	RedirectURL string `json:"redirect_url"`
	OrderID     string `json:"order_id"`
	StatusCode  string `json:"status_code"`
	StatusMsg   string `json:"status_message"`
}

type midtransNotificationRequest struct {
	OrderID           string `json:"order_id"`
	StatusCode        string `json:"status_code"`
	GrossAmount       string `json:"gross_amount"`
	SignatureKey      string `json:"signature_key"`
	TransactionStatus string `json:"transaction_status"`
	FraudStatus       string `json:"fraud_status"`
}

func requestMidtransSnapTransaction(serverKey string, payload midtransSnapRequest) (midtransSnapResponse, error) {
	jsonBody, err := json.Marshal(payload)
	if err != nil {
		return midtransSnapResponse{}, fmt.Errorf("failed to build payment payload")
	}

	req, err := http.NewRequest(http.MethodPost, midtransSnapEndpoint(), bytes.NewBuffer(jsonBody))
	if err != nil {
		return midtransSnapResponse{}, fmt.Errorf("failed to build payment request")
	}

	req.SetBasicAuth(serverKey, "")
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")

	client := &http.Client{Timeout: 15 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return midtransSnapResponse{}, fmt.Errorf("failed to contact midtrans")
	}
	defer resp.Body.Close()

	responseBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return midtransSnapResponse{}, fmt.Errorf("failed to read midtrans response")
	}

	var snapResponse midtransSnapResponse
	if err := json.Unmarshal(responseBody, &snapResponse); err != nil {
		return midtransSnapResponse{}, fmt.Errorf("invalid midtrans response")
	}

	if resp.StatusCode < 200 || resp.StatusCode > 299 {
		message := strings.TrimSpace(snapResponse.StatusMsg)
		if message == "" {
			message = "midtrans request failed"
		}
		return midtransSnapResponse{}, errors.New(message)
	}

	if snapResponse.Token == "" {
		return midtransSnapResponse{}, fmt.Errorf("midtrans returned empty transaction token")
	}

	if snapResponse.OrderID == "" {
		snapResponse.OrderID = payload.TransactionDetails.OrderID
	}

	return snapResponse, nil
}

func midtransSnapEndpoint() string {
	if strings.EqualFold(strings.TrimSpace(os.Getenv("MIDTRANS_IS_PRODUCTION")), "true") {
		return "https://app.midtrans.com/snap/v1/transactions"
	}
	return "https://app.sandbox.midtrans.com/snap/v1/transactions"
}

func sha512Hex(input string) string {
	hash := sha512.Sum512([]byte(input))
	return hex.EncodeToString(hash[:])
}

func parseInvoiceIDFromOrderID(orderID string) (int32, error) {
	parts := strings.SplitN(orderID, "-", 3)
	if len(parts) < 3 || parts[0] != "INV" {
		return 0, fmt.Errorf("invalid order id")
	}

	invoiceID, err := strconv.Atoi(parts[1])
	if err != nil {
		return 0, err
	}

	return int32(invoiceID), nil
}

func normalizeMidtransInvoiceStatus(transactionStatus, fraudStatus string) (string, bool, sql.NullTime) {
	now := sql.NullTime{Time: time.Now(), Valid: true}
	switch strings.ToLower(transactionStatus) {
	case "capture":
		if strings.ToLower(fraudStatus) == "accept" || fraudStatus == "" {
			return "paid", true, now
		}
		return "waiting", false, sql.NullTime{Valid: false}
	case "settlement":
		return "paid", true, now
	case "pending":
		return "waiting", false, sql.NullTime{Valid: false}
	case "deny", "cancel", "expire", "failure":
		return "not_paid", false, sql.NullTime{Valid: false}
	default:
		return "waiting", false, sql.NullTime{Valid: false}
	}
}
