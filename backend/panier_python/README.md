# 🛒 Microservice Panier – Amazoff

Ce microservice gère les paniers d’utilisateurs pour la plateforme Amazoff. Il permet la création, la modification, la suppression et la synchronisation des paniers entre MongoDB et MariaDB pour garantir la résilience et la cohérence des données.

## 🚀 Fonctionnalités

- Création automatique du panier à l’inscription d’un utilisateur
- Ajout, modification et suppression d’articles dans le panier
- Vidage complet du panier
- Synchronisation et rollback entre MongoDB et MariaDB en cas d’erreur
- Journalisation des échecs dans `failed_cart_requests.log`
- Vérification de la santé des bases via `/paniers/health`

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
  panier_model.py       # Modèle et logique métier
  panier_bdd.py         # Accès MariaDB
  panier_routes.py      # Routes Flask
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


## ⚙️ Variables d’environnement

À configurer dans [`environnements/.env`](../../../../environnements/.env) :

- `MONGO_URI_PANIERS` : URI MongoDB
- `DB_LOCAL_HOST`, `DB_LOCAL_LOGIN`, `DB_LOCAL_PASSWORD`, `DB_LOCAL_NAME`, `DB_LOCAL_PORT` : accès MariaDB
- `CORS_ORIGINS` : origines CORS autorisées

---

## 🔗 Endpoints principaux

- `GET /paniers/<user_id>` : Récupérer le panier d’un utilisateur
- `POST /paniers/create_cart/<user_id>` : Créer un panier
- `PATCH /paniers/add_to_cart/<user_id>` : Ajouter un article
- `PATCH /paniers/remove_from_cart/<user_id>` : Retirer un article
- `PATCH /paniers/edit_cart/<user_id>` : Modifier la quantité d’un article
- `DELETE /paniers/delete_cart/<user_id>` : Supprimer le panier
- `DELETE /paniers/vider_panier/<user_id>` : Vider le panier
- `GET /paniers/health` : Vérification de la santé du service

---

## 🚦 Démarrage

```bash
# Depuis la racine du projet
make up
# ou
cd environnements
docker-compose up --build
```