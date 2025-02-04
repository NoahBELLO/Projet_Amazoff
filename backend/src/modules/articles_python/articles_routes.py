from flask import Blueprint, jsonify, request
from articles_python.articles_model import Article

bp = Blueprint("articles", __name__, url_prefix="/articles")

@bp.route("/", methods=["GET"])
def get_articles():
    articles = Article.objects()  # Récupérer tous les articles
    return jsonify({"articles": [article.to_dict() for article in articles]})

@bp.route("/<article_id>", methods=["GET"])
def get_article(article_id):
    article = Article.objects(id=article_id).first()
    if not article:
        return jsonify({"error": "Article not found"}), 404
    return jsonify(article.to_dict())
