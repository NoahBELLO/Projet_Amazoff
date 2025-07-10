// appPayementMode.js
const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
// const cors = require("cors");

const paymentModeRoutes = require("./src/paymentModeRoutes");

const app = express();
const port = process.env.PORT || 7003;
const mongoUri = process.env.MONGO_URI_PAYEMENTMODE;

// Middleware
// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connexion à la base MongoDB
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connexion à MongoDB PayementMode réussie"))
.catch((err) => {
  console.error(" Erreur MongoDB :", err);
  process.exit(1);
});

// Routes
app.use("/paymentMode", paymentModeRoutes);

// Lancement du serveur
app.listen(port, () => {
  console.log(` Service payementMode démarré sur http://localhost:${port}`);
});
