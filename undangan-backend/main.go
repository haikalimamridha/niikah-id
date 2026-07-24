package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/go-chi/chi"
	"github.com/go-chi/cors"
	"github.com/go-chi/httprate"
	"github.com/haikalimamridha/niikah/config"
	"github.com/haikalimamridha/niikah/internal/auth"
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
		DB:     database.New(db),
		DBConn: db,
	}

	portString := os.Getenv("PORT")
	if portString == "" {
		log.Fatal("port isnt found")
	}

	// Key := GenerateRandomKey()
	// SetJWTKey(Key)

	router := chi.NewRouter()

	router.Use(cors.Handler(cors.Options{
		AllowedOrigins: []string{
			"http://localhost:3000",
			"https://lake-reuters-hobby-myself.trycloudflare.com",
		},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HANDLE"},
		AllowedHeaders:   []string{"*"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300,
	}))

	v1Router := chi.NewRouter()
	v1Router.Get("/healthz", handler.HandlerReadiness)
	v1Router.Get("/err", handler.HandlerErr)
	v1Router.With(httprate.LimitBy(100, time.Minute, func(r *http.Request) (string, error) { return httprate.CanonicalizeIP(r.RemoteAddr), nil })).Post("/auth/register", apiCfg.HandlerCreateUser)
	v1Router.Post("/auth/login", apiCfg.HandlerLogin)
	v1Router.Get("/users", apiCfg.HandleGetUser)
	v1Router.Get("/templates", apiCfg.HandlerGetTemplates) //get all templates
	v1Router.Get("/packages", apiCfg.HandlerGetPackages)   //get all packages (paket)
	v1Router.Post("/payments/midtrans/notification", apiCfg.HandlerMidtransNotification)
	v1Router.Handle("/uploads/*", http.StripPrefix("/v1/uploads", http.FileServer(http.Dir("./uploads"))))
	v1Router.Handle("/template/*", http.StripPrefix("/v1/template", http.FileServer(http.Dir("../template"))))
	// v1Router.Get("/{subdomain}", apiCfg.HandlerGenerateInvitation)

	v1Router.Group(func(r chi.Router) {
		r.Use(auth.AuthMiddleware)

		r.Get("/auth/check", apiCfg.HandlerCheckAuth) //cek apakah token masih valid (valid 24 jam setelah login)

		//dashboard beranda
		r.Get("/stats/view-daily", apiCfg.HandlerDailyViewStats)     //pengunjung undangan
		r.Get("/stats/city", apiCfg.HandlerCityStats)                //kota asal pengunjung
		r.Get("/stats/comment", apiCfg.HandlerCommentStats)          //total ucapan
		r.Get("/stats/guest", apiCfg.HandlerGuestStats)              //total tamu undangan
		r.Get("/stats/invitation", apiCfg.HandlerInvitationStats)    //total undangan
		r.Get("/stats/view", apiCfg.HandlerViewStats)                //total view undangan
		r.Get("/stats/latest-comments", apiCfg.HandlerLatestComment) //ucapan terkini

		r.Post("/invitations", apiCfg.HandlerCreateInvitation)         //membuat undangan
		r.Patch("/invitations/{id}", apiCfg.HandlerUpdateInvitation)   //update undangan
		r.Post("/validate/subdomain", apiCfg.HandlerValidateSubdomain) // check subdomain sudah dipakai atau belum
		r.Get("/invitations", apiCfg.HandlerGetInvitation)             // menampilkan semua undangan yg dibuat user
		r.Delete("/invitations/{id}", apiCfg.HandlerDeleteInvitation)  // delete invitation
		r.Get("/invoices/my-invoice", apiCfg.HandlerGetMyInvoice)
		r.Post("/invoices/{invoiceId}/midtrans/transaction", apiCfg.HandlerCreateMidtransTransaction)
		r.Post("/invitations/{invitationId}/generate", apiCfg.HandlerGenerateInvitation)

	})

	router.Mount("/v1", v1Router)

	srv := &http.Server{
		Handler: router,
		Addr:    ":" + portString,
	}

	//1. Homepage
	// http.HandleFunc("/", homecontroller.Welcome)

	// start the server
	log.Printf("Server starting port %v", portString)

	err := srv.ListenAndServe()
	if err != nil {
		log.Fatal(err)
	}
}
