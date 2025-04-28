from mongoengine import Document,  IntField, FloatField, ListField, StringField
from bson import ObjectId
from tools.customeException import ErrorExc
from loguru import logger
from articles_python.articles_model import ArticleModel

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
    articles = ListField(required=False)

    meta = {'collection': 'panier', 'db_alias': 'paniers-db'}  # nom exact de la collection

    def to_dict(self):
        """Convertir un document en dictionnaire"""
        return {
            "id": str(self.id), #l'id du panier
            "user_id": str(self.user_id), #l'id de l'user
            "articles": [str(article_id) for article_id in self.articles],  # convertir les ObjectId en chaînes
        }
    
    def get_cart(self, user_id):
        try:
            panier = PanierModel.objects(user_id=user_id).first()
            if not panier:
                raise ErrorExc("Aucun panier trouvé pour cet utilisateur.")

            articles = []
            for id_article in panier.articles:
                logger.critical(ObjectId(id_article))

                item = ArticleModel.objects(id=id_article).first()
                logger.critical(item)
                if item:
                    articles.append(item.to_dict())

            logger.critical(articles)
            return True, {
                "articles": articles
            }
        except Exception as e:
            raise ErrorExc(f"Erreur lors de la récupération du panier : {str(e)}")
        
        
        
    #à la création du compte créer un panier
    def create_cart(self, user_id):
        if user_id:
            try:
                is_unique = PanierModel.objects(user_id=user_id).first()
                if is_unique:
                    raise ErrorExc("Un panier existe déjà pour cet utilisateur.")

                
                panier = PanierModel(user_id=user_id)
                panier.save()
                return True, str(panier.id)  # Renvoie True et l'id en string
            except Exception as e:
                raise ErrorExc(f"Erreur lors de la création du panier : {str(e)}")
            
        raise ErrorExc("ID utilisateur obligatoire")
    
    def update_cart(self, datas, user_id):
        try:
            if 'articles' not in datas:
                raise ErrorExc("Les données doivent contenir la section 'articles'.")

            # update
            articles = []
            for article in datas['articles']:
                articles.append(ObjectId(article)) #article convertis en objectId

            result = PanierModel.objects(user_id=str(user_id)).update_one(set__articles=articles)

            logger.critical(user_id)
            if result == 0:
                raise ErrorExc("Aucun panier trouvé pour cet utilisateur ou aucune modification effectuée.")

            logger.critical(f"Panier mis à jour pour l'utilisateur {user_id}")

            return True, str(user_id) 
        
        except Exception as e:
            raise ErrorExc(f"Erreur lors de la mise à jour du panier : {str(e)}")
    

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

            return True
        except Exception as e:
            raise ErrorExc(f"Erreur lors de la suppression du panier : {str(e)}")
    
