package handler

import (
	"net/http"
	"os"
)

func (apiCfg ApiConfig) HandlerGetTemplates(w http.ResponseWriter, r *http.Request) {
	files, err := os.ReadDir("../template")
	if err != nil {
		respondWithError(w, 500, "cant read templates")
		return
	}

	var templates []map[string]string

	for _, file := range files {
		if file.IsDir() {
			templates = append(templates, map[string]string{
				"name":    file.Name(),
				"preview": "template/" + file.Name() + "/index.html",
			})
		}
	}

	respondWithJSON(w, 200, map[string]interface{}{
		"items": templates,
	})
}
