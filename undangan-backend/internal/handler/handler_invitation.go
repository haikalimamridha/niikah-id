package handler

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path"
	"strconv"
	"time"

	"github.com/go-chi/chi"
	"github.com/haikalimamridha/niikah/internal/auth"
	"github.com/haikalimamridha/niikah/internal/database"
)

func (apiCfg ApiConfig) HandlerCreateInvitation(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(auth.UserIDKey).(int32)
	if !ok {
		respondWithError(w, 401, "invalid user context")
		return
	}

	err := r.ParseMultipartForm(20 << 20)
	if err != nil {
		respondWithError(w, 400, "invalid form")
		return
	}

	subdomain := r.FormValue("subdomain")
	templateName := r.FormValue("template_name")
	title := r.FormValue("title")
	packageID, err := strconv.Atoi(r.FormValue("package_id"))
	if err != nil {
		respondWithError(w, 400, "invalid package id")
		return
	}

	maleName := r.FormValue("male_name")
	femaleName := r.FormValue("female_name")
	maleNickname := r.FormValue("male_nickname")
	femaleNickname := r.FormValue("female_nickname")
	maleParents := r.FormValue("male_parents")
	femaleParents := r.FormValue("female_parents")

	//transaksi database

	tx, err := apiCfg.DBConn.BeginTx(r.Context(), nil)
	if err != nil {
		respondWithError(w, 500, "failed to start transaction")
		return
	}
	defer tx.Rollback()

	qtx := apiCfg.DB.WithTx(tx)

	// create invitation
	invitation, err := qtx.CreateInvitation(r.Context(), database.CreateInvitationParams{
		Subdomain:    subdomain,
		OwnerID:      userID,
		PackageID:    sql.NullInt32{Int32: int32(packageID), Valid: true},
		TemplateName: sql.NullString{String: templateName, Valid: true},
		IsActive:     true,
	})
	if err != nil {
		respondWithError(w, 400, "couldnt create invitation")
		return
	}

	//make folder path
	ownerFolder := fmt.Sprintf("./uploads/user_%d", userID)
	invitationFolder := path.Join(ownerFolder, fmt.Sprintf("invitation_%d", invitation.ID))

	if err := os.MkdirAll(invitationFolder, 0755); err != nil {
		respondWithError(w, 500, "failed create folder")
		return
	}

	//file upload
	maleFile, maleHeader, errmale := r.FormFile("photo_male")
	if errmale == nil {
		defer maleFile.Close()

		dst, err := os.Create(invitationFolder + "/" + maleHeader.Filename)
		if err != nil {
			respondWithError(w, 500, "failed to save male photo")
			return
		}
		defer dst.Close()

		if _, err := io.Copy(dst, maleFile); err != nil {
			respondWithError(w, 500, "failed to save male photo to disk")
			return
		}
	}

	femaleFile, femaleHeader, errfemale := r.FormFile("photo_female")
	if errfemale == nil {
		defer femaleFile.Close()

		dst, err := os.Create(invitationFolder + "/" + femaleHeader.Filename)
		if err != nil {
			respondWithError(w, 500, "failed to save female photo")
			return
		}
		defer dst.Close()

		if _, err := io.Copy(dst, femaleFile); err != nil {
			respondWithError(w, 500, "failed to save female photo to disk")
			return
		}
	}

	malePath := sql.NullString{String: "", Valid: false}
	if errmale == nil && maleHeader != nil {
		malePath = sql.NullString{String: path.Join(invitationFolder, maleHeader.Filename), Valid: true}
	}

	femalePath := sql.NullString{String: "", Valid: false}
	if errfemale == nil && femaleHeader != nil {
		femalePath = sql.NullString{String: path.Join(invitationFolder, femaleHeader.Filename), Valid: true}
	}

	//create invitation content
	_, err = qtx.CreateInvitationContent(r.Context(), database.CreateInvitationContentParams{
		InvitationID:   invitation.ID,
		Title:          title,
		MaleName:       maleName,
		FemaleName:     femaleName,
		MaleNickname:   sql.NullString{String: maleNickname, Valid: true},
		FemaleNickname: sql.NullString{String: femaleNickname, Valid: true},
		MaleParents:    sql.NullString{String: maleParents, Valid: true},
		FemaleParents:  sql.NullString{String: femaleParents, Valid: true},
		UrlPhotoMale:   malePath,
		UrlPhotoFemale: femalePath,
	})
	if err != nil {
		respondWithError(w, 400, "couldnt create invitation content")
		return
	}

	if err := tx.Commit(); err != nil {
		respondWithError(w, 500, "failed to commit transaction")
		return
	}

	respondWithJSON(w, 201, map[string]interface{}{
		"message": "invitation created",
		"id":      invitation.ID,
	})
}

// func (apiCfg ApiConfig) HandlerGenerateInvitation(w http.ResponseWriter, r *http.Request) {
// 	invitationIDstr := chi.URLParam(r, "invitationId")

// 	invitationID, err := strconv.Atoi(invitationIDstr)
// 	if err != nil {
// 		respondWithError(w, 401, "convert to int fail")
// 	}

