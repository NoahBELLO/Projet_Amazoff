const express = require("express");
// const connectDB = require("./config/db");
const dotenv = require("dotenv").config();
const app = express();
const port = 5000;
const uri = process.env.MONGO_URI;

const { MongoClient, ServerApiVersion } = require('mongodb');
const userRoutes = require('./routes/userRoutes');
const userController = require('./controllers/userController');
//Connexion bdd 
// connectDB();

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

//Middleware qui permet de traiter les données de la Request
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

async function run() {
    try {
        // Connexion à la base de données
        await client.connect();
        const database = client.db("Utilisateurs");
        const collection = database.collection("Users");
        userController.init(collection);

        app.use('/users', userRoutes);

        // Middleware pour gérer les erreurs 500 (erreurs serveur)
        app.use((err, req, res, next) => {
            console.error(err.stack);
            res.status(500).json({ message: 'Erreur interne du serveur' });
        });

        // Démarrer le serveur
        app.listen(port, () => {
            console.log(`API en cours d'exécution sur http://localhost:${port}`);
        });

    } catch (err) {
        console.error(err);
    }
}

run().catch(console.dir);