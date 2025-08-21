USE amazoff;

CREATE TABLE `article` (
  `id_maria` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `id` CHAR(24) NOT NULL,
  `name` VARCHAR(200) NOT NULL,
  `prix` FLOAT NOT NULL,
  `image` VARCHAR(255) NULL,
  `reduction` INT NULL,
  `description` VARCHAR(200) NOT NULL,
  `stock` INT(11) NOT NULL,
  PRIMARY KEY (`id_maria`),
  UNIQUE KEY `uq_article_id` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

INSERT INTO
  `article` (
    `id`,
    `name`,
    `prix`,
    `image`,
    `reduction`,
    `description`,
    `stock`
  )
VALUES
  (
    '67e6a8b27dbd409b4d1e96e7',
    'Teeshirt Orange',
    20.00,
    'teeshirt_orange.png',
    10,
    'Un tee-shirt orange.',
    5
  ),
  (
    '67e6a8b27dbd409b4d1e96e8',
    'Teeshirt Bleu',
    15.50,
    'teeshirt_bleu.png',
    10,
    'Un tee-shirt bleu.',
    3
  ),
  (
    '67e6a90b7dbd409b4d1e96e9',
    'Teeshirt Vert',
    0.50,
    'teeshirt_vert.png',
    10,
    'Un tee-shirt moche.',
    0
  ),
  (
    '67e6a91c7dbd409b4d1e96ea',
    'Teeshirt Orange Nike',
    1.69,
    'teeshirt_orange_nike.png',
    50,
    'Un tee-shirt orange refait par Nike.',
    10
  ),
  (
    '67e6a92c7dbd409b4d1e96eb',
    'Étendoir de Noah',
    69.69,
    'etendoir.png',
    50,
    'Pour une maxi quantité de linge.',
    8
  ),
  (
    '67e6a93b7dbd409b4d1e96ec',
    "Billet d'avion pour le Liban",
    0.01,
    'billet_avion.png',
    1,
    'Offert par la France',
    1
  ),
  (
    '67e6a9477dbd409b4d1e96ed',
    'Chaussure droite pour unijambiste',
    23.50,
    'chaussure_droite.png',
    50,
    "Ça c'est une offre qui ne court pas les rues.",
    1
  ),
  (
    '67e6a9557dbd409b4d1e96ee',
    'Chaussure gauche pour unijambiste',
    23.50,
    'chaussure_gauche.png',
    50,
    "Pour que les unijambistes trouvent chaussure à leur pied.",
    1
  ),
  (
    '67e6a9637dbd409b4d1e96ef',
    'Tirelire anti-casino',
    1.99,
    'tirelire.png',
    1,
    "Pour les accros au casino qui ne savent pas s'arrêter.",
    5
  ),
  (
    '67e6a96d7dbd409b4d1e96f0',
    'Mj débutant',
    10.00,
    'lorenzo.jpg',
    10,
    '10% de réduction car il a déjà servi.',
    1
  ),
  (
    '67e6a9737dbd409b4d1e96f1',
    'Costume',
    300.00,
    'costoume-jdg.gif',
    1,
    'Pour ceux qui ont oublié leur costume.',
    1
  ),
  (
    '686c4c8c2bf148cbf1e3f660',
    'Carte Yu-Gi-OH Yubel',
    45.00,
    'carteYubel.jpg',
    20,
    "Une carte qui est parfait pour éviter de l'envoyer dans le cimetière",
    10
  ),
  (
    '686cd17babfad80d136d43a6',
    'Figurine de Ken Kaneki',
    80.00,
    'figurineKaneki.jpg',
    5,
    'Figurine du personnage Ken Kaneki du manga/anime Tokyo Ghoul.',
    4
  );

CREATE TABLE IF NOT EXISTS `avis` (
  `id_maria` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `id` CHAR(24) NOT NULL,
  `article_id` CHAR(24) NOT NULL,
  `comment` LONGTEXT NULL,
  `name` VARCHAR(50) NOT NULL,
  `fname` VARCHAR(50) NOT NULL,
  `stars` INT(11) NOT NULL,
  `date_publication` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_maria`),
  UNIQUE KEY `uq_avis_id_mongo` (`id`),
  INDEX `idx_avis_article` (`article_id`),
  CONSTRAINT `fk_avis_article` FOREIGN KEY (`article_id`) REFERENCES `article`(`id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

INSERT INTO
  `avis` (
    `id`,
    `article_id`,
    `comment`,
    `name`,
    `fname`,
    `stars`,
    `date_publication`
  )
VALUES
  (
    '685569058deabba26e470190',
    '67e6a8b27dbd409b4d1e96e7',
    "c'est bien",
    "POTIER-CLEMENTE",
    'Florian',
    4,
    '2025-06-20 15:58:29'
  ),
  (
    '68623abbdadf2624771420ee',
    '67e6a8b27dbd409b4d1e96e7',
    "c'est bien",
    "POTIER-CLEMENTE",
    'Florian',
    4,
    '2025-06-30 09:20:28'
  ),
  (
    '68623b217bc5c8956ae896df',
    '67e6a8b27dbd409b4d1e96e7',
    "c'est ok",
    "POTIER-CLEMENTE",
    'Florian',
    2,
    '2025-06-30 09:22:10'
  ),
  (
    '68623de07bc5c8956ae896ec',
    '67e6a8b27dbd409b4d1e96e8',
    "un tee shirt bleu",
    "POTIER-CLEMENTE",
    'Florian',
    1,
    '2025-06-30 09:33:53'
  ),
  (
    '68623e007bc5c8956ae896f0',
    '67e6a8b27dbd409b4d1e96e8',
    "très confortable",
    "POTIER-CLEMENTE",
    'Florian',
    4,
    '2025-06-30 09:34:53'
  ),
  (
    '6867edfa0767f788ef3e09bd',
    '67e6a92c7dbd409b4d1e96eb',
    "Super produit ! Je le trouve incroyable",
    "Test",
    'Test',
    5,
    '2025-07-04 15:06:53'
  ),
  (
    '6867ef0e264924e8e720e3fa',
    '67e6a92c7dbd409b4d1e96eb',
    "Test Avis",
    "Test",
    'Test',
    5,
    '2025-07-04 15:11:53'
  ),
  (
    '686929638153aaea526329c7',
    '67e6a92c7dbd409b4d1e96eb',
    "Super produit T !",
    "Tafilet",
    'Antoine',
    3,
    '2025-07-05 13:32:53'
  ),
  (
    '686929a78153aaea526329c9',
    '67e6a92c7dbd409b4d1e96eb',
    "Super produit !",
    "Tafilet",
    'Antoine',
    3,
    '2025-07-05 13:33:56'
  ),
  (
    '686eae253b8f8be81cb6b3c5',
    '67e6a91c7dbd409b4d1e96ea',
    "Niquel pour le sport",
    "BELLO",
    'Noah',
    3,
    '2025-07-09 18:00:06'
  ),
  (
    '686f9b2f3bf59f99283161b8',
    '686c4c8c2bf148cbf1e3f660',
    "Très bonne carte pour commencer un deck Yu-Gi-Oh",
    "Tafilet",
    'Nadine',
    5,
    '2025-07-10 10:51:06'
  ),
  (
    '686f9d0c3bf59f99283161ba',
    '686c4c8c2bf148cbf1e3f660',
    "Je vais l'acheter j'espère que la carte sera en bonne état",
    "Tafilet",
    'Noah',
    2,
    '2025-07-10 10:59:25'
  );

CREATE TABLE IF NOT EXISTS `panier` (
  `id_maria` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `id` VARCHAR(24) NOT NULL,
  `user_id` VARCHAR(24) NOT NULL,
  `articles` LONGTEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_maria`),
  UNIQUE KEY `uq_panier_id` (`id`),
  INDEX `idx_panier_user` (`user_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

INSERT INTO
  `panier` (
    `id`,
    `user_id`,
    `articles`,
    `created_at`,
    `updated_at`
  )
VALUES
  (
    '686a6af6826373a76417dd52',
    '686e365daffd0efc3dae350a',
    "[]",
    '2025-06-20 15:58:29',
    '2025-06-20 15:58:29'
  );