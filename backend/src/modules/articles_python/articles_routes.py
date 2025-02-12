from flask import Blueprint, jsonify, request
from loguru import logger
from articles_python.articles_model import Article

bp = Blueprint("articles", __name__, url_prefix="/articles")

# .objects(champs=valeur)       itère sur les pages qui on valeur comme champs
# .save()                       perform an insert or update si ça existe
# .delete()                     supprime 
#https://docs.mongoengine.org/guide/querying.html
# ne – not equal to
# lt – less than
# lte – less than or equal to
# gt – greater than
# gte – greater than or equal to
# in – value is in list (a list of values should be provided)
# nin – value is not in list (a list of values should be provided)
# mod – value % x == y, where x and y are two provided values
# all – every item in list of values provided is in array
# size – the size of the array is
# exists – value for field exists

# exact – string field exactly matches value
# iexact – string field exactly matches value (case insensitive)
# contains – string field contains value
# icontains – string field contains value (case insensitive)
# startswith – string field starts with value
# istartswith – string field starts with value (case insensitive)
# endswith – string field ends with value
# iendswith – string field ends with value (case insensitive)
# wholeword – string field contains whole word
# iwholeword – string field contains whole word (case insensitive)
# regex – string field match by regex
# iregex – string field match by regex (case insensitive)
# match – performs an $elemMatch so you can match an entire document within an array



@bp.route("/", methods=["GET"])
def get_articles():
    articles = Article.objects()  # Récupérer tous les articles avec .objects
    return jsonify({"articles": [article.to_dict() for article in articles]})

@bp.route("/<article_id>", methods=["GET"])
def get_article(article_id):
    article = Article.objects(id=article_id).first() #.first pour récup le premier de la liste
    if not article:
        return jsonify({"error": "Article not found"}), 404
    return jsonify(article.to_dict())
