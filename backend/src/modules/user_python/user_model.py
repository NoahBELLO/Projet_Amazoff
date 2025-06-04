from mongoengine import Document, StringField
from bson import ObjectId
from tools.customeException import ErrorExc
from loguru import logger


class UserModel(Document): 
    fname = StringField(required=False)
    name = StringField(required=False)

    #strict ignorera les autres champs non spécifiés dans le modèle
    meta = {'collection': 'Users' , 'db_alias': 'users-db', 'strict': False}

    def to_dict(self):
        """Convertir un document en dictionnaire"""
        return {
            "fname": self.fname,
            "name": self.name
        }
    
