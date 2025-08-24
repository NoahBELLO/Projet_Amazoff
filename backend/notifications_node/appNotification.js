// appNotification.js
const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
// const cors = require("cors");

const notificationRoutes = require("./src/notificationRoutes");

const app = express();
const port = process.env.PORT || 7002;
const mongoUri = process.env.MONGO_URI_NOTIFICATIONS;

// Middleware
// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connexion à la base MongoDB
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connexion à MongoDB Notifications réussie"))
.catch((err) => {
  console.error(" Erreur MongoDB :", err);
  process.exit(1);
});

// Routes
app.use("/notifications", notificationRoutes);

// Lancement du serveur
app.listen(port, () => {
  console.log(` Service notification démarré sur http://localhost:${port}`);
});
