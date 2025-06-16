#ifndef MAGASIN_CONTROLLER_H
#define MAGASIN_CONTROLLER_H

#include <crow.h>
#include <mongocxx/client.hpp>

class MagasinController {
public:
    static void init_routes(crow::SimpleApp& app);
};

#endif
