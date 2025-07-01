import time
from mongoengine import Document, StringField, IntField, DateTimeField, FloatField, ListField, LongField
from bson import ObjectId
from tools.customeException import ErrorExc
from loguru import logger
from user_python.user_model import UserModel


class AvisModel(Document): 
    id_maria = IntField(required=True)
    article_id = StringField(required=True)
    comment = StringField(required=False)
    name = StringField(required=True)
    fname = StringField(required=True)
    stars = FloatField(required=True)
    date_publication = StringField(required=True)

    meta = {'collection': 'avis' , 'db_alias': 'avis-db'}

    def to_dict(self):
        """Convertir un document en dictionnaire"""
        return {
            "id": str(self.id),  
            "id_maria": int(self.id_maria),
            "article_id": self.article_id,
            "comment": self.comment,
            "name" : self.name,
            "fname": self.fname,
            "stars": self.stars,
            "date_publication": self.date_publication
        }
    
    def check_fields(self, datas):
        if "stars" not in datas or int(datas['stars']) == 0:
            raise ErrorExc(f"Veuillez évaluer l'article.")
                
        if "article_id" not in datas or len(str(datas['article_id'])) == 0 :
            raise ErrorExc(f"Article non fourni.")
        
        if "user_id" not in datas or len(str(datas['user_id'])) == 0 :
            raise ErrorExc(f"Utilisateur non reconnu.")


    def rating_article(self, datas, id_maria):
            self.check_fields(datas)
            article_id = str(datas['article_id'])
            comment = datas['comment']
            stars = float(datas['stars'])

            #ajout de l'utilisateur au données de son commentaire
            user = UserModel.objects(id=datas['user_id']).first()
            if user == None:
                raise ErrorExc("Utilisateur inconnu")
            else:
                user = user.to_dict()

            DATETIME = time.strftime('%d-%m-%Y-%H-%M-%S')
            fname = user['fname']
            name = user['name']
            date_publication = DATETIME
            avis = AvisModel(
                article_id=article_id,
                id_maria=id_maria,
                comment=comment,
                stars=stars,
                fname=fname,
                name=name,
                date_publication=date_publication
            )
            avis2 = avis.to_dict()
            logger.critical(avis2)
            try:
                avis.save()
                return True, str(avis.id)
            except ErrorExc as e:
                logger.error(f"Erreur lors du save : {e}")
                raise ErrorExc("Erreur lors de l'évaluation")
