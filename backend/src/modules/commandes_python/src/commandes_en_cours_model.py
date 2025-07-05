from bson import ObjectId
from mongoengine import Document, IntField, FloatField, ListField, StringField, DateTimeField
from tools.customeException import ErrorExc
from loguru import logger
# from user_python.user_model import UserModel #@model (code serveur)
import time
import random
import requests
import os


class CommandesEnCoursModel(Document): 
    user_id = StringField(required=True)
    commandes = ListField(required=True)
    total = FloatField(required=True)
    paiement = StringField(required=True)
    date_publication = StringField(required=False)
    numero_commande = IntField(required=True, unique=True)

    meta = {'collection': 'commandes_en_cours', 'db_alias': 'commandes-db'}

    def to_dict(self):
        """Convertir un document en dictionnaire"""
        return {
            "user_id": self.user_id,
            "commandes": self.commandes,
            "total": self.total,
            "paiement": self.paiement,
            "date_publication" : self.date_publication,
            "numero_commande": self.numero_commande
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
    def generate_unique_numero(self):
        MAX_TRIES = 1000
        for _ in range(MAX_TRIES):
            numero = random.randint(100000, 999999)  # 6 chiffres
            en_cours_exists = CommandesEnCoursModel.objects(numero_commande=numero).first()
            try:
                #import local !
                from commandes_livrees_model import CommandesLivreesModel
                livree_exists = CommandesLivreesModel.objects(numero_commande=numero).first()
            except ImportError:
                livree_exists = None  

            if not en_cours_exists and not livree_exists:
                logger.critical(numero)
                return numero
        raise ErrorExc("Impossible de générer un numéro de commande unique après plusieurs tentatives.")

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
            #@model (code serveur)
            # user = UserModel.objects(id=user_id).first().to_dict()
            # if user == None:
            #     raise ErrorExc("Utilisateur inconnu")
            #@docker (code docker)
            user_url = os.getenv("URL_USER_DOCKER") + f"commandes_filtrer/id/{user_id}"
            user_response = requests.get(user_url)
            if user_response.ok:
                user = user_response.json().get('rs', {})
            else:
                raise ErrorExc("Utilisateur inconnu")
            datas['date_publication'] =  time.strftime('%d-%m-%Y-%H-%M-%S') #date en string
            datas['user_id'] = user_id
            datas['numero_commande'] = self.generate_unique_numero()
            commande = CommandesEnCoursModel(**datas)
            commande.save()
            #implémenter ici les routes appelant le service notification pour signaler des stocks faibles
            return True, str(commande.id)
    
        except ErrorExc as e:
            raise ErrorExc(f"Erreur lors de l'enregistrement de la commande {e}")

    def delete(self, numero_commande):
        try:
            commande = CommandesEnCoursModel.objects(numero_commande=numero_commande).first().to_dict()
            commande['date_livraison'] = time.strftime('%d-%m-%Y-%H-%M-%S')
            user_id = commande['user_id']
            result = CommandesEnCoursModel.objects(numero_commande=numero_commande).delete()
            if result:
                return False, commande, user_id #backup si jamais l'insertion dans l'autre bdd foire
            else:
                raise ErrorExc("c'est pas bon") 
        except:
            raise ErrorExc("Erreur lors de la suppression")