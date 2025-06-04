import json
import os
from mongoengine import connect, disconnect_all
from articles_python.articles_model import ArticleModel
from loguru import logger

def run_batch_articles():
    disconnect_all()
    connect(db="Articles", host=os.getenv("MONGO_URI_ARTICLES"), alias='articles-db')

    db = ArticleModel()
    _, articles = db.get_all_articles()

    cache_dir = os.path.join(os.path.dirname(__file__), './', 'cache') #enregistre dans un dossier dans le dossier où se trouve ce script
    os.makedirs(cache_dir, exist_ok=True)

    cache_file = os.path.join(cache_dir, 'cached_articles.json')

    with open(cache_file, "w", encoding="utf-8") as f:
        json.dump(articles, f, indent=2, ensure_ascii=False)

    logger.info("Batch articles exécuté. Fichier sauvegardé dans cache/.")
