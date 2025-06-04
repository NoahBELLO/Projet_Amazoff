# from flask import Blueprint, jsonify, request
# from loguru import logger
# from user_python.user_model import UserModel
# from tools.customeException import ErrorExc

# bp = Blueprint("users", __name__, url_prefix="/users")


# #route get all articles
# @bp.route("/", methods=["GET"])
# def get_users():
#     logger.critical("get all users")
#     try:
#         utilisateurs = []
#         users = UserModel.objects()

#         for user in users:
#             user = user.to_dict()
#             utilisateurs.append(user)
#         logger.critical(utilisateurs)
            
#         return jsonify(utilisateurs)
#     except ErrorExc as e:
#         return jsonify({"error": True, "rs": str(e)})
    