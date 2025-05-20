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
    total = FloatField(required=False, default=0.0)

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
            panier_bdd = PanierModel.objects(user_id=str(user_id)).first()
            if not panier_bdd:
                raise ErrorExc("Aucun panier trouvé pour cet utilisateur.")

            panier_user = []
            for article in panier_bdd.articles:
                article_magasin = ArticleModel.objects(id=article['article_id']).first()

                if article_magasin:
                    article_magasin_dict = article_magasin.to_dict()
                    #on ajoute le sous total par rapport au prix de la bdd (last updated price)
                    article_magasin_dict['sous_total'] = float(article_magasin_dict['prix']) * float(article['quantite'])
                    #ajout de la quantité de l'utilisateur
                    article_magasin_dict['quantite_utilisateur'] = article['quantite']
                    panier_user.append(article_magasin_dict)             
                  
            return True, {
                "articles": panier_user
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
                return True, str(panier.id) 
            except Exception as e:
                raise ErrorExc(f"Erreur lors de la création du panier : {str(e)}")
            
        raise ErrorExc("ID utilisateur obligatoire")


    def delete_article(self, article_to_delete, user_id):
        #logger.critical(f"user_id: {user_id}, id_article: {id_article}")
        try:
            panier = PanierModel.objects(user_id=str(user_id)).first() #récup du panier
            if not panier:
                raise ErrorExc("Panier non trouvé")
            new_articles = []
            for article in panier.articles:
                if str(article['article_id']) != str(article_to_delete['article_id']):
                    new_articles.append(article)
                    
            panier.articles = new_articles
            logger.critical(panier.articles)
            panier.save()

            return True
        except:
            raise ErrorExc("L'article non trouvé dans le panier")    

    def add_reduce_quantity(self, article_id, quantite, user_id, edit=False):
        try:
            article = ArticleModel.objects(id=article_id).first()
            if not article or article.stock < float(quantite):#vérif des stocks dispo
                raise ErrorExc ("Stock insuffisant")
            panier = PanierModel.objects(user_id=str(user_id)).first() #récup du panier
            article_trouve = self.article_present_dans_panier(panier, article_id)

            if article_trouve and edit == False:
                article_trouve['quantite'] += float(quantite)
            elif article_trouve and edit == True:
                article_trouve['quantite'] = float(quantite)
            else:
                panier.articles.append({
                    "article_id": article_id,
                    "quantite": float(quantite)
                })
            panier.save()

            return True
        except :
            raise ErrorExc("Erreur modification du panier")  

    
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
    
    #fonction utilitaire pour chercher si un article est dans le panier
    def article_present_dans_panier(self, panier, article_id):
        for article_panier in panier.articles:
            if article_panier['article_id'] == article_id:
                return article_panier
        return None
