# 🔐 Microservice Authentification – Amazoff

Ce microservice gère l’authentification des utilisateurs sur la plateforme Amazoff.  
Il propose la gestion des comptes, la connexion, la déconnexion, le rafraîchissement des tokens et l’authentification OAuth Google.

---

## 🚀 Fonctionnalités

- Création de compte utilisateur
- Connexion par login/email + mot de passe
- Déconnexion (suppression des tokens)
- Rafraîchissement du token d’accès via le refresh token
- Authentification OAuth Google
- Vérification du rôle utilisateur via microservice rôles
- Sécurisation par JWT, proof-of-work, device fingerprint

---

## 🛠️ Stack technique

- **Node.js** (Express.js, TypeScript)
- **MongoDB** (driver natif)
- **JWT** (tokens d’accès et de rafraîchissement)
- **Docker** (conteneurisation)

---

## 📦 Structure

```
src/
  middlewares/
    authMiddleware.ts    # Middleware d'authentification
    roleMiddleware.ts    # Middleware de vérification de rôle
  authController.ts      # Modèle et logique métier
  authOutils.ts         # Outils d'authentification (hash, vérification, etc.)
  authRoutes.ts          # Routes Express
  db.ts                  # Configuration de la base de données MongoDB
  tokenModel.ts          # Modèle MongoDB
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
- `PORT` : port d’écoute du service (ex : 5001)
- `BASE_DE_DONNEE` : nom de la base MongoDB
- `COLLECTION` : nom de la collection des tokens
- `JWT_SECRET_KEY` : clé secrète pour signer les JWT
- `PEPPER` : grain de sel pour le hash des mots de passe
- `USER_URL_NGINX_1`, `USER_URL_NGINX_2` : URLs du microservice utilisateurs
- `ROLE_URL_NGINX_1`, `ROLE_URL_NGINX_2` : URLs du microservice rôles
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI` : config OAuth Google

---

## 🔗 Endpoints principaux

- `GET /authentification/health` : Vérification du service
- `POST /authentification/register` : Création de compte
- `POST /authentification/login` : Connexion
- `POST /authentification/logout` : Déconnexion
- `POST /authentification/refresh` : Rafraîchir le token d’accès
- `GET /authentification/google` : Démarrer OAuth Google
- `GET /authentification/google/callback` : Callback OAuth Google
- `GET /authentification/check` : Vérifier l’authentification et le rôle

---

## 🚦 Démarrage

```bash
# Depuis la racine du projet
make up
# ou
cd environnements
docker-compose up --build
```