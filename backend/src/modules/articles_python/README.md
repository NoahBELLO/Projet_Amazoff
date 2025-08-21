# 📰 Microservice Articles – Amazoff

Ce microservice gère la gestion des articles du catalogue Amazoff (CRUD, recherche, synchronisation MongoDB/MariaDB).

## 🚀 Fonctionnalités

- CRUD complet sur les articles (MongoDB & MariaDB)
- Recherche avancée (texte, filtres)
- Synchronisation entre les deux bases (rollback en cas d’échec)
- Stockage des avis et calcul de la note moyenne
- Batch de cache pour accélérer les recherches
- Upload d’images d’articles

## 🛠️ Stack technique

- **Python 3.11**
- **Flask** (API REST)
- **MongoEngine** (MongoDB)
- **MariaDB** (relationnel)
- **Loguru** (logs)
- **APScheduler** (batch périodique)
- **Docker** (conteneurisation)

## 📦 Structure

```
src/
  articles_model.py      # Modèle et logique métier
  articles_routes.py     # Routes Flask
  articles_batch.py      # Batch de cache
  articles_bdd.py        # Accès MariaDB
  cache/                 # Fichier JSON des articles
tools/
  db_health.py           # Vérification des bases
  config.py              # Configuration des variables d’environnement
  mysql.py               # Wrapper MariaDB
  customeException.py    # Exceptions personnalisées
assets/uploads/          # Images uploadées
app.py                   # Point d’entrée Flask
Dockerfile               # Build Docker
requirements.txt         # Dépendances Python
README.md                # Documentation
```

## ⚙️ Variables d’environnement

À configurer dans [`environnements/.env`](../../../../environnements/.env) :

- `MONGO_URI_ARTICLES`
- `DB_LOCAL_HOST`, `DB_LOCAL_LOGIN`, `DB_LOCAL_PASSWORD`, `DB_LOCAL_NAME`, `DB_LOCAL_PORT`
- `URL_AVIS_DOCKER_1`, `URL_AVIS_DOCKER_2`
- `CORS_ORIGINS`, `SALT`, etc.

## 🔗 Endpoints principaux

- `GET /articles/` : Liste des articles (depuis le cache)
- `POST /articles/search` : Recherche avancée
- `GET /articles/<id>` : Détail d’un article
- `POST /articles/create` : Création (avec upload image)
- `PATCH /articles/patch/<id>` : Modification
- `DELETE /articles/delete/<id>` : Suppression
- `GET /articles/health` : Healthcheck

## 🚦 Démarrage

```bash
# Depuis la racine du projet
make up
# ou
cd environnements
docker-compose up --build
```