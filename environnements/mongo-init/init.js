// Rôles
DB_Roles = db.getSiblingDB("Roles");
DB_Roles.roles.drop();
DB_Roles.roles.insertMany([
  {
    _id: ObjectId("686309c169c84c3796e3137c"),
    name: "admin",
  },
  {
    _id: ObjectId("686309c9d0070610e43e120d"),
    name: "client",
  },
  {
    _id: ObjectId("686309d569c84c3796e3137d"),
    name: "superuser",
  },
  {
    _id: ObjectId("686309e1d0070610e43e120e"),
    name: "employe",
  },
  {
    _id: ObjectId("686309f169c84c3796e3137e"),
    name: "directeurMagasin",
  },
  {
    _id: ObjectId("686309fed0070610e43e120f"),
    name: "responsableMagasin",
  },
]);

// Utilisateurs
DB_Utilisateurs = db.getSiblingDB("Utilisateurs");
DB_Utilisateurs.utilisateurs.drop();
DB_Utilisateurs.utilisateurs.insertMany([
  {
    _id: ObjectId("686e365daffd0efc3dae350a"),
    name: "BELLO",
    fname: "Noah",
    adress: "224 Rue Des Grandes Terres",
    email: "noah.bello@e-cdp.com",
    login: "NoahBello",
    role: [ObjectId("686309c169c84c3796e3137c")],
    salt: "VoM0oYA",
    password:
      "8c13fcbd937def4f285d9778e2d1ea6431b4549fceea93c10c29f8a9024b7cfe", // "test"
  },
]);

// Tokens
DB_Tokens = db.getSiblingDB("Tokens");
DB_Tokens.tokens.drop();
DB_Tokens.tokens.insertMany([
  {
    _id: ObjectId("68654067039e7deb666033ae"),
    userId: ObjectId("686e365daffd0efc3dae350f"),
    tokenAccess:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODY1NDA2NDVmYmQ4NzQzN2YyOGE3MTUiLCJyb2xlIjpbIjY4NjMwOWM5ZDAwNzA2MTBlNDNlMTIwZCJdLCJpc3N1ZWRBdCI6MTc1MTQ2NjA4NDQyNiwiZXhwaXJlc0luIjoxNzUxNDY2OTg0NDI3LCJub25jZSI6NzM1LCJwcm9vZk9mV29yayI6IjAwMDkzZDJiMTE3OGZmYzA3ZTBhMGZhODI1OTUwM2Q0ZGYyYjlmZjVkM2Y1MWY5MDhmMjI1NjliN2I1ZDMyNDUiLCJzY29wZSI6WyJyZWFkIiwid3JpdGUiXSwiaXNzdWVyIjoiYXV0aFNlcnZlciIsImRldmljZUZpbmdlcnByaW50IjoiOWQ1YzVhOWQzMWZkZWM5NzQ2OTBhNTNkNjJkMDBjMDc5ODk0ZTQxOTQ3OTc0MTFiMDU3ODJkNjJlNGE0MjRjNCJ9.MWEyNzcwNzQ0OTU0MDFjNGU3ZTQwYjgyZDFjYjg0ZDg4ODA4OGY1MGJhYjA2YmNmM2NkOTc1N2ExMTgzZGE4Yg",
    tokenRefresh:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODY1NDA2NDVmYmQ4NzQzN2YyOGE3MTUiLCJpc3N1ZWRBdCI6MTc1MTQ2NjA4NDQyNiwiZXhwaXJlc0luIjoxNzU0MDU4MDg0NDMyLCJkZXZpY2VGaW5nZXJwcmludCI6IjlkNWM1YTlkMzFmZGVjOTc0NjkwYTUzZDYyZDAwYzA3OTg5NGU0MTk0Nzk3NDExYjA1NzgyZDYyZTRhNDI0YzQifQ.NjVlZmU3NWZlMTcyZWNkZWMyOWQ4MmMzZGNmY2MzOTBjNzFmYWUyYWYwNzM2NGQ2Y2EzYjc2MjAzMWYyYzM0Yg",
  },
]);

// Paniers
DB_Paniers = db.getSiblingDB("Paniers");
DB_Paniers.paniers.drop();
DB_Paniers.paniers.insertMany([
  {
    _id: ObjectId("686a6af6826373a76417dd52"),
    user_id: "686e365daffd0efc3dae350a",
    id_maria: 1,
    articles: [],
  },
]);

