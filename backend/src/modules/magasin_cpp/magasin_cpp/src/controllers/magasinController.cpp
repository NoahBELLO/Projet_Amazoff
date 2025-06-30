#include "magasinController.h"
#include "../db/db.h"
#include "../models/magasinModel.h"
#include <iostream>
#include <sstream>

// Si une macro DELETE est définie (par exemple par windows.h), on la désactive.
#ifdef DELETE
#undef DELETE
#endif

void MagasinController::init_routes(crow::SimpleApp &app)
{
    // GET /magasins : Récupérer tous les magasins
    CROW_ROUTE(app, "/magasins").methods(crow::HTTPMethod::GET)([]() -> crow::response
    {
        try {
            auto collection = Database::get_client()["Magasins"]["magasins"];
            auto cursor = collection.find({});
            crow::json::wvalue magasins_json;
            int i = 0;
            for (auto&& doc : cursor) {
                magasins_json[i]["id"] = doc["_id"].get_oid().value.to_string();
                magasins_json[i]["nom"] = std::string(doc["nom"].get_string().value);
                magasins_json[i]["adresse"] = std::string(doc["adresse"].get_string().value);
                magasins_json[i]["ville"] = std::string(doc["ville"].get_string().value);
                magasins_json[i]["email"] = std::string(doc["email"].get_string().value);
                magasins_json[i]["telephone"] = std::string(doc["telephone"].get_string().value);
                magasins_json[i]["responsable_nom"] = std::string(doc["responsable_nom"].get_string().value);
                magasins_json[i]["responsable_email"] = std::string(doc["responsable_email"].get_string().value);
                magasins_json[i]["capacite_stock"] = doc["capacite_stock"].get_int32();
                i++;
            }
            return crow::response(magasins_json);
        } catch (const std::exception &e) {
            return crow::response(500, std::string("Erreur serveur : ") + e.what());
        }
    });

    // POST /magasins : Ajouter un nouveau magasin
    CROW_ROUTE(app, "/magasins").methods(crow::HTTPMethod::POST)([](const crow::request &req) -> crow::response
    {
        auto body = crow::json::load(req.body);
        // Vérification de la présence de tous les champs requis
        if (!body || !body.has("nom") || !body.has("adresse") || !body.has("ville") ||
            !body.has("email") || !body.has("telephone") ||
            !body.has("responsable_nom") || !body.has("responsable_email") || !body.has("capacite_stock"))
        {
            return crow::response(400, "Données invalides");
        }

        try {
            Magasin magasin(
                body["nom"].s(),
                body["adresse"].s(),
                body["ville"].s(),
                body["email"].s(),
                body["telephone"].s(),
                body["responsable_nom"].s(),
                body["responsable_email"].s(),
                body["capacite_stock"].i()
            );
            auto collection = Database::get_client()["Magasins"]["magasins"];
            auto result = collection.insert_one(magasin.to_bson().view());
            if(result)
                return crow::response(201, "Magasin ajouté avec succès");
            else
                return crow::response(500, "Erreur lors de l'insertion du magasin");
        } catch (const std::exception &e) {
            return crow::response(500, std::string("Erreur serveur : ") + e.what());
        }
    });

    // GET /magasins/:id : Récupérer un magasin par son ID
    CROW_ROUTE(app, "/magasins/<string>").methods(crow::HTTPMethod::GET)([](const std::string &id) -> crow::response
    {
        try {
            auto collection = Database::get_client()["Magasins"]["magasins"];
            bsoncxx::oid oid;
            try {
                oid = bsoncxx::oid(id);
            } catch (const std::exception &) {
                return crow::response(400, "ID invalide");
            }
            auto result = collection.find_one(bsoncxx::builder::stream::document{} 
                                                << "_id" << oid 
                                                << bsoncxx::builder::stream::finalize);
            if (!result)
                return crow::response(404, "Magasin non trouvé");

            auto doc = result->view();
            crow::json::wvalue magasin_json;
            magasin_json["id"] = id;
            magasin_json["nom"] = std::string(doc["nom"].get_string().value);
            magasin_json["adresse"] = std::string(doc["adresse"].get_string().value);
            magasin_json["ville"] = std::string(doc["ville"].get_string().value);
            magasin_json["email"] = std::string(doc["email"].get_string().value);
            magasin_json["telephone"] = std::string(doc["telephone"].get_string().value);
            magasin_json["responsable_nom"] = std::string(doc["responsable_nom"].get_string().value);
            magasin_json["responsable_email"] = std::string(doc["responsable_email"].get_string().value);
            magasin_json["capacite_stock"] = doc["capacite_stock"].get_int32();
            return crow::response(magasin_json);
        } catch (const std::exception &e) {
            return crow::response(500, std::string("Erreur serveur : ") + e.what());
        }
    });

    // PUT /magasins/update/:id : Mettre à jour un magasin
    CROW_ROUTE(app, "/magasins/update/<string>").methods(crow::HTTPMethod::PUT)([](const crow::request &req, const std::string &id) -> crow::response
    {
        auto body = crow::json::load(req.body);
        if (!body)
            return crow::response(400, "Données invalides");

        // Vérifier que tous les champs requis sont présents
        if (!body.has("nom") || !body.has("adresse") || !body.has("ville") ||
            !body.has("email") || !body.has("telephone") ||
            !body.has("responsable_nom") || !body.has("responsable_email") || !body.has("capacite_stock"))
        {
            return crow::response(400, "Certains champs requis sont manquants");
        }

        // Création du filtre avec vérification de l'ID
        bsoncxx::builder::stream::document filter_builder;
        try {
            filter_builder << "_id" << bsoncxx::oid(id);
        } catch (const std::exception &) {
            return crow::response(400, "ID invalide");
        }
        auto filter_doc = filter_builder << bsoncxx::builder::stream::finalize;

        // Création du document de mise à jour
        bsoncxx::builder::stream::document update_builder;
        auto update_doc = update_builder << "$set" << bsoncxx::builder::stream::open_document
                                         << "nom" << body["nom"].s()
                                         << "adresse" << body["adresse"].s()
                                         << "ville" << body["ville"].s()
                                         << "email" << body["email"].s()
                                         << "telephone" << body["telephone"].s()
                                         << "responsable_nom" << body["responsable_nom"].s()
                                         << "responsable_email" << body["responsable_email"].s()
                                         << "capacite_stock" << body["capacite_stock"].i()
                                         << bsoncxx::builder::stream::close_document
                                         << bsoncxx::builder::stream::finalize;

        auto collection = Database::get_client()["Magasins"]["magasins"];
        auto result = collection.update_one(filter_doc.view(), update_doc.view());
        if (result) {
            if (result->modified_count() == 1)
                return crow::response(200, "Magasin mis à jour avec succès");
            else if (result->matched_count() == 1)
                return crow::response(200, "Aucune modification apportée (les données sont identiques)");
        }
        return crow::response(404, "Magasin non trouvé");
    });

    // DELETE /magasins/delete/:id : Supprimer un magasin
    CROW_ROUTE(app, "/magasins/remove/<string>").methods(crow::HTTPMethod::DELETE)([](const crow::request &, const std::string &id) -> crow::response
    {
        try {
            auto collection = Database::get_client()["Magasins"]["magasins"];
            bsoncxx::oid oid;
            try {
                oid = bsoncxx::oid(id);
            } catch (const std::exception &e) {
                return crow::response(400, std::string("ID invalide : ") + e.what());
            }
            auto result = collection.delete_one(bsoncxx::builder::stream::document{} << "_id" << oid
                                                                                     << bsoncxx::builder::stream::finalize);
            if (result && result->deleted_count() == 1)
                return crow::response(200, "Magasin supprimé avec succès");
            else
                return crow::response(404, "Magasin non trouvé");
        } catch (const std::exception &e) {
            return crow::response(500, std::string("Erreur serveur : ") + e.what());
        }
    });
}