// 	invitation, err := apiCfg.DB.GetInvitationByID(r.Context(), int32(invitationID))
// 	if err != nil {
// 		respondWithError(w, 401, "couldnt fetch invitation")
// 		return
// 	}

// 	content, err := apiCfg.DB.GetInvitationContentByID(r.Context(), int32(invitationID))
// 	if err != nil {
// 		respondWithError(w, 401, "couldnt fetch invitation content")
// 		return
// 	}

// 	templatePath := "template/" + invitation.TemplateName.String + "/index.html"

// 	tpl, err := template.ParseFiles(templatePath)
// 	if err != nil {
// 		respondWithError(w, 500, "template error")
// 		return
// 	}

// 	outputDir := "public/" + invitation.Subdomain

// 	os.MkdirAll(outputDir, 0755)

// 	outFile, _ := os.Create(outputDir + "/index.html")

// 	defer outFile.Close()

// 	tpl.Execute(outFile, content)

// 	respondWithJSON(w, 200, map[string]string{
// 		"message": "generated",
// 	})
// }

func (apiCfg ApiConfig) HandlerUpdateInvitation(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(auth.UserIDKey).(int32)
	if !ok {
		respondWithError(w, 401, "invalid user context")
		return
	}

	invitationIDStr := chi.URLParam(r, "id")
	invitationID, err := strconv.Atoi(invitationIDStr)
	if err != nil {
		respondWithError(w, 400, "invalid invitation id")
		return
	}

	if err := r.ParseMultipartForm(20 << 20); err != nil {
		respondWithError(w, 400, "invalid form")
		return
	}

	subdomain := r.FormValue("subdomain")
	templateName := r.FormValue("template_name")
	title := r.FormValue("title")
	packageID, err := strconv.Atoi(r.FormValue("package_id"))
	if err != nil {
		respondWithError(w, 400, "invalid package id")
		return
	}

	maleName := r.FormValue("male_name")
	femaleName := r.FormValue("female_name")
	maleNickname := r.FormValue("male_nickname")
	femaleNickname := r.FormValue("female_nickname")
	maleParents := r.FormValue("male_parents")
	femaleParents := r.FormValue("female_parents")

	//transaksi database
	tx, err := apiCfg.DBConn.BeginTx(r.Context(), nil)
	if err != nil {
		respondWithError(w, 500, "failed to start transaction")
		return
	}
	defer tx.Rollback()

	qtx := apiCfg.DB.WithTx(tx)

	//cek ownership invitation
	oldInvitation, err := qtx.GetInvitationByID(r.Context(), int32(invitationID))
	if err != nil {
		respondWithError(w, 404, "invitation not found")
		return
	}

	if oldInvitation.OwnerID != userID {
		respondWithError(w, 403, "forbidden")
		return
	}

	//update invitation
	invitation, err := qtx.UpdateInvitation(r.Context(), database.UpdateInvitationParams{
		ID:           int32(invitationID),
		Subdomain:    subdomain,
		PackageID:    sql.NullInt32{Int32: int32(packageID), Valid: true},
		TemplateName: sql.NullString{String: templateName, Valid: true},
	})
	if err != nil {
		respondWithError(w, 400, "failed to update invitation")
		return
	}

	//make folder path
	ownerFolder := fmt.Sprintf("./uploads/user_%d", userID)
	invitationFolder := path.Join(ownerFolder, fmt.Sprintf("invitation_%d", invitation.ID))

	if err := os.MkdirAll(invitationFolder, 0755); err != nil {
		respondWithError(w, 500, "failed create folder")
		return
	}

	//file upload
	maleFile, maleHeader, errmale := r.FormFile("photo_male")
	if errmale == nil {
		defer maleFile.Close()

		dst, err := os.Create(invitationFolder + "/" + maleHeader.Filename)
		if err != nil {
			respondWithError(w, 500, "failed to save male photo")
			return
		}
		defer dst.Close()

		if _, err := io.Copy(dst, maleFile); err != nil {
			respondWithError(w, 500, "failed to save male photo to disk")
			return
		}
	}

	femaleFile, femaleHeader, errfemale := r.FormFile("photo_female")
	if errfemale == nil {
		defer femaleFile.Close()

		dst, err := os.Create(path.Join(invitationFolder, femaleHeader.Filename))
		if err != nil {
			respondWithError(w, 500, "failed to save female photo")
			return
		}
		defer dst.Close()

		if _, err := io.Copy(dst, femaleFile); err != nil {
			respondWithError(w, 500, "failed to save female photo to disk")
			return
		}
	}

	malePath := sql.NullString{String: "", Valid: false}
	if errmale == nil && maleHeader != nil {
		malePath = sql.NullString{String: path.Join(invitationFolder, maleHeader.Filename), Valid: true}
	}

	femalePath := sql.NullString{String: "", Valid: false}
	if errfemale == nil && femaleHeader != nil {
		femalePath = sql.NullString{String: path.Join(invitationFolder, femaleHeader.Filename), Valid: true}
	}

	// update invitation content
	_, err = qtx.UpdateInvitationContent(r.Context(), database.UpdateInvitationContentParams{
		InvitationID:   int32(invitationID),
		Title:          title,
		MaleName:       maleName,
		FemaleName:     femaleName,
		MaleNickname:   sql.NullString{String: maleNickname, Valid: maleNickname != ""},
		FemaleNickname: sql.NullString{String: femaleNickname, Valid: femaleNickname != ""},
		MaleParents:    sql.NullString{String: maleParents, Valid: maleParents != ""},
		FemaleParents:  sql.NullString{String: femaleParents, Valid: femaleParents != ""},
		UrlPhotoMale:   malePath,
		UrlPhotoFemale: femalePath,
	})
	if err != nil {
		respondWithError(w, 400, "failed to update invitation content")
		return
	}

	if err := tx.Commit(); err != nil {
		respondWithError(w, 500, "failed to commit transaction")
		return
	}

	type contentResponse struct {
		Title          string `json:"title"`
		MaleName       string `json:"male_name"`
		FemaleName     string `json:"female_name"`
		MaleNickname   string `json:"male_nickname"`
		FemaleNickname string `json:"female_nickname"`
		MaleParents    string `json:"male_parents"`
		FemaleParents  string `json:"female_parents"`
	}

	type invitationResponse struct {
		ID           int32           `json:"id"`
		Subdomain    string          `json:"subdomain"`
		PackageID    int32           `json:"package_id"`
		TemplateName string          `json:"template_name"`
		IsActive     bool            `json:"is_active"`
		ExpiredAt    time.Time       `json:"expired_at"`
		Content      contentResponse `json:"content"`
	}

	resp := invitationResponse{
		ID:           invitation.ID,
		Subdomain:    subdomain,
		PackageID:    int32(packageID),
		TemplateName: templateName,
		IsActive:     invitation.IsActive,
		ExpiredAt:    invitation.ExpiredAt,
		Content: contentResponse{
			Title:          title,
			MaleName:       maleName,
			FemaleName:     femaleName,
			MaleNickname:   maleNickname,
			FemaleNickname: femaleNickname,
			MaleParents:    maleParents,
			FemaleParents:  femaleParents,
		},
	}

	respondWithJSON(w, 200, map[string]interface{}{
		"message": "invitation updated",
		"item":    resp,
	})
}