// Articles
DB_Articles = db.getSiblingDB("Articles");
DB_Articles.articles.drop();
DB_Articles.articles.insertMany([
  {
    _id: ObjectId("67e6a8b27dbd409b4d1e96e7"),
    name: "Teeshirt Orange",
    prix: 20,
    image: "teeshirt_orange.png",
    reduction: 10,
    description: "un TeeShirt orange.",
    stock: 5,
    id_maria: 1,
  },
  {
    _id: ObjectId("67e6a8e77dbd409b4d1e96e8"),
    name: "Teeshirt Bleu",
    prix: 15.5,
    image: "teeshirt_bleu.png",
    reduction: 10,
    description: "un TeeShirt Bleu.",
    stock: 3,
    id_maria: 2,
  },
  {
    _id: ObjectId("67e6a90b7dbd409b4d1e96e9"),
    name: "Teeshirt Vert",
    prix: 0.5,
    image: "teeshirt_vert.png",
    reduction: 10,
    description: "Une tee shirt moche.",
    stock: 0,
    id_maria: 3,
  },
  {
    _id: ObjectId("67e6a91c7dbd409b4d1e96ea"),
    name: "Teeshirt Orange Nike",
    prix: 1.69,
    image: "teeshirt_orange_nike.png",
    reduction: 50,
    description: "un teeshirt orange refait par nike.",
    stock: 10,
    id_maria: 4,
  },
  {
    _id: ObjectId("67e6a92c7dbd409b4d1e96eb"),
    name: "Étendoir de Noah",
    prix: 69.69,
    image: "etendoir.png",
    reduction: 50,
    description: "Pour une maxi quantité de linge.",
    stock: 8,
    id_maria: 5,
  },
  {
    _id: ObjectId("67e6a93b7dbd409b4d1e96ec"),
    name: "Billet d'avion pour le Liban",
    prix: 0.01,
    image: "billet_avion.png",
    reduction: 1,
    description: "Offert par la France",
    stock: 1,
    id_maria: 6,
  },
  {
    _id: ObjectId("67e6a9477dbd409b4d1e96ed"),
    name: "Chaussure droite pour unijambiste",
    prix: 23.5,
    image: "chaussure_droite.png",
    reduction: 50,
    description: "Ça c'est une offre qui ne court pas les rues.",
    stock: 1,
    id_maria: 7,
  },
  {
    _id: ObjectId("67e6a9557dbd409b4d1e96ee"),
    name: "Chaussure gauche pour unijambiste",
    prix: 23.5,
    image: "chaussure_gauche.png",
    reduction: 50,
    description: "Pour que les unijambistes trouvent chaussure à leur pied.",
    stock: 1,
    id_maria: 8,
  },
  {
    _id: ObjectId("67e6a9637dbd409b4d1e96ef"),
    name: "Tirelire anti-casino",
    prix: 1.99,
    image: "tirelire.png",
    reduction: 1,
    description: "Pour les accros au casino qui ne savent pas s'arrêter.",
    stock: 5,
    id_maria: 9,
  },
  {
    _id: ObjectId("67e6a9737dbd409b4d1e96f1"),
    name: "Costume",
    prix: 300,
    image: "costoume-jdg.gif",
    reduction: 1,
    description: "Pour ceux qui ont oublié leur costume.",
    stock: 1,
    id_maria: 10,
  },
  {
    _id: ObjectId("686c4c8c2bf148cbf1e3f660"),
    id_maria: 11,
    name: "Carte Yu-Gi-OH Yubel",
    prix: 45,
    image: "carteYubel.jpg",
    reduction: 20,
    description:
      "Une carte qui est parfait pour éviter de l'envoyer dans le cimetière",
    stock: 10,
  },
  {
    _id: ObjectId("686cd17babfad80d136d43a6"),
    id_maria: 12,
    name: "Figurine de Ken Kaneki",
    prix: 80,
    image: "figurineKaneki.jpg",
    reduction: 5,
    description: "Figurine du personnage Ken Kaneki du manga/anime Tokyo Ghoul",
    stock: 4,
    id_magasin: "null",
  },
]);

