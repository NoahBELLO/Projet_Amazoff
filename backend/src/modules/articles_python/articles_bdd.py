from loguru import logger
from tools.mysql import Mysql

_table = "article"

class TableArticles(Mysql):
    
    def __init__(self):     
        super().__init__(self.create_script())
          
    def create(self, datas):
        return self.insert_auto(table=_table, datas=self.format_for_db(datas))
              
    def update(self, id, datas):
        return self.update_auto(table=_table, id=id, datas=self.format_for_db(datas))      

    def delete(self, id):    
        query = f"DELETE FROM {_table} WHERE id = {id}"
        rs = self.query(query)
        return rs
    
    def create_script(self):
        return f"""
            CREATE TABLE `article` (
            `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
            `id_mongo` VARCHAR(200) NOT NULL,
            `name` VARCHAR(200) NOT NULL,
            `prix` FLOAT  NOT NULL,
            `image` VARCHAR(255) NULL,
            `reduction` INT(10) NULL,
            `description` VARCHAR(200) NOT NULL,
            `prix_kg` FLOAT  NULL,
            `stock` FLOAT NOT NULL,
            PRIMARY KEY (`id`)
            );

        """
    
    def format_for_db(self, datas):
        return datas
    
    def format_from_db(self, datas):
        return datas

    def search(self, filters, limit=100):        
            logger.critical(filters)
            where = ""
            if filters :
                where_str = ""
                i = 0
                for k in filters:
                    if i > 0 :
                        where_str += " AND "
                    i = i+1
                    
                    v = filters[k]
                    if isinstance(v, str) and "*" in v:
                        v = str(v).replace('*', '%')

                    if k == "name":
                        where_str += f'({_table}.name LIKE "%{v}%")'
                        continue
                    elif k == "id_mongo":
                        where_str += f'{_table}.id_mongo = {v}'
                        continue
                    else:
                        where_str += f'{_table}.{k} = "{v}"'
                            
                where = f"WHERE {where_str}"
                
            query = f"""
                SELECT {_table}.id, {_table}.name, {_table}.prix, {_table}.image, {_table}.reduction, {_table}.description, {_table}.prix_kg, {_table}.stock    
                FROM {_table}              
                {where}

            """
            rs = self.fetch(query)
            if limit:
                query += f" LIMIT 0, {limit}"
            # Exécution de la requête
            return rs
    
    def get_by_id(self, id_article):
        query = f"""
                SELECT {_table}.id, {_table}.name, {_table}.prix, {_table}.image, {_table}.reduction, {_table}.description, {_table}.prix_kg, {_table}.stock    
                FROM {_table}              
                WHERE {_table}.id_mongo = "{id_article}"
            """
        rs = self.fetch(query)
        return self.format_from_db(rs[0])