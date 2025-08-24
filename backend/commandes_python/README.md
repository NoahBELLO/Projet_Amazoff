# 📦 Microservice Commandes – Amazoff

Ce microservice gère la gestion des commandes (en cours et livrées) pour la plateforme Amazoff.  
Il utilise MongoDB pour la persistance, expose une API REST avec Flask et vérifie la santé des bases.

---

## 🚀 Fonctionnalités

- Création de commandes en cours
- Suppression et passage en commandes livrées
- Récupération des commandes par utilisateur
- Log des erreurs d’insertion (`failed_insert_articles.log`)
- Vérification de la santé des bases (MongoDB, MariaDB)

---

## 🛠️ Stack technique

- **Python 3.11**
- **Flask** (API REST)
- **MongoEngine** (MongoDB)
- **MariaDB** (BDD relationnel, supporté)
- **Loguru** (logs)
- **Docker** (conteneurisation)

---

## 📦 Structure

```
src/
  commandes_en_cours_model.py      # Modèle et logique métier
  commandes_en_cours_routes.py     # Routes Flask
  commandes_livrees_model.py       # Modèle et logique métier
  commandes_livrees_routes.py      # Routes Flask
  commandes_routes.py              # Routes principales
tools/
  db_health.py           # Vérification des bases
  config.py              # Configuration des variables d’environnement
  mysql.py               # Wrapper MariaDB
  customeException.py    # Exceptions personnalisées
app.py                   # Point d’entrée Flask
Dockerfile               # Build Docker
requirements.txt         # Dépendances Python
README.md                # Documentation
```

---

## ⚙️ Variables d’environnement

À configurer dans [`environnements/.env`](../../../../environnements/.env) :

- `MONGO_URI_COMMANDES` : URI MongoDB
- `DB_LOCAL_HOST`, `DB_LOCAL_LOGIN`, `DB_LOCAL_PASSWORD`, `DB_LOCAL_NAME`, `DB_LOCAL_PORT` : accès MariaDB
- `CORS_ORIGINS` : origines CORS autorisées

---

## 🔗 Endpoints principaux

- `GET /commandes/en_cours/<user_id>` : Récupère les commandes en cours d’un utilisateur.
- `POST /commandes/en_cours/create/<user_id>` : Crée une nouvelle commande en cours.
- `DELETE /commandes/en_cours/delete/<numero_commande>` : Passe une commande en livrée.
- `GET /commandes/livrees/<user_id>` : Récupère les commandes livrées d’un utilisateur.

---

## 🚦 Démarrage

```bash
# Depuis la racine du projet
make up
# ou
cd environnements
docker-compose up --build
```