// Avis
DB_Avis = db.getSiblingDB("Avis");
DB_Avis.avis.drop();
DB_Avis.avis.insertMany([
  {
    _id: ObjectId("685569058deabba26e470190"),
    id_maria: 1,
    article_id: "67e6a8b27dbd409b4d1e96e7",
    comment: "c'est bien",
    name: "POTIER-CLEMENTE",
    fname: "Florian",
    stars: 4,
    date_publication: "20-06-2025-15-58-29",
  },
  {
    _id: ObjectId("68623abbdadf2624771420ee"),
    id_maria: 2,
    article_id: "67e6a8b27dbd409b4d1e96e7",
    comment: "c'est bien",
    name: "POTIER-CLEMENTE",
    fname: "Florian",
    stars: 4,
    date_publication: "30-06-2025-09-20-28",
  },
  {
    _id: ObjectId("68623b217bc5c8956ae896df"),
    id_maria: 3,
    article_id: "67e6a8b27dbd409b4d1e96e7",
    comment: "c'est ok ",
    name: "POTIER-CLEMENTE",
    fname: "Florian",
    stars: 2,
    date_publication: "30-06-2025-09-22-10",
  },
  {
    _id: ObjectId("68623de07bc5c8956ae896ec"),
    id_maria: 4,
    article_id: "67e6a8e77dbd409b4d1e96e8",
    comment: "un tee shirt bleu",
    name: "POTIER-CLEMENTE",
    fname: "Florian",
    stars: 1,
    date_publication: "30-06-2025-09-33-53",
  },
  {
    _id: ObjectId("68623e007bc5c8956ae896f0"),
    id_maria: 5,
    article_id: "67e6a8e77dbd409b4d1e96e8",
    comment: "très confortable",
    name: "POTIER-CLEMENTE",
    fname: "Florian",
    stars: 4,
    date_publication: "30-06-2025-09-34-24",
  },
  {
    _id: ObjectId("6867edfa0767f788ef3e09bd"),
    id_maria: 6,
    article_id: "67e6a92c7dbd409b4d1e96eb",
    comment: "Super produit ! Je le trouve incroyable",
    name: "Test",
    fname: "Test",
    stars: 5,
    date_publication: "04-07-2025-15-06-34",
  },
  {
    _id: ObjectId("6867ef0e264924e8e720e3fa"),
    id_maria: 7,
    article_id: "67e6a92c7dbd409b4d1e96eb",
    comment: "Test Avis",
    name: "Test",
    fname: "Test",
    stars: 5,
    date_publication: "04-07-2025-15-11-11",
  },
  {
    _id: ObjectId("686929638153aaea526329c7"),
    id_maria: 8,
    article_id: "67e6a92c7dbd409b4d1e96eb",
    comment: "Super produit T !",
    name: "Tafilet",
    fname: "Antoine",
    stars: 3,
    date_publication: "05-07-2025-13-32-21",
  },
  {
    _id: ObjectId("686929a78153aaea526329c9"),
    id_maria: 9,
    article_id: "67e6a92c7dbd409b4d1e96eb",
    comment: "Super produit !",
    name: "Tafilet",
    fname: "Antoine",
    stars: 3,
    date_publication: "05-07-2025-13-33-56",
  },
  {
    _id: ObjectId("686eae253b8f8be81cb6b3c5"),
    id_maria: 10,
    article_id: "67e6a91c7dbd409b4d1e96ea",
    comment: "Niquel pour le sport",
    name: "BELLO",
    fname: "Noah",
    stars: 3,
    date_publication: "09-07-2025-18-00-06",
  },
  {
    _id: ObjectId("686f9b2f3bf59f99283161b8"),
    id_maria: 11,
    article_id: "686c4c8c2bf148cbf1e3f660",
    comment: "Très bonne carte pour commencer un deck Yu-Gi-Oh",
    name: "Tafilet",
    fname: "Nadine",
    stars: 5,
    date_publication: "10-07-2025-10-51-27",
  },
  {
    _id: ObjectId("686f9d0c3bf59f99283161ba"),
    id_maria: 12,
    article_id: "686c4c8c2bf148cbf1e3f660",
    comment: "Je vais l'acheter j'espère que la carte sera en bonne état",
    name: "Tafilet",
    fname: "Noah",
    stars: 2,
    date_publication: "10-07-2025-10-59-25",
  },
]);

