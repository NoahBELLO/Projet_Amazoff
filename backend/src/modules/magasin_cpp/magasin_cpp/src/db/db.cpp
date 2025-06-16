#include "db.h"
#include <mongocxx/instance.hpp>
#include <mongocxx/uri.hpp>
#include <mongocxx/client.hpp>

mongocxx::client& Database::get_client() {
    static mongocxx::instance instance{};
    static mongocxx::client client{mongocxx::uri{
        "mongodb+srv://widad:admin@clusterzero.qcluw.mongodb.net/Amazoff?retryWrites=true&w=majority"
    }};
    return client;
}
