# 📊 Projet Amazoff

// Faire un résumé

---

## 🏗️ Architecture et fonctionnement

### Vue d’ensemble

L’architecture repose sur une séparation claire des responsabilités :

- **Frontend** (Angular) : Interface web moderne, accessible via navigateur ou packagée en application desktop via Electron.
- **API Gateway** (Nginx) : Point d’entrée unique, redirige les requêtes vers les microservices.
- **Microservices Backend** :
  - **Authentification** (Node.js/TypeScript) → sa propre base MongoDB
  - **Utilisateurs** (Node.js/TypeScript) → sa propre base MongoDB
  - **Rôles** (Node.js/TypeScript) → sa propre base MongoDB

### Schéma de l’architecture

```
                                                   +---------------------+  
                                                   |       Frontend      |  
                                                   |      (Angular)      |  
                                                   +---------------------+ 
                                                             |
                                                             v
                                                  +---------------------+
                                                  |     API Gateway     |
                                                  |       (Nginx)       |
                                                  +---------------------+
                                                             |
      +---------------+-------------------------------+---------------+-----------------------------------------------+
      |                     |                  |          
      v                     v                  v            
+----------------+ +----------------+ +----------------+  
| Auth Service   | | User Service   | | Role Service   |  
| (Node/TS)      | | (Node/TS)      | | (Node/TS)      |    
+----------------+ +----------------+ +----------------+ 
        |                  |                  |          
        v                  v                  v           
  +-----------+       +-----------+      +-----------+        
  | MongoDB   |       | MongoDB   |      | MongoDB   |       
  | (auth DB) |       | (user DB) |      | (role DB) |         
  +-----------+       +-----------+      +-----------+        
```

---

## 🎯 Choix des technologies

- **Angular** : Frontend web moderne et réactif.
- **Node.js + TypeScript** : Microservices Auth, Users, Roles, OLTP.
- **Python (Flask)** : Microservice 
- **MongoDB** : Base NoSQL, chaque microservice Auth, Users, Roles a sa propre base MongoDB.
- **Nginx** : API Gateway, centralise et sécurise les accès.
- **Docker & Docker Compose** : Orchestration et portabilité.

---

## 🗂️ Organisation du code

```
Projet_Amazoff/
│
├── backend/
│   ├── authentification/   # Microservice Authentification (Node.js/TypeScript, MongoDB)
│   ├── roles/              # Microservice Rôles (Node.js/TypeScript, MongoDB)
│   └── users/              # Microservice Utilisateurs (Node.js/TypeScript, MongoDB)
│
├── frontend/               # Application Angular (interface web)
│
│
└── environnements/
    ├── docker-compose.yml  # Orchestration Docker
    └── conf.d/             # Config Nginx
```

---

## 🚀 Démarrage rapide

### Prérequis pour lancer le projet via Docker

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### Prérequis pour utiliser le Makefile

- **Linux / macOS** : `make` est généralement déjà installé.
- **Windows** :
  - Installe [Git Bash](https://gitforwindows.org/) ou [WSL](https://learn.microsoft.com/fr-fr/windows/wsl/install) (Windows Subsystem for Linux) pour avoir la commande `make`.
  - Ou installe [GnuWin Make](http://gnuwin32.sourceforge.net/packages/make.htm) et ajoute-le à ton PATH.
  - Puis lancer la commande suivante dans le terminal : sudo apt install make

> Si tu n’as pas `make`, tu peux toujours lancer les commandes Docker manuellement (voir plus haut).

### Installation

1. **Cloner le dépôt :**

   ```bash
   git clone https://github.com/NoahBELLO/Projet_Amazoff.git
   cd Projet_Amazoff
   ```

2. **Configurer les variables d’environnement :**

   - Copier les fichiers `.env.exemple` en `.env` dans les dossiers microservices et adapter les valeurs.

3. **Lancer l’infrastructure Docker :**

   ```bash
   make up
   ```

   ou

   ```bash
   cd ./environnement
   docker-compose up --build
   ```

4. **Accéder à l’application :**
   - **Frontend Angular** : [http://localhost:4200](http://localhost:4200)
   - **API Gateway (Nginx)** : [http://localhost:3001](http://localhost:3001)

## 🧪 Tests

- **Frontend :**
  - Tests unitaires :
    ```bash
    cd frontend
    ng test
    ```
  - Tests end-to-end :
    ```bash
    ng e2e
    ```
- **Backend :**
  - Les tests sont propres à chaque microservice (voir dossiers respectifs).

---

## 🔧 Commandes utiles (Makefile)

- `make up` : Démarrer tous les services Docker
- `make down` : Arrêter tous les services
- `make logs` : Afficher les logs
- `make ps` : Voir les conteneurs actifs
- `make restart` : Redémarrer les services
- `make clean` : Nettoyer les volumes et images inutiles

---

## 👥 Auteurs

- Noah BELLO (Collaborateur)
- Florian Potier-Clemente (Collaborateur)
- Widad MAS

---

Pour plus de détails, consulte les README spécifiques dans chaque