// Commandes
DB_Commandes = db.getSiblingDB("Commandes");
DB_Commandes.commandes_en_cours.drop();
DB_Commandes.commandes_en_cours.insertMany([
  {
    _id: ObjectId("686f9d5e09f5bce50c90df96"),
    user_id: "686e365daffd0efc3dae350a",
    paiement_id: "686f9d5eb058aa598571569b",
    commandes: [
      {
        article_id: "686c4c8c2bf148cbf1e3f660",
        name: "Carte Yu-Gi-OH Yubel",
        quantite: 1,
        prix: 45,
        image: "carteYubel.jpg",
        reduction: 20,
        sous_total: 45,
      },
    ],
    total: 45,
    paiement: "CB VISA",
    date_publication: "10-07-2025-11-00-46",
    numero_commande: 944154,
  },
]);

DB_Commandes.commandes_livrees.drop();
DB_Commandes.commandes_livrees.insertMany([
  {
    _id: ObjectId("684a9f4b08e07c583d9841f1"),
    user_id: "686e365daffd0efc3dae350a",
    commandes: [
      {
        article_id: "67e6a8b27dbd409b4d1e96e7",
        name: "Teeshirt Orange",
        quantite: 2,
        prix: 20,
        sous_total: 40,
        image: "teeshirt_orange.png",
        reduction: 10,
      },
      {
        article_id: "67e6a8e77dbd409b4d1e96e8",
        name: "Teeshirt Bleu",
        quantite: 3,
        prix: 15.5,
        image: "teeshirt_bleu.png",
        reduction: 10,
        sous_total: 41.85,
      },
      {
        article_id: "67e6a90b7dbd409b4d1e96e9",
        name: "Teeshirt Vert",
        quantite: 5,
        prix: 0.5,
        image: "teeshirt_vert.png",
        reduction: 10,
        sous_total: 2.25,
      },
      {
        article_id: "67e6a91c7dbd409b4d1e96ea",
        name: "Teeshirt Orange Nike",
        quantite: 1,
        prix: 1.69,
        image: "teeshirt_orange_nike.png",
        reduction: 50,
        sous_total: 0.845,
      },
    ],
    total: 84.945,
    paiement: "CB VISA",
    date_publication: "12-06-2025-11-33-35",
    date_livraison: "12-06-2025-11-35-07",
    numero_commande: 305284,
  },
]);

// Magasins
DB_Magasins = db.getSiblingDB("Magasins");
DB_Magasins.magasins.drop();
DB_Magasins.magasins.insertMany([
  {
    _id: ObjectId("686d8a2580d27ea6510feb51"),
    nom: "Magasin de figurine",
    adresse: "123 rue Exemple",
    ville: "Montpellier",
    email: "magasin@test.com",
    telephone: "0612345678",
    responsable_nom: "Jean Dupont",
    responsable_email: "jean.dupont@amazoff.com",
    capacite_stock: 250,
    current_stock: 50,
  },
  {
    _id: ObjectId("686e3a29451ed10d7b018c91"),
    nom: "Magasin Test",
    adresse: "123 Rue de l'Exemple",
    ville: "Montpellier",
    email: "contact@magasintest.com",
    telephone: "0612345678",
    responsable_nom: "Alice Dupont",
    responsable_email: "alice.dupont@magasintest.com",
    capacite_stock: 300,
    current_stock: 50,
  },
]);

// Notifications
DB_Notifications = db.getSiblingDB("Notifications");
DB_Notifications.notifications.drop();
DB_Notifications.notifications.insertMany([
  {
    _id: ObjectId("683975ea9839247c3f94aa6a"),
    userId: ObjectId("686e365daffd0efc3dae350a"),
    message: "Commande validée avec succès !",
    title: "Commande confirmée",
    type: "success",
    requestId: null,
    redirectUrl: "/mes-commandes",
    data: {
      commandeId: "123456",
      prix: 45.99,
    },
    status: "read",
    createdAt: "2025-05-30T09:10:02.459Z",
    __v: 0,
  },
]);

// PayementModes
DB_PayementMode = db.getSiblingDB("PayementMode");
DB_PayementMode.payement_mode.drop();
DB_PayementMode.payement_mode.insertMany([
  {
    _id: ObjectId("686f93c65b07dc7073f2cf93"),
    userId: ObjectId("686e365daffd0efc3dae350a"),
    method: "cb",
    description: "",
    isActive: true,
    createdAt: "2025-07-10T10:19:50.365Z",
    updatedAt: "2025-07-10T10:19:50.365Z",
    __v: 0,
  },
]);
