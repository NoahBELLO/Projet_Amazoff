import os

class DevelopmentConfig:
    DB_LOCAL_HOST     = os.environ.get('DB_LOCAL_HOST')
    DB_LOCAL_LOGIN    = os.environ.get('DB_LOCAL_LOGIN')
    DB_LOCAL_PASSWORD = os.environ.get('DB_LOCAL_PASSWORD')
    DB_LOCAL_NAME     = os.environ.get('DB_LOCAL_NAME')
    DB_LOCAL_PORT     = os.environ.get('DB_LOCAL_PORT', 33066)
