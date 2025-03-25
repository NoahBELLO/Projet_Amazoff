from mongoengine import Document, StringField, IntField, DateTimeField, FloatField
from bson import ObjectId
from tools.customeException import ErrorExc
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

class Article(Document): 
    name = StringField(required=True, max_length=200)
    prix = FloatField(required=True)
    reduction = IntField(required=False)
    description = StringField(required=True, max_length=200)
    prix_kg = FloatField(required=False)

    meta = {'collection': 'article'}  # Nom exact de la collection

    def to_dict(self):
        """Convertir un document en dictionnaire"""
        return {
            "id": str(self.id),  # Convertir l'ObjectId en string
            "name": self.name,
            "prix": self.prix,
            "reduction": self.reduction,
            "description": self.description
        }
    
    def check_fields(self, datas):
        logger.critical("route check_fields")
        if "name" not in datas or len(datas['name'].strip()) == 0:
            raise ErrorExc(f"Veuillez définir un nom d'article.")
        
        if "image" not in datas or len(datas['image'].strip()) == 0:
            raise ErrorExc(f"Veuillez choisir une image.")
        
        if "prix" not in datas or float(datas['prix']) == 0 :
            raise ErrorExc(f"Veuillez définir un prix.")
        
        if "stock" not in datas or int(datas['stock']) == 0 :
            raise ErrorExc(f"Veuillez définir le stock.")
        
        if "description" not in datas or len(datas['description'].strip()) == 0:
            raise ErrorExc(f"Veuillez définir une description.")
        
        if "reduction" in datas:
            if float(datas['reduction']):
                raise ErrorExc(f"Veuillez définir une réduction valide (doit être un nombre).")



    def save_data(self, datas):
        try:
            self.check_fields(datas)
            article = Article(**datas)
            article.save()
            return False, str(article.id) #renvoie false et l'id en string (et non json)
        except Exception as e: 
            raise ErrorExc(f"ça n'a pas marché : {str(e)}")
    
    def update_data(self, datas, id_article):
        try:
            self.check_fields(datas)
            #la collection (l'id de l'objet).a update(**= clé valeur /datas = ses données à update)
            result = Article.objects(id=ObjectId(id_article)).update_one(**datas)
            if result:
                return False, str(result.id)
        except Exception as e: 
            raise ErrorExc(f"ça n'a pas marché : {str(e)}")
    
    def delete_data(self, id_article):
        try:
            logger.critical(id_article)
            if not ObjectId.is_valid(id_article):
                raise ErrorExc("ID invalide")
            result = Article.objects(id=ObjectId(id_article)).delete()
            if result:
                return False
        except Exception as e: 
            raise ErrorExc(f"ça n'a pas marché : {str(e)}")