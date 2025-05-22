from mongoengine import Document, StringField, IntField, DateTimeField, FloatField, ListField
from bson import ObjectId
from tools.customeException import ErrorExc
from loguru import logger

class AvisModel(Document): 
    article_id = StringField(required=True)
    evaluations = IntField(required=False)
    stars = FloatField(required=False)
    comments = ListField(required=True)

    meta = {'collection': 'avis' , 'db_alias': 'avis-db'}

    def to_dict(self):
        """Convertir un document en dictionnaire"""
        return {
            "id": str(self.id),  
            "article_id": self.article_id,
            "evaluations": self.evaluations,
            "comments": self.comments,
            "stars": self.stars
        }
    
    def check_fields(self, datas):
        comments = datas['comments']
        if "stars" not in comments or int(comments['stars']) == 0:
            raise ErrorExc(f"Veuillez évaluer l'article.")
                
        if "article_id" not in datas or len(str(datas['article_id'])) == 0 :
            raise ErrorExc(f"Article non fourni.")
        
        if "user_id" not in comments or len(str(comments['user_id'])) == 0 :
            raise ErrorExc(f"Utilisateur non reconnu.")

    
    def rating_article(self, datas):
            #datas = article_id, rating, user_id, comment
            self.check_fields(datas)
            article_id = str(datas['article_id'])
            comments = datas['comments']
            stars = float(comments['stars'])
            try:
                avis = AvisModel.objects(article_id=article_id).first()  
                if avis is None:
                    avis = AvisModel(
                        article_id=article_id,
                        stars=stars,
                        evaluations=1,
                        comments=[comments] 
                    )
                    logger.info(f"Création d'un nouvel avis pour l'article {article_id}")
                    avis.save()
                    return True
                else:
                    avis.stars = (float(avis.stars) * int(avis.evaluations) + stars) / (avis.evaluations + 1)
                    avis.comments.append(comments)
                    avis.save()
                    return True
                
            except ErrorExc as e:
                logger.error(f"Erreur lors du save : {e}")
                raise ErrorExc("Erreur lors de l'évaluation")
