package handler

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/haikalimamridha/niikah/internal/auth"
	"github.com/haikalimamridha/niikah/internal/database"
)

type ApiConfig struct {
	DB     *database.Queries //untuk query biasa tanpa transaksi (rollback)
	DBConn *sql.DB           // jika memanggil .BeginTx()
}

func (apiCfg *ApiConfig) HandlerLogin(w http.ResponseWriter, r *http.Request) {

	type parameters struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	params := parameters{}

	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("invalid json: %v", err))
		return
	}

	user, err := apiCfg.DB.GetUserByEmail(r.Context(), params.Email)
	if err != nil {
		respondWithError(w, 401, "wrong email or password")
		return
	}

	// err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(params.Password))
	// if err != nil {
	// 	respondWithError(w, 401, "wrong email or password")
	// 	return
	// }
	if params.Password != user.Password {
		respondWithError(w, 401, "wrong email or password")
		return
	}

	token, err := auth.MakeJWT(user.ID, string(user.Role))
	if err != nil {
		respondWithError(w, 500, "couldnt create token")
		return
	}

	// respondWithJSON(w, 200, map[string]interface{}{"message": "login success"})
	respondWithJSON(w, 200, map[string]interface{}{
		"access_token": token,
		"user": map[string]interface{}{
			"id":    user.ID,
			"name":  user.Name,
			"email": user.Email,
			"role":  user.Role,
		},
	})
}
