package config

import (
	"database/sql"
	"log"
	"os"
)

func ConnectDB() *sql.DB {
	dbURL := os.Getenv("DB_URL")
	if dbURL == "" {
		log.Fatal("DB_URL isnt found in env")
	}

	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatal("cant connect to databases:", err)
	}

	log.Println("database connected")

	return db
}
