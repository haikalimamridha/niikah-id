package handler

import "net/http"

func (apiCfg ApiConfig) HandlerGetPackages(w http.ResponseWriter, r *http.Request) {
	packages, err := apiCfg.DB.ListPackages(r.Context())
	if err != nil {
		respondWithError(w, 401, "couldnt fetch packages")
		return
	}

	type packageResponse struct {
		ID    int    `json:"id"`
		Name  string `json:"name"`
		Price int    `json:"price"`
	}

	listPackages := []packageResponse{}

	for _, pckg := range packages {
		listPackages = append(listPackages, packageResponse{
			ID:    int(pckg.ID),
			Name:  pckg.Name,
			Price: int(pckg.Price),
		})
	}

	respondWithJSON(w, 200, map[string]interface{}{
		"items": listPackages,
	})

}
