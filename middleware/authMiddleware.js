exports.authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    console.log(token);
    if (!token) {
        return res.status(401).json({ message: 'Aucun token fourni' });
    }
    try {
        console.log(token);
        next();
    } catch (err) {
        console.error(`Erreur lors de la vérification du token : ${err}`);
        res.status(401).json({ message: "Échec de l'authentification" });
    }
};