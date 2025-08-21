# 🚀 Amazoff – Plateforme e-commerce microservices

Bienvenue sur **Amazoff**, une plateforme e-commerce pédagogique conçue pour démontrer la puissance de l’architecture microservices, la scalabilité et la maintenabilité d’un projet moderne.  
Ce projet est le fruit d’un travail de 3ème année de Bachelor Informatique, intégrant les meilleures pratiques DevOps, CI/CD, et une stack technique multi-langages.

---

## 🏗️ Architecture globale

Amazoff repose sur une architecture orientée microservices, chaque composant étant isolé, indépendant et interconnecté via une API Gateway (Nginx).  
Chaque microservice possède sa propre base de données (MongoDB ou MariaDB), ce qui garantit la résilience et la scalabilité du système.

### Schéma d’architecture

```mermaid
graph TD
    A[Frontend Angular] --> B[|HTTP| (API Gateway Nginx)]
    B --> C1[Auth (Node.js/TS)]
    B --> C2[Users (Node.js/TS)]
    B --> C3[Roles (Node.js/TS)]
    B --> C4[Articles (Python)]
    B --> C5[Avis (Python)]
    B --> C6[Commandes (Python)]
    B --> C7[Paniers (Python)]
    B --> C8[Magasin (C++ Crow)]
    B --> C9[Notifications (Node.js)]
    B --> C10[Payment Mode (Node.js)]
    C1 --> D1[(MongoDB)]
    C2 --> D2[(MongoDB)]
    C3 --> D3[(MongoDB)]
    C4 --> D4[(MongoDB)]
    C4 --> E1[(MariaDB)]
    C5 --> D5[(MongoDB)]
    C5 --> E2[(MariaDB)]
    C6 --> D6[(MongoDB)]
    C7 --> D7[(MongoDB)]
    C7 --> E3[(MariaDB)]
    C8 --> D8[(MongoDB)]
    C9 --> D9[(MongoDB)]
    C10 --> D10[(MongoDB)]
```

---

## ⚙️ Technologies utilisées

- **Frontend** : Angular (TypeScript)
- **API Gateway** : Nginx
- **Microservices** :
  - Node.js + TypeScript (authentification, utilisateurs, rôles)
  - Node.js (notifications, paiement)
  - Python (Flask) (articles, avis, commandes, paniers)
  - C++ (Crow) (magasin)
- **Bases de données** : MongoDB (microservices), MariaDB (relationnel)
- **Orchestration** : Docker & Docker Compose
- **CI/CD** : Makefile, scripts d’automatisation

---

## 📁 Organisation du projet

```
Projet_Amazoff/
│
├── backend/
│   └── src/modules/
│       ├── articles_python/    # Microservice Articles (Python)
│       ├── authentification/   # Microservice Auth (Node.js/TS)
│       ├── avis_python/        # Microservice Avis (Python)
│       ├── commandes_python/   # Microservice Commandes (Python)
│       ├── magasin_cpp/        # Microservice Magasin (C++)
│       ├── notifications_node/ # Microservice Notifications (Node.js)
│       ├── panier_python/      # Microservice Paniers (Python)
│       └── payment_mode_node/  # Microservice Paiement (Node.js)
│       ├── roles/              # Microservice Rôles (Node.js/TS)
│       ├── users/              # Microservice Utilisateurs (Node.js/TS)
│
├── frontend/                   # Application Angular
│
└── environnements/
    ├── docker-compose.yml      # Orchestration Docker
    ├── .env                    # Variables d’environnement globales
    ├── mariadb-init/           # Scripts d’initialisation MariaDB
    ├── mongo-init/             # Scripts d’initialisation MongoDB
    └── conf.d/                 # Config Nginx
```

---

## 🚦 Démarrage rapide

### Prérequis

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- (Optionnel) [Make](https://www.gnu.org/software/make/) pour automatiser les commandes

### 1. Cloner le dépôt

```bash
git clone https://github.com/NoahBELLO/Projet_Amazoff.git
cd Projet_Amazoff
```

### 2. Configurer les variables d’environnement

- Un seul fichier `.env` global se trouve dans [`environnements/.env`](environnements/.env).
- Adapte les valeurs selon ton environnement (voir `.env.example` pour un modèle).

**Important** : 
Avant de modifier la configuration, copie le fichier `.env.example` en `.env` :
```bash
cp environnements/.env.example environnements/.env
```

Pour la configuration Nginx, copie également `default_1.txt` en `default_1.conf` (et pareil pour `default_2`) :
```bash
cp environnements/conf.d/default_1.txt environnements/conf.d/default_1.conf
cp environnements/conf.d/default_2.txt environnements/conf.d/default_2.conf
```

### 3. Lancer l’infrastructure

Avec Makefile (recommandé) :
```bash
make up
```
Ou manuellement :
```bash
cd environnements
docker-compose up --build
```

### 4. Accéder à l’application

- **Frontend Angular** : [http://localhost:4200](http://localhost:4200)
- **API Gateway (Nginx)** : [http://localhost:3001](http://localhost:3001)

---

## 🧪 Tests & Qualité

- **Frontend** :
  - Tests unitaires : `cd frontend && ng test`
  - Tests end-to-end : `ng e2e`
- **Backend** :
  - Chaque microservice possède ses propres tests (voir dossiers respectifs)

---

## 🛠️ Commandes utiles

- `make up` : Démarrer tous les services Docker
- `make down` : Arrêter tous les services
- `make logs` : Afficher les logs
- `make ps` : Voir les conteneurs actifs
- `make restart` : Redémarrer les services
- `make clean` : Nettoyer les volumes et images inutiles

---

## 💡 Points forts & Innovations

- **Architecture microservices** : chaque domaine métier est isolé, facilitant la maintenance et l’évolution.
- **Stack multi-langages** : Node.js, Python, C++ pour illustrer l’interopérabilité.
- **Orchestration avancée** : Docker Compose, un seul `.env` global pour la configuration.
- **API Gateway** : centralisation de la sécurité et du routage.
- **Scalabilité** : chaque microservice peut être répliqué ou mis à l’échelle indépendamment.
- **Documentation claire** : ce README et des exemples de configuration pour chaque composant.

---

## 👨‍💻 Auteurs

- Noah BELLO
- Florian Potier-Clemente
- Widad MASGHAR

---

## 📚 Pour aller plus loin

- Consulte les README spécifiques dans chaque dossier de microservice pour plus de détails techniques.
- Pour toute question ou contribution, ouvre une issue ou contacte l’équipe projet.

---

> Ce projet a été réalisé dans le cadre du Bachelor 3 Informatique, démontrant la maîtrise des architectures distribuées, du DevOps et des technologies web modernes.