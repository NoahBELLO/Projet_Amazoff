from mongoengine import Document,  IntField, FloatField, ListField, StringField
from bson import ObjectId
from tools.customeException import ErrorExc
from loguru import logger

#liste des fields utiles:
# URLField      pour les URL
# ListField     pour les liste
# EmailField    pour les email

#nouvel_objet = Class(champs1 = "valeur", champ2= "valeur2")
#nouvel_objet.champs1 == "valeur"

# .objects(champs=valeur)       itère sur les pages qui on valeur comme champs
# .save()                       perform an insert or update si ça existe
# .delete()                     supprime 

class PanierModel(Document): 
    user_id = StringField(required=True, unique=True) #user unique
    total = FloatField(required=False, default=0.0) #total débute à zero
    articles = ListField(required=False)

    meta = {'collection': 'panier', 'db_alias': 'paniers-db'}  # nom exact de la collection

    def to_dict(self):
        """Convertir un document en dictionnaire"""
        return {
            "id": str(self.id), #l'id du panier
            "user_id": str(self.user_id), #l'id de l'user
            "total": self.total,
            "articles": [str(article_id) for article_id in self.articles],  # convertir les ObjectId en chaînes
        }
    
    #à la création du compte créer un panier
    def create_cart(self, user_id):
        if user_id:
            try:
                is_unique = PanierModel.objects(user_id=user_id).first()
                if is_unique:
                    raise ErrorExc("Un panier existe déjà pour cet utilisateur.")

                
                panier = PanierModel(user_id=user_id)
                panier.save()
                logger.critical("Panier sauvegardé")
                return True, str(panier.id)  # Renvoie True et l'id en string
            except Exception as e:
                raise ErrorExc(f"Erreur lors de la création du panier : {str(e)}")
        raise ErrorExc("ID utilisateur obligatoire")
    
    # def update_data(self, datas, id_article):
    #     try:
    #         self.check_fields(datas)
    #         #la collection (l'id de l'objet).a update(**= clé valeur /datas = ses données à update)
    #         result = PanierModel.objects(id=ObjectId(id_article)).update_one(**datas)
    #         if result:
    #             return True, str(result.id)
    #     except Exception as e: 
    #         raise ErrorExc(f"ça n'a pas marché : {str(e)}")
    

    # #à la suppresion du compte supprime le panier
    def delete_cart(self, user_id):
        try:
            # Vérifiez si le user_id est valide
            if not user_id:
                raise ErrorExc("ID utilisateur invalide")

            # Supprimez le panier associé à l'utilisateur
            result = PanierModel.objects(user_id=user_id).delete()
            if result == 0:
                raise ErrorExc("Aucun panier trouvé pour cet utilisateur.")

            logger.critical(f"Panier supprimé pour l'utilisateur {user_id}")
            return True
        except Exception as e:
            raise ErrorExc(f"Erreur lors de la suppression du panier : {str(e)}")