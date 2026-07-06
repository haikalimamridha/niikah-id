package handler

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/haikalimamridha/niikah/internal/auth"
	"github.com/haikalimamridha/niikah/internal/database"
)

func (apiCfg *ApiConfig) HandlerCreateUser(w http.ResponseWriter, r *http.Request) {
	type parameters struct {
		Name     string `json:"name"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	decoder := json.NewDecoder(r.Body)

	params := parameters{}
	err := decoder.Decode(&params)
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Error parsing JSON: %v", err))
		return
	}

	user, err := apiCfg.DB.CreateUser(r.Context(), database.CreateUserParams{
		Name:     params.Name,
		Email:    params.Email,
		Password: params.Password,
	})
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("couldnt create user: %v", err))
		return
	}

	respondWithJSON(w, 201, user)
}

func (apiCfg *ApiConfig) HandleGetUser(w http.ResponseWriter, r *http.Request) {
	apiKey, err := auth.GetAPIKey(r.Header)
	if err != nil {
		respondWithError(w, 403, fmt.Sprintf("Auth error: %v", err))
		return
	}

	user, err := apiCfg.DB.GetUserByApiKey(r.Context(), apiKey)
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Auth error: %v", err))
		return
	}

	respondWithJSON(w, 200, user)
}

func (apiCfg ApiConfig) HandlerCheckAuth(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(auth.UserIDKey).(int32)
	if !ok {
		respondWithError(w, http.StatusUnauthorized, "invalid user context")
		return
	}

	user, err := apiCfg.DB.GetUserByID(r.Context(), userID)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "user not found")
	}

	respondWithJSON(w, http.StatusOK, map[string]interface{}{
		"user": map[string]interface{}{
			"id":    user.ID,
			"name":  user.Name,
			"email": user.Email,
		},
	})

}
