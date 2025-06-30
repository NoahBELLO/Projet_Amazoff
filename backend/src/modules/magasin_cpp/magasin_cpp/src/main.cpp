#include <crow.h>
#include "controllers/magasinController.h"

int main() {
    crow::SimpleApp app;

    MagasinController::init_routes(app);

    CROW_LOG_INFO << "Serveur Amazoff Magasin en cours d'exécution sur le port 8080...";
    app.port(8080).multithreaded().run();

    return 0;
}
