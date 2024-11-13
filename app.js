const express = require("express");
// const connectDB = require("./config/db");
// const dotenv = require("dotenv").config();
const port = 5000;

//Connexion bdd 
// connectDB();

const app = express();

//Middleware qui permet de traiter les données de la Request
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/marchandise", require("./routes/marchandise.routes"));

//Lancez le serveur
app.listen(port, () => console.log("Le server est lancé sur le port " + port));