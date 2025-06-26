# Microservice Magasin – Amazoff

Ce microservice gère les stocks des magasins pour l’application Amazoff.  
Il est développé en C++ avec le framework Crow (similaire à Express.js) et utilise MongoDB comme base de données.


## Fonctionnalités

- CRUD complet des stocks magasins  
- API REST via Crow  
- Architecture MVC  
- Connexion à MongoDB 

## Dépendances

- Crow (présent dans le dossier `Crow`)
- mongo-cxx-driver (intégré au projet)
- Boost, OpenSSL, libssl-dev (installés automatiquement dans l’image Docker)

## Compilation manuelle 
1. Aller dans le dossier du projet :
    cd magasin_cpp\magasin_cpp

2. Créer le dossier `build` :
    mkdir build && cd build

3. Générer les fichiers CMake :
    cmake ..

4. Compiler le projet :
    cmake --build .

5. Lancer l’exécutable :

./AmazoffMagasinMS

## Exécution avec Docker

1. Lancer le microservice avec MongoDB :
    docker-compose up --build
<!-- Ce script va :
- Compiler automatiquement le microservice C++
- Lancer MongoDB localement (port 27017)
- Démarrer le microservice (port 18080) -->

2. Accéder à l’API :

http://localhost:18080

---

## Configuration MongoDB

Le microservice lit l’URI MongoDB depuis la variable d’environnement `MONGO_URI_MAGASINS`.
Pour utiliser MongoDB Atlas, créer un fichier `.env`

