Ce microservice magasin est développé en C++ avec le framework Crow et utilise MongoDB comme base de données.

Fonctionnalités

    CRUD des stocks magasins
    Connexion à MongoDB
    API REST via Crow
    Architecture MVC

Compilation et exécution
# 1. Aller dans le dossier magasin
    cd magasin
# 2. Créer le dossier build
    mkdir build && cd build
# 3. Générer les fichiers avec CMake
    cmake ..
# 4. Compiler
    cmake --build .
# 5. Lancer l'exécutable
   ./AmazoffMagasinMS

Dépendances

mongocxx : intégré dans le projet (mongo-c-driver, mongo-cxx-driver)

Crow : présent dans le dossier Crow
