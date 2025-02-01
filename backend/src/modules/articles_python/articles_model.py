from mongoengine import Document, StringField, IntField, DateTimeField
from datetime import datetime

class Article(Document):
    title = StringField(required=True, max_length=200)
    author = StringField(required=True)
    content = StringField()
    views = IntField(default=0)
    created_at = DateTimeField(default=datetime.utcnow)

    def to_dict(self):
        """Convertir un document en dictionnaire"""
        return {
            "id": str(self.id),  # Convertir l'ObjectId en string
            "title": self.title,
            "author": self.author,
            "content": self.content,
            "views": self.views,
            "created_at": self.created_at.isoformat()
        }
