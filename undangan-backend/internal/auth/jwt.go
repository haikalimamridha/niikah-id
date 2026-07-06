package auth

import (
	"os"
	"time"

	"github.com/golang-jwt/jwt/v4"
)

func MakeJWT(userID int32, userRole string) (string, error) {
	secret := os.Getenv("JWT_SECRET")

	token := jwt.NewWithClaims(
		jwt.SigningMethodHS256,
		jwt.MapClaims{
			"user_id":   userID,
			"user_role": userRole,
			"exp": time.Now().
				Add(24 * time.Hour).
				Unix(),
		},
	)

	return token.SignedString([]byte(secret))
}
