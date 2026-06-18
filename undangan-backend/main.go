package main

import (
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi"
	"github.com/go-chi/cors"
	"github.com/haikalimamridha/niikah/config"
	"github.com/haikalimamridha/niikah/controllers/homecontroller"
	"github.com/haikalimamridha/niikah/internal/database"
	"github.com/haikalimamridha/niikah/internal/handler"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

func main() {
	godotenv.Load(".env")

	//connect database
	db := config.ConnectDB()

	apiCfg := &handler.ApiConfig{
		DB: database.New(db),
	}

	portString := os.Getenv("PORT")
	if portString == "" {
		log.Fatal("port isnt found")
	}

	// Key := GenerateRandomKey()
	// SetJWTKey(Key)

	router := chi.NewRouter()

	router.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300,
	}))

	v1Router := chi.NewRouter()
	v1Router.Get("/healthz", handler.HandlerReadiness)
	v1Router.Get("/err", handler.HandlerErr)
	v1Router.Post("/register", apiCfg.HandlerCreateUser)

	router.Mount("/v1", v1Router)

	srv := &http.Server{
		Handler: router,
		Addr:    ":" + portString,
	}

	//1. Homepage
	http.HandleFunc("/", homecontroller.Welcome)

	// start the server
	log.Printf("Server starting port %v", portString)

	err := srv.ListenAndServe()
	if err != nil {
		log.Fatal(err)
	}
}
