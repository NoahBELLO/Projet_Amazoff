from mongoengine import Document, StringField, IntField, DateTimeField, FloatField
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
    name = StringField(required=True, max_length=200)
    prix = FloatField(required=True)
    image = StringField(required=False)
    reduction = IntField(required=False)
    description = StringField(required=True, max_length=200)
    prix_kg = FloatField(required=False)
    stock = FloatField(required=True)
    meta = {'collection': 'article' , 'db_alias': 'articles-db'}

    def to_dict(self):
        """Convertir un document en dictionnaire"""
        return {
            "id": str(self.id),  
            "name": self.name,
            "prix": self.prix,
            "image": self.image,
            "reduction": self.reduction,
            "description": self.description,
            "prix_kg": self.prix_kg,
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
                avis = AvisModel.objects(article_id=str(article['id'])).first().to_dict()
                article['avis'] = avis['comments'] #la liste des commentaires
                article['stars'] = avis['stars'] #la notation
            except:
                pass
            articles_dict.append(article)
        return True, articles_dict


    def get_article(self, article_id):
        article = ArticleModel.objects(id=article_id).first() #.first pour récup le premier de la liste
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
            if result:
                return True, str(result.id)
        except Exception as e: 
            raise ErrorExc(f"Erreur lors de la mise à jour : {str(e)}")
    
    def delete_data(self, id_article):
        try:
            logger.critical(id_article)
            if not ObjectId.is_valid(id_article):
                raise ErrorExc("ID invalide")
            result = ArticleModel.objects(id=ObjectId(id_article)).delete()
            if result:
                return True
        except Exception as e: 
            raise ErrorExc(f"Erreur lors de la suppression : {str(e)}")