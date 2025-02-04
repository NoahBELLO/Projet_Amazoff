FROM python:3.8-slim

WORKDIR /src

COPY . /src

# Ajoutez cette ligne pour définir le PYTHONPATH
ENV PYTHONPATH=/src

RUN pip install -r requirements.txt

CMD ["python", "src/modules/main.py"]

#commande de rebuild + launch
#docker build -t articles-python . && docker run --rm -p 6001:6001 --name articles articles-python

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
