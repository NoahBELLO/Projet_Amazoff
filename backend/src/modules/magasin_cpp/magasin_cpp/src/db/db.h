#ifndef DB_H
#define DB_H

#include <mongocxx/client.hpp>
#include <mongocxx/instance.hpp>
#include <mongocxx/uri.hpp>

class Database {
public:
    static mongocxx::client& get_client();
};

#endif
