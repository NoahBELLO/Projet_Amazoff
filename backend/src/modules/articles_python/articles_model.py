import os
from flask import json
from mongoengine import Document, StringField, IntField, DateTimeField, FloatField
from articles_python.articles_bdd import TableArticles
from bson import ObjectId
from tools.customeException import ErrorExc
from avis_python.avis_model import AvisModel
from loguru import logger

#liste des fields utiles:
# URLField      pour les URL
# ImageField    pour les images
# EmailField    pour les email

#nouvel_objet = Class(champs1 = "valeur", champ2= "valeur2")
#nouvel_objet.champs1 == "valeur"

# .objects(champs=valeur)       itère sur les pages qui on valeur comme champs
# .save()                       perform an insert or update si ça existe
# .delete()                     supprime 

class ArticleModel(Document): 
    id_maria = IntField(required=True)
    name = StringField(required=True, max_length=200)
    prix = FloatField(required=True)
    image = StringField(required=False)
    reduction = IntField(required=False)
    description = StringField(required=True, max_length=200)
    stock = FloatField(required=True)
    meta = {'collection': 'article' , 'db_alias': 'articles-db'}

    def to_dict(self):
        """Convertir un document en dictionnaire"""
        return {
            "id": str(self.id),  
            "id_maria": self.id_maria,
            "name": self.name,
            "prix": self.prix,
            "image": self.image,
            "reduction": self.reduction,
            "description": self.description,
            "stock": self.stock,
        }
    
    def check_fields(self, datas):
        if "name" not in datas or len(datas['name'].strip()) == 0:
            raise ErrorExc(f"Veuillez définir un nom d'article.")
        
        # if "image" not in datas or len(datas['image'].strip()) == 0:
        #     raise ErrorExc(f"Veuillez choisir une image.")
        
        if "prix" not in datas or float(datas['prix']) == 0 :
            raise ErrorExc(f"Veuillez définir un prix.")
        
        if "stock" not in datas or int(datas['stock']) == 0 :
            raise ErrorExc(f"Veuillez définir le stock.")
        
        if "description" not in datas or len(datas['description'].strip()) == 0:
            raise ErrorExc(f"Veuillez définir une description.")
        
        # if "reduction" in datas:
        #     if float(datas['reduction']):
        #         raise ErrorExc(f"Veuillez définir une réduction valide (doit être un nombre).")

    def get_all_articles(self):
        articles = ArticleModel.objects()  # Récupérer tous les articles avec .objects
        articles_dict = []
        for article in articles:
            article = article.to_dict()
            try:
                avis = AvisModel.objects(article_id=str(article['id'])).first()
                if avis:
                    avis = avis.to_dict()
                    article['avis'] = avis.get('comments', [])
                    article['stars'] = avis.get('stars', 0)
            except:
                pass
            articles_dict.append(article)
        if articles_dict:
            return True, articles_dict
        return False, []

    def get_article(self, article_id):
        try:
            article = ArticleModel.objects(id=article_id).first() #.first pour récup le premier de la liste
            logger.critical(article)
            if not article:
                raise ErrorExc("Article non trouvé")
            avis = AvisModel.objects(article_id=article_id).first()#récupére les avis et les met dans un dict
            logger.critical(avis)
            article = article.to_dict()
            if avis:
                avis.to_dict()
                article['avis'] = avis['comments'] #la liste des commentaires
                article['stars'] = avis['stars'] #la notation
            return True, article
        except:
            #cas où mongo est down
            return False, article_id
            

    def save_data(self, datas):
        try:
            self.check_fields(datas)
            article = ArticleModel(**datas)
            article.save()
            return True, str(article.id) #renvoie false et l'id en string (et non json)
        except Exception as e: 
            raise ErrorExc(f"{str(e)}")
    
    def update_data(self, datas, id_article):
        try:
            self.check_fields(datas)
            #la collection (l'id de l'objet).a update(**= clé valeur /datas = ses données à update)
            result = ArticleModel.objects(id=ObjectId(id_article)).update_one(**datas)
            if result >= 1:
                return True, str(id_article)
            return False, str(id_article)
        except Exception as e: 
            raise ErrorExc(f"Erreur lors de la mise à jour : {str(e)}")
    
    def delete_data(self, id_article):
        try:
            if not ObjectId.is_valid(id_article):
                raise ErrorExc("ID invalide")
            result = ArticleModel.objects(id=ObjectId(id_article)).delete()
            if result:
                return True
        except Exception as e: 
            raise ErrorExc(f"Erreur lors de la suppression : {str(e)}")
    
    #ce search recherche uniquement dans le fichier json
    def search(self, searchKeys=False):
        searchKeysFiltered = {}

        if searchKeys:
            for k, v in searchKeys.items():
                if len(str(v).strip()) > 0:
                    searchKeysFiltered[k] = v

        # charge les articles depuis le cache
        articles = self.load_cached_articles()

        # si aucun critère : retourne tout
        if not searchKeysFiltered:
            return True, articles

        # si recherche texte avec 'q'
        if 'q' in searchKeysFiltered:
            query = searchKeysFiltered.pop('q').strip().lower()

            #cherche une correspondance
            def matches(article):
                return any(
                    query in str(article.get(field, '')).lower()
                    for field in ['name', 'description']
                )

            results = list(filter(matches, articles))

        else:
            # recherche stricte
            results = [
                a for a in articles
                if all(str(a.get(k)) == str(v) for k, v in searchKeysFiltered.items())
            ]

        return True, results or []


       
    def load_cached_articles(self):
        chemin = os.path.join(os.path.dirname(__file__), 'cache', 'cached_articles.json')
        with open(chemin, 'r', encoding='utf-8') as f:
            return json.load(f)


class ArticleModelMD():
    _id = 0
    _user_id = 0
    
    def __init__(self, id = 0):
        self._db = TableArticles()
        if id :
            self._id = id
    
    def check_fields(self, datas):
        if "name" not in datas or len(datas['name'].strip()) == 0:
            logger.critical(datas['name'])
            raise ErrorExc(f"Veuillez définir un nom d'article.")
        
        # if "image" not in datas or len(datas['image'].strip()) == 0:
        #     raise ErrorExc(f"Veuillez choisir une image.")
        
        if "prix" not in datas or float(datas['prix']) == 0 :
            raise ErrorExc(f"Veuillez définir un prix.")
        
        if "stock" not in datas or int(datas['stock']) == 0 :
            raise ErrorExc(f"Veuillez définir le stock.")
        
        if "description" not in datas or len(datas['description'].strip()) == 0:
            raise ErrorExc(f"Veuillez définir une description.")
        
        # if "reduction" in datas:
        #     if float(datas['reduction']):
        #         raise ErrorExc(f"Veuillez définir une réduction valide (doit être un nombre).")

    def create(self, datas):
        db = TableArticles()
        logger.critical(datas)
        db.create(datas)
        if db.getLastId() < 1:
            raise ErrorExc("Échec de l'insertion en base de données.")
        return True, self._id

    def update(self, datas, id_article):
        logger.critical(datas)
        self.check_fields(datas)
        db = TableArticles()
        db.update(id_article, datas)
        if not db.isValid():
            raise ErrorExc("Modification non sauvegardée en base de données.")
        return True, id_article
    
    def get_all_articles(self):
        db = TableArticles()
        filters = ""
        datas = db.search(filters)
        if datas:
            return True, datas
        return False, filters

    def get_article(self, id_article):
        db = TableArticles()
        datas = db.get_by_id(id_article)
        if datas:
            return True, datas
        return False, id_article