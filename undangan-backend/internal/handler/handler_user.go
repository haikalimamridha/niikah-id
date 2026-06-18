package handler

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/haikalimamridha/niikah/internal/database"
)

func (apiCfg *ApiConfig) HandlerCreateUser(w http.ResponseWriter, r *http.Request) {
	type parameters struct {
		Email    string  `json:"email"`
		Password string  `json:"password"`
		Name     string  `json:"name"`
		Phone    *string `json:"phone"`
	}
	decoder := json.NewDecoder(r.Body)

	params := parameters{}
	err := decoder.Decode(&params)
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Error parsing JSON: %v", err))
		return
	}

	user, err := apiCfg.DB.CreateUser(r.Context(), database.CreateUserParams{
		Email:    params.Email,
		Password: params.Password,
		Name:     params.Name,
		Phone:    toNullString(params.Phone),
	})
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("couldnt create user: %v", err))
		return
	}

	respondWithJSON(w, 200, user)
}
