package main

import (
	"context"
	"encoding/json"
	"strconv"

	"net/http"

  "github.com/rs/cors"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"

	"log"
)

type APIServer struct {
	Addr    string
	MongoDB mongo.Client
}

func NewAPIServer(addr string, mongodb mongo.Client) *APIServer {
	return &APIServer{
		Addr:    addr,
		MongoDB: mongodb,
	}
}

func (s *APIServer) Run() error {
	router := http.NewServeMux()

	router.HandleFunc("/users", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("All Users"))
	})

	router.HandleFunc("/users/{id}", func(w http.ResponseWriter, r *http.Request) {
		id := r.PathValue("id")
		w.Write([]byte("User ID: " + id))
	})

	router.HandleFunc("/properties", func(w http.ResponseWriter, r *http.Request) {

		coll := s.MongoDB.Database("property-evaluator").Collection("properties")

		filter := bson.D{}
		for key, value := range r.URL.Query() {
			for _, value := range value {
				intValue, err := strconv.Atoi(value)
				if err != nil {
					filter = append(filter, bson.E{key, value})
				} else {
					filter = append(filter, bson.E{key, intValue})
				}
			}
		}

		cursor, err := coll.Find(context.TODO(), filter)
		if err != nil {
			w.Write([]byte("Unabe find any properties."))
		}

		var propeties []Property
		if err = cursor.All(context.TODO(), &propeties); err != nil {
			w.Write([]byte("Unabe find any properties."))
		}

		jsonData, err := json.MarshalIndent(propeties, "", "    ")
		if err != nil {
			panic(err)
		}

		w.Write([]byte(jsonData))
	})

	v1 := http.NewServeMux()
	v1.Handle("/api/v1/", http.StripPrefix("/api/v1", router))
  handler := cors.Default().Handler(v1)

	server := http.Server{
		Addr:    s.Addr,
		Handler: handler,
	}

	log.Printf("Server has started %s", s.Addr)

	return server.ListenAndServe()
}
