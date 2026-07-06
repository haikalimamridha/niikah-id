package handler

import (
	"net/http"
	"time"

	"github.com/haikalimamridha/niikah/internal/auth"
	"github.com/haikalimamridha/niikah/internal/database"
)

func (apiCfg ApiConfig) HandlerDailyViewStats(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(auth.UserIDKey).(int32)
	if !ok {
		respondWithError(w, 401, "invalid user context")
		return
	}

	startDateStr := r.URL.Query().Get("start_date")
	endDateStr := r.URL.Query().Get("end_date")

	startDate, err := time.Parse(time.RFC3339, startDateStr)
	if err != nil {
		respondWithError(w, 400, "invalid start_date")
		return
	}

	endDate, err := time.Parse(time.RFC3339, endDateStr)
	if err != nil {
		respondWithError(w, 400, "invalid end_date")
		return
	}

	rows, err := apiCfg.DB.GetDailyViewsByUser(
		r.Context(),
		database.GetDailyViewsByUserParams{
			OwnerID: userID,
			Date:    startDate,
			Date_2:  endDate,
		},
	)
	if err != nil {
		respondWithError(w, 500, err.Error())
		return
	}

	type Stat struct {
		Count int32 `json:"count"`
	}

	type Result struct {
		Title string `json:"title"`
		Stats []Stat `json:"stats"`
	}

	resultMap := make(map[string][]Stat)

	for _, row := range rows {
		resultMap[row.Subdomain] = append(
			resultMap[row.Subdomain],
			Stat{
				Count: int32(row.Count),
			},
		)
	}

	var result []Result

	for title, stats := range resultMap {
		result = append(result, Result{
			Title: title,
			Stats: stats,
		})
	}

	respondWithJSON(w, 200, map[string]interface{}{
		"data": result,
	})
}

func (apiCfg ApiConfig) HandlerCityStats(w http.ResponseWriter, r *http.Request) {

	UserID, ok := r.Context().Value(auth.UserIDKey).(int32)
	if !ok {
		respondWithError(w, 401, "invalid user context")
		return
	}

	stats, err := apiCfg.DB.GetCityStatsByUser(r.Context(), UserID)
	if err != nil {
		respondWithError(w, 500, "couldnt fetch stats")
		return
	}

	respondWithJSON(w, 200, map[string]interface{}{
		"data": stats,
	})

}

func (apiCfg ApiConfig) HandlerCommentStats(w http.ResponseWriter, r *http.Request) {
	UserID, ok := r.Context().Value(auth.UserIDKey).(int32)
	if !ok {
		respondWithError(w, 401, "invalid user context")
		return
	}

	totalComments, err := apiCfg.DB.GetTotalCommentsByUser(r.Context(), UserID)
	if err != nil {
		respondWithError(w, 500, "couldnt fetch comment stats")
		return
	}

	respondWithJSON(w, 200, map[string]interface{}{
		"total_comments": totalComments,
	})
}

func (apiCfg ApiConfig) HandlerGuestStats(w http.ResponseWriter, r *http.Request) {
	UserID, ok := r.Context().Value(auth.UserIDKey).(int32)

	if !ok {
		respondWithError(w, 401, "invalid user context")
		return
	}

	totalGuests, err := apiCfg.DB.GetTotalGuests(r.Context(), UserID)
	if err != nil {
		respondWithError(w, 500, "couldnt fetch guest stats")
		return
	}

	respondWithJSON(w, 200, map[string]interface{}{
		"total_guest": totalGuests,
	})
}

func (apiCfg ApiConfig) HandlerInvitationStats(w http.ResponseWriter, r *http.Request) {
	UserID, ok := r.Context().Value(auth.UserIDKey).(int32)

	if !ok {
		respondWithError(w, 401, "invalid user context")
		return
	}

	totalInvitations, err := apiCfg.DB.GetTotalInvitations(r.Context(), UserID)
	if err != nil {
		respondWithError(w, 500, "couldnt fetch invitations stats")
		return
	}

	respondWithJSON(w, 200, map[string]interface{}{
		"total_invitation": totalInvitations,
	})
}

func (apiCfg ApiConfig) HandlerViewStats(w http.ResponseWriter, r *http.Request) {
	UserID, ok := r.Context().Value(auth.UserIDKey).(int32)

	if !ok {
		respondWithError(w, 401, "invalid user context")
		return
	}

	totalViews, err := apiCfg.DB.GetTotalViews(r.Context(), UserID)
	if err != nil {
		respondWithError(w, 500, "couldnt fetch views stats")
		return
	}

	respondWithJSON(w, 200, map[string]interface{}{
		"total_views": totalViews,
	})
}

func (apiCfg ApiConfig) HandlerLatestComment(w http.ResponseWriter, r *http.Request) {
	UserID, ok := r.Context().Value(auth.UserIDKey).(int32)

	if !ok {
		respondWithError(w, 401, "invalid user context")
		return
	}

	comments, err := apiCfg.DB.GetLatestCommentsByUser(r.Context(), UserID)
	if err != nil {
		respondWithError(w, 500, "couldnt fetch comments")
		return
	}

	type CommentResponse struct {
		Name      string    `json:"name"`
		Comment   string    `json:"comment"`
		CreatedAt time.Time `json:"createdAt"`
	}

	resp := []CommentResponse{}

	for _, c := range comments {
		resp = append(resp, CommentResponse{
			Name:      c.Name,
			Comment:   c.Comment,
			CreatedAt: c.CreatedAt,
		})
	}

	respondWithJSON(w, 200, map[string]interface{}{
		"data": resp,
	})
}
