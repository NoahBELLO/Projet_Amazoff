from flask import Blueprint, jsonify
from loguru import logger
import src.commandes_en_cours_routes
import src.commandes_livrees_routes
from tools.customeException import ErrorExc

bp = Blueprint("commandes", __name__, url_prefix="/commandes")
bp.register_blueprint(src.commandes_en_cours_routes.bp) #sous routes en cours
bp.register_blueprint(src.commandes_livrees_routes.bp) #sous routes livrees

