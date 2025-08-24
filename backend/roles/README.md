# 🛡️ Microservice Roles – Amazoff

Ce microservice gère les rôles utilisateurs pour la plateforme Amazoff.  
Il permet la création, la modification, la suppression et la consultation des rôles via une API REST.

---

## 🚀 Fonctionnalités

- Création d’un rôle
- Récupération de tous les rôles
- Recherche d’un rôle par nom ou par ID
- Modification d’un rôle (par nom ou ID)
- Suppression d’un rôle (par nom ou ID)
- Conversion d’ID de rôles en noms (et inversement)

---

## 🛠️ Stack technique

- **Node.js** (Express.js)
- **TypeScript**
- **MongoDB** (driver natif)
- **Docker** (conteneurisation)

---

## 📦 Structure
    
```
src/
  db.ts                  # Configuration de la base de données MongoDB
  roleController.ts      # Modèle et logique métier
  roleModel.ts           # Modèle MongoDB
  roleRoutes.ts          # Routes Express
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
- `PORT` : port d’écoute du service (ex : 5002)
- `BASE_DE_DONNEE` : nom de la base MongoDB
- `COLLECTION` : nom de la collection des rôles

---

## 🔗 Endpoints principaux

- `GET /roles/health` : Vérification du service
- `GET /roles` : Liste de tous les rôles
- `GET /roles/id/:id` : Rôle par ID
- `GET /roles/name/:name` : Rôle par nom
- `POST /roles` : Créer un rôle
- `PUT /roles/id/:id` : Modifier un rôle par ID
- `PUT /roles/name/:name` : Modifier un rôle par nom
- `DELETE /roles/id/:id` : Supprimer un rôle par ID
- `DELETE /roles/name/:name` : Supprimer un rôle par nom
- `POST /roles/convertion` : Convertir une liste d’ID en noms
- `POST /roles/convertionId` : Convertir une liste de noms en ID

---

## 🚦 Démarrage

```bash
# Depuis la racine du projet
make up
# ou
cd environnements
docker-compose up --build
```