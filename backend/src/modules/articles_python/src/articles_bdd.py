import json
from loguru import logger
from tools.mysql import Mysql

_table = "article"
_table_avis = "avis"

class TableArticles(Mysql):
    
    def __init__(self):     
        super().__init__(self.create_script())
          
    def create(self, datas):
        return self.insert_auto(table=_table, datas=self.format_for_db(datas))
              
    def update(self, id, datas):
        return self.update_auto(table=_table, id=id, datas=self.format_for_db(datas))      

    def delete(self, id):    
        query = f"DELETE FROM {_table} WHERE {_table}.id_maria = {id}"
        rs = self.query(query)
        logger.critical(rs)
        logger.critical(query)
        return rs
    
    def create_script(self):
        return f"""
            CREATE TABLE `article` (
            `id_maria`   INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
            `id`   CHAR(24)        NOT NULL ,
            `name`       VARCHAR(200)    NOT NULL,
            `prix`       FLOAT  NOT NULL,
            `image`      VARCHAR(255)    NULL,
            `reduction`  INT             NULL,
            `description` VARCHAR(200)   NOT NULL,
            `stock`      INT(11)   NOT NULL,
            PRIMARY KEY (`id_maria`),
            UNIQUE KEY `uq_article_id` (`id`)
            ) ENGINE=InnoDB
            DEFAULT CHARSET=utf8mb4
            COLLATE=utf8mb4_unicode_ci;
        """
    
    def format_for_db(self, datas):
        if 'image' in datas and datas['image'] is None:
            del datas['image']

        return datas
    
    def format_from_db(self, datas):
        if 'avis' in datas:
            datas['avis'] = json.loads(datas['avis']) 

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
        query =  f"""
            SELECT
            {_table}.id_maria, {_table}.id,  {_table}.name, {_table}.prix, {_table}.image, {_table}.reduction, {_table}.description, {_table}.stock,
            CONCAT(
                '[',
                GROUP_CONCAT(
                CONCAT(
                    '{{"avis_id_maria":', {_table_avis}.id_maria,
                    ',"comment":"',   REPLACE({_table_avis}.comment, '"', '\\\\"'),
                    '","name":"',      {_table_avis}.name,
                    '","fname":"',     {_table_avis}.fname,
                    '","stars":',      {_table_avis}.stars,
                    ',"date_publication":"', {_table_avis}.date_publication,
                    '"}}'
                )
                SEPARATOR ','
                ),
                ']'
            ) AS avis
            FROM {_table}
            LEFT JOIN {_table_avis}
            ON {_table}.id = {_table_avis}.article_id
            WHERE {_table}.id = '{id_article}'
            GROUP BY
            {_table}.id_maria,
            {_table}.id,
            {_table}.name,
            {_table}.prix,
            {_table}.image,
            {_table}.reduction,
            {_table}.description,
            {_table}.stock
            ;
            """

        rs = self.fetch(query)
        return self.format_from_db(rs[0])