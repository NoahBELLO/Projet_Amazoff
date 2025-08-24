# 💳 Microservice Payment Mode – Amazoff

Ce microservice gère les modes de paiement des utilisateurs sur la plateforme Amazoff.  
Il utilise MongoDB pour la persistance, expose une API REST avec Express.js et permet la gestion complète des moyens de paiement.

---

## 🚀 Fonctionnalités

- Création d’un mode de paiement (CB, PayPal, virement, espèces)
- Récupération des modes de paiement d’un utilisateur
- Modification et suppression d’un mode de paiement
- Récupération de tous les modes de paiement (admin/debug)
- Validation des données via Joi

---

## 🛠️ Stack technique

- **Node.js** (Express.js)
- **MongoDB** (Mongoose)
- **Joi** (validation)
- **Docker** (conteneurisation)

---

## 📦 Structure

```
src/
  paymentModeController.js      # Modèle et logique métier
  paymentModeMiddleware.js      # Middleware de validation
  paymentModeModel.js           # Modèle Mongoose
  paymentModeRoutes.js          # Routes Express
  paymentModeService.js         # Service de gestion des modes de paiement
appPaymentMode.js        # Point d’entrée Node.js
Dockerfile               # Build Docker
install.sh               # Script d’installation des dépendances
package.json             # Dépendances Node.js
README.md                # Documentation
```

---

## ⚙️ Variables d’environnement

À configurer dans [`environnements/.env`](../../../../../environnements/.env) :

- `MONGO_URI_PAYEMENTMODE` : URI MongoDB
- `PORT` : port d’écoute du service

---

## 🔗 Endpoints principaux

- `POST /paymentMode/create` : Créer un mode de paiement
- `GET /paymentMode/user?userId=...` : Récupérer les modes de paiement d’un utilisateur
- `PUT /paymentMode/update/:id?userId=...` : Modifier un mode de paiement
- `DELETE /paymentMode/delete/:id?userId=...` : Supprimer un mode de paiement
- `GET /paymentMode/all` : Récupérer tous les modes de paiement (admin/debug)

---

## 🚦 Démarrage

```bash
# Depuis la racine du projet
make up
# ou
cd environnements
docker-compose up --build
```