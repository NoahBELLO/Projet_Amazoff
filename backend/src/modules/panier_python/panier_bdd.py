import json
from loguru import logger
from tools.mysql import Mysql

_table = "panier"

class TablePanier(Mysql):
    
    def __init__(self):     
        super().__init__(self.create_script())
          
    def create(self, datas):
        return self.insert_auto(table=_table, datas=self.format_for_db(datas))
              
    def update(self, id, datas):
        return self.update_auto(table=_table, id=id, datas=self.format_for_db(datas))      

    def delete(self, id):    
        query = f""" DELETE FROM {_table} WHERE {_table}.user_id = '{id}' """
        rs = self.query(query)
        return rs
    
    def create_script(self):
        return f"""
            CREATE TABLE `panier` (
            `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
            `id_mongo` VARCHAR(24) NOT NULL,
            `user_id` VARCHAR(24) NOT NULL,
            `total` DECIMAL(10,2) NOT NULL,
            `articles` LONGTEXT,
            `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            UNIQUE KEY `uq_panier_id_mongo` (`id_mongo`),
            INDEX `idx_panier_user` (`user_id`)
            ) ENGINE=InnoDB
            DEFAULT CHARSET=utf8mb4
            COLLATE=utf8mb4_unicode_ci;
        """
    
    def format_for_db(self, datas):
        if 'articles' in datas and isinstance(datas['articles'], list):
            datas['articles'] = json.dumps(datas['articles'])  

        if 'updatedAt' in datas:
            del(datas['updatedAt'])
        if 'createdAt' in datas:
            del(datas['createdAt'])
            
        logger.critical(datas)
        return datas

    def format_from_db(self, datas):
        if 'articles' in datas and datas['articles'] is not None and str(datas['articles']).strip() != "": 
            datas['articles'] = json.loads(datas['articles']) 
        else:
            datas['articles'] = []
        return datas

    def get_cart(self, user_id):
        query = f"""
            SELECT *
            FROM {_table}
            WHERE {_table}.user_id = "{user_id}"
            """
        rs = self.fetch(query)
        if rs:
            return self.format_from_db(rs[0])
        return False