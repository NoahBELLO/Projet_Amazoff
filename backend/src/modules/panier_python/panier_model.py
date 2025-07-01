from mongoengine import Document,  IntField, FloatField, ListField, StringField
from bson import ObjectId
from tools.customeException import ErrorExc
from articles_python.articles_model import ArticleModel
from articles_python.articles_bdd import TableArticles
from panier_python.panier_bdd import TablePanier
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
    id_maria = IntField(required=True)
    articles = ListField(required=False)

    meta = {'collection': 'panier', 'db_alias': 'paniers-db'}  # nom exact de la collection

    def to_dict(self):
        """Convertir un document en dictionnaire"""
        return {
            "id": str(self.id), #l'id du panier
            "id_maria": int(self.id_maria),
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
                #@model
                article_magasin = ArticleModel.objects(id=article['article_id']).first()

                if article_magasin:
                    article_magasin_dict = article_magasin.to_dict()
                    #on ajoute le sous total par rapport au prix de la bdd (last updated price)
                    article_magasin_dict['sous_total'] = float(article_magasin_dict['prix']) * float(article['quantite'])
                    #ajout de la quantité de l'utilisateur
                    article_magasin_dict['quantite_utilisateur'] = article['quantite']
                    panier_user.append(article_magasin_dict)             
                  
            return True, {"articles": panier_user}
        except Exception as e:
            raise ErrorExc(f"Erreur lors de la récupération du panier : {str(e)}")
        
        
        
    #à la création du compte créer un panier
    def create_cart(self, user_id, id_maria, id_mongo):
        if user_id:
            try:
                is_unique = PanierModel.objects(user_id=user_id).first()
                if is_unique:
                    raise ErrorExc("Un panier existe déjà pour cet utilisateur.")
                
                panier = PanierModel(id=id_mongo, user_id=user_id, id_maria=id_maria)
                panier.save()
                return True, str(panier.id) 
            except Exception as e:
                raise ErrorExc(f"Erreur lors de la création du panier : {str(e)}")
            
        raise ErrorExc("ID utilisateur obligatoire")


    def delete_article(self, article_to_delete, user_id):
        
            panier = PanierModel.objects(user_id=str(user_id)).first() #récup du panier
            if not panier:
                raise ErrorExc("Panier non trouvé")
            new_articles = []
            for article in panier.articles:
                if str(article['article_id']) != str(article_to_delete):
                    new_articles.append(article)
                continue
            panier.articles = new_articles
            panier.save()

            return True, article_to_delete
        # except:
        #     raise ErrorExc("Article non trouvé dans le panier")    

    def add_reduce_quantity(self, article_id, quantite, user_id, edit=False):
        try:
            #@model
            article = ArticleModel.objects(id=article_id).first()
            if not article or article.stock < float(quantite):#vérif des stocks dispo
                raise ErrorExc ("Stock insuffisant")
            panier = PanierModel.objects(user_id=str(user_id)).first() #récup du panier

            article_trouve = self.article_present_dans_panier(panier, article_id)
            if not article_trouve:
                panier.articles.append({
                    "article_id": article_id,
                    "quantite": float(quantite)
                })
            elif article_trouve and edit == False:
                article_trouve['quantite'] += float(quantite)
            elif article_trouve and edit == True:
                article_trouve['quantite'] = float(quantite)       
            panier.save()

            return True, article_id
        except :
            raise ErrorExc("Erreur modification du panier")  

    
    # #à la suppresion du compte supprime le panier
    def delete_cart(self, user_id):
        try:
            if not user_id:
                raise ErrorExc("ID utilisateur invalide")

            result = PanierModel.objects(user_id=user_id).delete()
            if result == 0:
                raise ErrorExc("Aucun panier trouvé pour cet utilisateur.")

            return True
        except Exception as e:
            raise ErrorExc(f"Erreur lors de la suppression du panier : {str(e)}")
    
    def update_cart(self, user_id, panier_data):
        try:
            panier = PanierModel.objects(user_id=str(user_id).first())
            if not panier:
                raise ErrorExc("Panier non trouvé pour cet utilisateur.")
            panier.articles = panier_data['articles']
            panier.save()
            return True, panier.to_dict()
        except Exception as e:
            raise ErrorExc(f"Erreur lors de la mise à jour du panier: {str(e)}")
    
    #fonction utilitaire pour chercher si un article est dans le panier
    def article_present_dans_panier(self, panier, article_id):
        for article_panier in panier.articles:
            if article_panier['article_id'] == article_id:
                return article_panier
        return False
    
class PanierModelMD():
    _id = 0
    _user_id = 0
    
    def __init__(self, id = 0):
        self._db = TablePanier()
        if id :
            self._id = id
    
    def create_cart(self, datas):
        _user_id = datas['user_id']
        db = TablePanier()
        db.create(datas)
        if db.getLastId() < 1:
            raise ErrorExc("Échec de l'insertion en base de données.")
        id = db.getLastId()
        return True, id
    
    def get_cart(self, user_id):
        try:
            db = TablePanier()
            panier_bdd = db.get_cart(user_id)
            if not panier_bdd:
                raise ErrorExc("Aucun panier trouvé pour cet utilisateur")
            panier_user = []
            #@model
            db_articles = TableArticles()
            for article in panier_bdd['articles']:
                article_magasin = db_articles.get_by_id(article['article_id'])
                article_magasin['sous_total'] = float(article_magasin['prix']) * float(article['quantite'])
                article_magasin['quantite_utilisateur'] = article['quantite']
                panier_user.append(article_magasin)
            
            return True, {"id_maria": panier_bdd['id_maria'], "id": panier_bdd['id'], "articles": panier_user}
        except Exception as e:
            raise ErrorExc(f"Erreur lors de la récupération du panier : {str(e)}")
    
    def get_cart_backup(self, user_id):
        try:
            db = TablePanier()
            panier = db.get_cart(user_id)
            return True, panier
        except ErrorExc as e:
            raise(f"Erreur lors de la récupération du panier str{e}")

        
    def delete_article(self, article_to_delete, user_id):
        try:
            db = TablePanier()
            panier = db.get_cart(user_id)           
            if not panier:
                raise ErrorExc("Panier non trouvé")
            new_articles = []
            for article in panier['articles']:
                if str(article['article_id']) != str(article_to_delete):
                    new_articles.append(article)
            
            panier['articles'] = new_articles
            
            db.update(id=panier['id_maria'], datas=panier)  
            rs = db.get_cart(user_id) #pour vérifier que le panier a bien été modifié
      
            return True, article_to_delete
        except:
            raise ErrorExc("Erreur lors de la suppression de l'article du panier")   

    def add_reduce_quantity(self, article_id, quantite, user_id, edit=False):
        try:
            #vérif de l'article et du stock
            #@model
            db_article = TableArticles()
            article = db_article.get_by_id(article_id)
            if not article or article['stock'] < float(quantite):
                raise ErrorExc ("Stock insuffisant")
            #obtention du panier
            db = TablePanier()
            panier = db.get_cart(user_id)
            if panier:
                article_trouve = self.article_present_dans_panier(panier['articles'], article_id)
                if not article_trouve:
                    panier['articles'].append({
                        "article_id": article_id,
                        "quantite": float(quantite)
                    })
                elif article_trouve and edit == False:
                    article_trouve['quantite'] += float(quantite)
                elif article_trouve  and edit == True:
                    article_trouve['quantite'] = float(quantite)
               
                db.update(panier['id_maria'], panier)
                if not db.isValid():
                    raise ErrorExc("Modification non sauvegardée en base de données.")   

            return True, article_id
        except ErrorExc as e:
            raise ErrorExc(f"Erreur modification du panier {e}")  

    
    def delete_cart(self, user_id):
        try: 
            if not user_id:
                raise ErrorExc("ID utilisateur invalide")
            
            db = TablePanier()
            rs = db.delete(user_id)
            if rs:
                return True
        except Exception as e:
            raise ErrorExc(f"Erreur lors de la suppression du panier : {str(e)}")
   
    def update(self, id_article, datas):
        db = TablePanier()
        db.update(id_article, datas)
        if not db.isValid():
            raise ErrorExc("Modification non sauvegardée en base de données.")
        return True, id_article
        
    def article_present_dans_panier(self, panier, article_id):
        for article_panier in panier:
            if str(article_panier['article_id']) == str(article_id):
                return article_panier
        return False
    
    def recreate_cart(self, id_maria, datas):
        db = TablePanier()
        rs = db.recreate_cart(id_maria, datas)
        if rs:
            return True
        raise ErrorExc("Échec de la restauration du panier en base de données.")