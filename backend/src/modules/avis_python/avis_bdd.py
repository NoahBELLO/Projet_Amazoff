from loguru import logger
from tools.mysql import Mysql

_table = "avis"

class TableAvis(Mysql):
    
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
        #index ser pour accèlerer les recherches
        # one delete cascade sert pour garder l'intégrité des données 
        # en cas de suppression tout ce qui est associé l'est aussié
        return f"""
            CREATE TABLE IF NOT EXISTS `avis` (
            `id_maria`        INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
            `id`        CHAR(24)        NOT NULL COMMENT 'ObjectId MongoDB du review',
            `article_id`      CHAR(24)        NOT NULL COMMENT 'ObjectId MongoDB de l’article',
            `comment`         LONGTEXT        NULL,
            `name`            VARCHAR(50)     NOT NULL,
            `fname`           VARCHAR(50)     NOT NULL,
            `stars`           INT(11)         NOT NULL,
            `date_publication` TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (`id_maria`),
            UNIQUE KEY `uq_avis_id_mongo` (`id`),
            INDEX    `idx_avis_article`    (`article_id`),
            CONSTRAINT `fk_avis_article`
                FOREIGN KEY (`article_id`) REFERENCES `article`(`id`)
                ON DELETE CASCADE
            ) ENGINE=InnoDB
            DEFAULT CHARSET=utf8mb4
            COLLATE=utf8mb4_unicode_ci;
        """
    
    def format_for_db(self, datas):
        if 'image' in datas and datas['image'] is None:
            del datas['image']
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
                    elif k == "id_maria":
                        where_str += f'{_table}.id_maria= "{v}"'
                        continue
                    elif k == "id":
                        where_str += f'{_table}.id= "{v}"'
                        continue
                    else:
                        where_str += f'{_table}.{k} = "{v}"'
                            
                where = f"WHERE {where_str}"
                
            query = f"""
                SELECT {_table}.id_maria, {_table}.id, {_table}.name, {_table}.prix, {_table}.image, {_table}.reduction, {_table}.description, {_table}.stock    
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
                SELECT {_table}.id_maria, {_table}.id, {_table}.name, {_table}.prix, {_table}.image, {_table}.reduction, {_table}.description, {_table}.stock    
                FROM {_table}              
                WHERE {_table}.id = "{id_article}"
            """
        rs = self.fetch(query)
        return self.format_from_db(rs[0])