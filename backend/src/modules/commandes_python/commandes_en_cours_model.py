from bson import ObjectId
from mongoengine import Document, IntField, FloatField, ListField, StringField, DateTimeField
from tools.customeException import ErrorExc
from loguru import logger
from user_python.user_model import UserModel
import time


class CommandesEnCoursModel(Document): 
    user_id = StringField(required=True)
    commandes = ListField(required=True)
    total = FloatField(required=True)
    paiement = StringField(required=True)
    date_publication = StringField(required=False)

    meta = {'collection': 'commandes_en_cours', 'db_alias': 'commandes-db'}

    def to_dict(self):
        """Convertir un document en dictionnaire"""
        return {
            "user_id": self.user_id,
            "commandes": self.commandes,
            "total": self.total,
            "paiement": self.paiement,
            "date_publication" : self.date_publication
        }
    
    def check_fields(self, datas):
        if "commandes" not in datas or not isinstance(datas["commandes"], list) or len(datas["commandes"]) == 0:
            raise ErrorExc("Liste des articles (commandes) introuvable ou vide.")
        
        if "user_id" not in datas or not str(datas["user_id"]).strip():
            raise ErrorExc("Utilisateur non reconnu.")

        if "paiement" not in datas or not str(datas["paiement"]).strip():
            raise ErrorExc("Méthode de paiement manquante.")
        
        if "total" not in datas or not isinstance(datas["total"], (int, float)):
            raise ErrorExc("Total de la commande manquant ou invalide.")

        return datas

    def get_commande(self, user_id):
        try:
            commandes = CommandesEnCoursModel.objects(user_id=user_id)
            commandes_list = []
            for commande in commandes:
                commandes_list.append(commande.to_dict())
            return True, commandes_list
        except:
            raise ErrorExc("Erreur lors de la récupération des commandes")
        

    def create(self, user_id, datas):
        self.check_fields(datas)
        try:
            user = UserModel.objects(id=user_id).first().to_dict()
            if user == None:
                raise ErrorExc("Utilisateur inconnu")
            datas['date_publication'] =  time.strftime('%d-%m-%Y-%H-%M-%S') #date en string
            datas['user_id'] = user_id
            logger.critical(datas)
            commande = CommandesEnCoursModel(**datas)
            commande.save()
            return True, str(commande.id)
    
        except ErrorExc as e:
            raise ErrorExc(f"Erreur lors de l'enregistrement de la commande {e}")

    def delete(self, commandes_id):
        try:
            if not ObjectId.is_valid(commandes_id):
                raise ErrorExc("ID invalide")
            commande = CommandesEnCoursModel.objects(id=ObjectId(commandes_id)).first().to_dict()
            commande['date_livraison'] = time.strftime('%d-%m-%Y-%H-%M-%S')
            user_id = commande['user_id']
            result = CommandesEnCoursModel.objects(id=ObjectId(commandes_id)).delete()
            if result:
                return False, commande, user_id #backup si jamais l'insertion dans l'autre bdd foire
            else:
                raise ErrorExc("c'est pas bon") 
        except:
            raise ErrorExc("Erreur lors de la suppression")