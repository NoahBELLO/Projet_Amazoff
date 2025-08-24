#include "db.h"
#include <mongocxx/instance.hpp>
#include <mongocxx/uri.hpp>
#include <mongocxx/client.hpp>
#include <cstdlib>  // pour getenv
#include <string>

mongocxx::client& Database::get_client() {
    static mongocxx::instance instance{};

    // Récupère l'URI depuis la variable d'environnement MONGO_URI
    const char* uri_env = std::getenv("MONGO_URI_MAGASINS");

    std::string uri_str;
    if (uri_env != nullptr) {
        uri_str = uri_env;
    } else {
        // Valeur par défaut si la variable n’est pas définie
        uri_str = "mongodb+srv://widad:admin@clusterzero.qcluw.mongodb.net/Amazoff?retryWrites=true&w=majority";
    }

    static mongocxx::client client{mongocxx::uri{uri_str}};
    return client;
}
