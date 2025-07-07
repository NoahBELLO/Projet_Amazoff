#ifndef MAGASIN_CONTROLLER_H
#define MAGASIN_CONTROLLER_H

#include <crow.h>
#include <mongocxx/client.hpp>

class MagasinController
{
public:
    template <typename App>
    static void init_routes(App &app);
};

#endif
