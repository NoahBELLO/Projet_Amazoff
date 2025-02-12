from mongoengine import Document, StringField, IntField, DateTimeField, FloatField
from datetime import datetime

#liste des fields utiles:
# URLField      pour les URL
# ImageField    pour les images
# EmailField    pour les email

#nouvel_objet = Class(champs1 = "valeur", champ2= "valeur2")
#nouvel_objet.champs1 == "valeur"


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
