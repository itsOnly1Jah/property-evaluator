package main

import (
	"context"
	"encoding/json"
	"fmt"
	"strconv"

	"net/http"

	"github.com/rs/cors"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
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
				if err == nil {
					filter = append(filter, bson.E{key, intValue})
					continue
				}

				objectId, err := primitive.ObjectIDFromHex(value)
				if err == nil {
					filter = append(filter, bson.E{key, objectId})
					continue
				}

				filter = append(filter, bson.E{key, value})
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

	router.HandleFunc("POST /properties", func(w http.ResponseWriter, r *http.Request) {

		coll := s.MongoDB.Database("property-evaluator").Collection("properties")

		var property Property
		err := json.NewDecoder(r.Body).Decode(&property)
		if err != nil {
			w.Write([]byte(err.Error()))
		}

    fmt.Printf("%+v", property)

		result, err := coll.InsertOne(context.TODO(), property)

		w.Write([]byte(fmt.Sprintf("Document inserted with ID: %v\n", result.InsertedID)))
	})

	router.HandleFunc("POST /properties/{id}", func(w http.ResponseWriter, r *http.Request) {

		id, _ := primitive.ObjectIDFromHex(r.PathValue("id"))

		coll := s.MongoDB.Database("property-evaluator").Collection("properties")

		var property Property
		err := json.NewDecoder(r.Body).Decode(&property)
		if err != nil {
			w.Write([]byte(err.Error()))
		}

		data, _ := json.Marshal(property)
		var doc Property
		err = bson.UnmarshalExtJSON([]byte(string(data)), true, &doc)
		if err != nil {
		}

		var updates []bson.E
		updates = mongoUpdateParser(doc)

		filter := bson.D{{"_id", id}}
		update := bson.D{{"$set", updates}}

		result, err := coll.UpdateOne(context.TODO(), filter, update)
		if err != nil {
			w.Write([]byte(fmt.Sprintf("Something went wrong updating property: %v\n", err.Error())))
		}

		w.Write([]byte(fmt.Sprintf("Documents updated: %v\n", result.ModifiedCount)))
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
