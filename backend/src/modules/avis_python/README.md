# ⭐ Microservice Avis – Amazoff

Ce microservice gère les avis des utilisateurs sur les articles du catalogue Amazoff.  
Il assure la double persistance des avis en MongoDB et MariaDB, expose une API REST et vérifie la santé des bases.

---

## 🚀 Fonctionnalités

- Ajout d’avis utilisateur (note, commentaire, nom, prénom, date)
- Récupération des avis d’un article
- Double stockage : MongoDB (NoSQL) et MariaDB (relationnel)
- Vérification de la santé des bases (endpoint `/health`)
- Log des erreurs d’insertion (`failed_avis_request.log`)

---

## 🛠️ Stack technique

- **Python 3.11**
- **Flask** (API REST)
- **MongoEngine** (MongoDB)
- **MariaDB** (relationnel)
- **Loguru** (logs)
- **APScheduler** (batch périodique)
- **Docker** (conteneurisation)

---

## 📦 Structure

```
src/
  avis_model.py      # Modèle et logique métier
  avis_routes.py     # Routes Flask
  avis_bdd.py        # Accès MariaDB
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

- `MONGO_URI_AVIS` : URI MongoDB
- `DB_LOCAL_HOST`, `DB_LOCAL_LOGIN`, `DB_LOCAL_PASSWORD`, `DB_LOCAL_NAME`, `DB_LOCAL_PORT` : accès MariaDB
- `CORS_ORIGINS` : origines CORS autorisées

---

## 🔗 Endpoints principaux

- `POST /avis/rating_article` : Ajoute un avis (note/commentaire) sur un article. Les deux bases doivent être disponibles.

- `GET /avis/<article_id>` : Récupère tous les avis d’un article.

- `GET /avis/health` : Vérifie la santé du microservice.

---

## 🚦 Démarrage

```bash
# Depuis la racine du projet
make up
# ou
cd environnements
docker-compose up --build
```