func (apiCfg ApiConfig) HandlerValidateSubdomain(w http.ResponseWriter, r *http.Request) {

	type parameters struct {
		Subdomain string `json:"subdomain"`
	}

	params := parameters{}

	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		respondWithError(w, 400, "invalid request body")
		return
	}

	_, err2 := apiCfg.DB.GetInvitationBySubdomain(r.Context(), params.Subdomain)
	if err2 == nil {
		respondWithError(w, 400, "subdomain already taken")
		return
	}

	respondWithJSON(w, 200, map[string]interface{}{
		"message": "subdomain available",
	})

}

func (apiCfg ApiConfig) HandlerGetInvitation(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(auth.UserIDKey).(int32)
	if !ok {
		respondWithError(w, 401, "invalid user context")
		return
	}

	invitation, err := apiCfg.DB.GetUserInvitationByID(r.Context(), userID)
	if err != nil {
		respondWithError(w, 500, "couldnt fetch invitations")
		return
	}

	type contentResponse struct {
		Title          string `json:"title"`
		MaleName       string `json:"male_name"`
		FemaleName     string `json:"female_name"`
		MaleNickname   string `json:"male_nickname"`
		FemaleNickname string `json:"female_nickname"`
		MaleParents    string `json:"male_parents"`
		FemaleParents  string `json:"female_parents"`
		UrlPhotoMale   string `json:"url_photo_male"`
		UrlPhotoFemale string `json:"url_photo_female"`
	}

	type invitationResponse struct {
		ID           int32           `json:"id"`
		Subdomain    string          `json:"subdomain"`
		PackageID    int32           `json:"package_id"`
		TemplateName string          `json:"template_name"`
		IsActive     bool            `json:"is_active"`
		ExpiredAt    time.Time       `json:"expired_at"`
		Content      contentResponse `json:"content"`
	}

	resp := []invitationResponse{}

	for _, i := range invitation {
		resp = append(resp, invitationResponse{
			ID:           i.ID,
			Subdomain:    i.Subdomain,
			PackageID:    i.PackageID.Int32,
			TemplateName: i.TemplateName.String,
			IsActive:     i.IsActive,
			ExpiredAt:    i.ExpiredAt,
			Content: contentResponse{
				Title:          i.Title.String,
				MaleName:       i.MaleName.String,
				FemaleName:     i.FemaleName.String,
				MaleNickname:   i.MaleNickname.String,
				FemaleNickname: i.FemaleName.String,
				MaleParents:    i.MaleParents.String,
				FemaleParents:  i.FemaleParents.String,
				UrlPhotoMale:   i.UrlPhotoMale.String,
				UrlPhotoFemale: i.UrlPhotoFemale.String,
			},
		})
	}

	respondWithJSON(w, 200, map[string]interface{}{
		"items": resp,
	})
}
