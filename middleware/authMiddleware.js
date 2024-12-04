const TokenModel = require("../models/tokenModel");
const fonctions = require("../functions");
exports.authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Aucun token fourni' });
    }
    try {
        const decodedToken = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
        const tkModel = new TokenModel(req.app.get('tokensCollection'));
        
        if (decodedToken.expiresIn < Date.now()) {
            await tkModel.deleteById(decodedToken.userId);
            return res.status(401).json({ message: "Veuillez vous reconnecter" });
        }

        let donnee = fonctions.createData(req);
        let data = decodedToken.userId + decodedToken.role + decodedToken.issuedAt + decodedToken.expiresIn + donnee.empreinteOrdi;
        let donnees = fonctions.verifNonce(data, decodedToken.nonce, decodedToken.proofOfWork);

        if (!donnees) {
            await tkModel.deleteById(decodedToken.userId);
            return res.status(401).json({ message: "Veuillez vous reconnecter" });
        }
        else {
            let databis = decodedToken.userId + decodedToken.role + decodedToken.issuedAt + donnee.finToken + donnee.empreinteOrdi;
            let donneesBis = fonctions.createNonce(databis);
            
            const updatedData = {
                userId: decodedToken.userId, role: decodedToken.role,
                issuedAt: decodedToken.issuedAt, expiresIn: donnee.finToken,
                nonce: donneesBis.nonce, proofOfWork: donneesBis.proofOfWork,
                scope: ["write", "read"], issuer: "authServer",
                deviceFingerprint: decodedToken.deviceFingerprint
            };

            const tokenUpdated = await tkModel.updateById(decodedToken.userId, updatedData);
            if (!tokenUpdated) {
                return res.status(500).json({ message: "Veuillez vous reconnecter" });
            }
            req.updatedToken = Buffer.from(JSON.stringify(updatedData)).toString('base64');
            res.setHeader('x-updated-token', req.updatedToken);
            next();
        }
    } catch (err) {
        console.error(`Erreur lors de la vérification du token : ${err}`);
        res.status(401).json({ message: "Échec de l'authentification" });
    }
};