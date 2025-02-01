# Utiliser une image spécifique et légère
FROM python:3.10-alpine

# Définir le répertoire de travail
WORKDIR /app

# Exposer le port Flask
EXPOSE 6001

# Installer les dépendances système nécessaires pour certaines librairies Python
RUN apk add --no-cache gcc musl-dev libffi-dev

# Copier et installer les dépendances
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copier le reste de l'application
COPY . .

# Lancer l'application Flask
CMD ["python", "main.py"]

#accès au module articles_python
#cd .\backend\src\modules\articles_python\

#création de l'image:
    # docker build -t articles-python .

# Créer le container:
    # docker run -d -p 6001:6001 --name mon_container app
    # docker run -d -p 6001:6001 --name articles articles-python
    
# docker run : Créer un nouveau container
# -p 6001:6001 : Lie le port 6001 du container à l'ordinateur
# --name mon_container : nom du container
# app : Nom de l’image à utiliser

#rentrer dans le container 
# docker exec -it <container_id ou nom> sh
# docker exec -it articles sh
