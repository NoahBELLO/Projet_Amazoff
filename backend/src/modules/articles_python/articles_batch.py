import json
import os
from mongoengine import connect, disconnect_all
from loguru import logger
from articles_python.articles_model import ArticleModel, ArticleModelMD
from tools.customeException import ErrorExc

def run_batch_articles():
    try:
        db = ArticleModel()
        _, articles = db.get_all_articles()
        if len(articles) == 0:
            raise ErrorExc("Liste articles vide")
    except:
        db2 = ArticleModelMD()
        articles = db2.get_all_articles()
        if len(articles) == 0:
            logger.critical("articles vides sur maria")
            
    cache_dir = os.path.join(os.path.dirname(__file__), './', 'cache') #enregistre dans un dossier dans le dossier où se trouve ce script
    os.makedirs(cache_dir, exist_ok=True)

    cache_file = os.path.join(cache_dir, 'cached_articles.json')

    with open(cache_file, "w", encoding="utf-8") as f:
        json.dump(articles, f, indent=2, ensure_ascii=False)

    logger.info("Batch articles exécuté. Fichier sauvegardé dans cache/.")
