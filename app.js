const express = require("express");
const port = 5000;

const app = express();

//Lancez le serveur
app.listen(port, () => console.log("Le server est lancé sur le port " + port));