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
    id = 0
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
    
    def save_data(self, datas):
        try:
            article = Article(**datas)
            article.save()
            return False, self.id
        except Exception as e: 
            raise ErrorExc(f"ça n'a pas marché : {str(e)}")
    
    def update_data(self, datas, id_article):
        try:
            #la collection (l'id de l'objet).a update(**= clé valeur /datas = ses données à update)
            result = Article.objects(id=ObjectId(id_article)).update_one(**datas)
            if result:
                return False, self.id
        except Exception as e: 
            raise ErrorExc(f"ça n'a pas marché : {str(e)}")