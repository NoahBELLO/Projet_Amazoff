# 👤 Microservice Utilisateurs – Amazoff

Ce microservice gère la gestion des utilisateurs sur la plateforme Amazoff.  
Il utilise MongoDB pour la persistance, expose une API REST avec Express.js et permet la gestion complète des comptes utilisateurs.

---

## 🚀 Fonctionnalités

- Création d’utilisateur (avec rôle par défaut et panier associé)
- Récupération des utilisateurs (par ID, email, login, etc.)
- Modification et suppression d’utilisateur
- Mise à jour du rôle et du profil
- Hashage sécurisé des mots de passe (SHA-256 + sel + pepper)
- Communication avec les microservices rôles, paniers et notifications

---

## 🛠️ Stack technique

- **Node.js** (Express.js, TypeScript)
- **MongoDB** (driver officiel)
- **Docker** (conteneurisation)
- **Axios** (requêtes HTTP inter-microservices)

---

## 📦 Structure

```
src/
  db.ts                  # Configuration de la base de données MongoDB
  userController.ts      # Modèle et logique métier
  userModel.ts           # Modèle MongoDB
  userOutils.ts          # Outils de gestion des utilisateurs
  userRoutes.ts          # Routes Express
app.ts                   # Point d'entrée de l'application
Dockerfile               # Build Docker
install.sh               # Script d’installation des dépendances
package.json             # Dépendances Node.js
tsconfig.json            # Configuration TypeScript
README.md                # Documentation
```

---

## ⚙️ Variables d’environnement

À configurer dans [`environnements/.env`](../../../../../environnements/.env) :

- `MONGO_URI` : URI MongoDB
- `PORT` : port d’écoute du service
- `BASE_DE_DONNEE` : nom de la base MongoDB
- `COLLECTION` : nom de la collection utilisateurs
- `ROLE_URL_NGINX_1`, `ROLE_URL_NGINX_2` : URLs microservice rôles
- `PANIER_URL_NGINX_1`, `PANIER_URL_NGINX_2` : URLs microservice paniers
- `NOTIFICATION_URL_NGINX_1`, `NOTIFICATION_URL_NGINX_2` : URLs microservice notifications
- `PEPPER` : valeur secrète pour le hashage des mots de passe

---

## 🔗 Endpoints principaux

- `GET /users` : Liste des utilisateurs
- `GET /users/id/:id` : Récupérer un utilisateur par ID
- `POST /users` : Créer un utilisateur
- `PUT /users/id/:id` : Modifier un utilisateur par ID
- `PATCH /users/:id` : Mettre à jour partiellement un utilisateur
- `DELETE /users/id/:id` : Supprimer un utilisateur par ID

Voir [`src/userRoutes.ts`](src/userRoutes.ts) pour la liste complète.

---

## 🚦 Démarrage

```bash
# Depuis la racine du projet
make up
# ou
cd environnements
docker-compose up --build