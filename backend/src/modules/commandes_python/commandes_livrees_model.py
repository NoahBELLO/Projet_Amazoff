from mongoengine import Document,  IntField, FloatField, ListField, StringField, DateField
from bson import ObjectId
from tools.customeException import ErrorExc
from loguru import logger
from user_python.user_model import UserModel
import time


class CommandesLivreesModel(Document): 
    user_id = StringField(required=True)
    commandes = ListField(required=True)
    total = FloatField(required=True)
    paiement = StringField(required=True)
    date_publication = StringField(required=True)
    date_livraison = StringField(required=True)

    meta = {'collection': 'commandes_livrees', 'db_alias': 'commandes-db'}

    def to_dict(self):
        """Convertir un document en dictionnaire"""
        return {
            "user_id": self.user_id,
            "commandes": self.commandes,
            "total": self.total,
            "paiement": self.paiement,
        }
    
    def get_commande(self, user_id):
        try:
            commandes = CommandesLivreesModel.objects(user_id=user_id)
            commandes_list = []
            for commande in commandes:
                commandes_list.append(commande.to_dict())
            return True, commandes_list
        except:
            raise ErrorExc("Erreur lors de la récupération des commandes")
        
    
    def create(self, datas):
        #self.check_fields(datas)
        try:
            commande = CommandesLivreesModel(**datas)
            commande.save()
            return True, str(commande.id)
    
        except ErrorExc as e:
            raise ErrorExc(f"Erreur lors de l'enregistrement de la commande {e}")
