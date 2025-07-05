#include <crow.h>
#include "controllers/magasinController.h"

int main() {
    crow::SimpleApp app;

    MagasinController::init_routes(app);

    CROW_LOG_INFO << "Serveur Amazoff Magasin en cours d'exécution sur le port 7001...";
    app.port(7001).multithreaded().run();

    return 0;
}
