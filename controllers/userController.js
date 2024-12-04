const UserModel = require('../models/userModel');
const TokenModel = require("../models/tokenModel");
const crypto = require("crypto");
const fonctions = require("../functions");

let userModel; let tokenModel;

exports.init = (collection, collection2) => {
    userModel = new UserModel(collection);
    tokenModel = new TokenModel(collection2);
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await userModel.getAll();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la récupération des users' });
    }
};

exports.getUser = async (req, res) => {
    try {
        console.log(req)
        const login = req.params.login;
        const user = await userModel.getByLogin(login);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la récupération du user' });
    }
};

exports.createUser = async (req, res) => {
    try {
        let crypto = require('crypto');
        let nombreCaractererAleatoire = Math.floor(Math.random() * 20) + 1;
        let salt = userModel.strRandom(nombreCaractererAleatoire);
        const newUtilisateur = {
            name: req.body.name,
            fname: req.body.fname,
            email: req.body.email,
            login: req.body.login,
            password: crypto.createHash('sha256').update(req.body.password + salt).digest('hex'), // hasher le mot de passe
            salt: salt,
        };
        const createdUtilisateur = await userModel.create(newUtilisateur);
        res.status(201).json(createdUtilisateur);

    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la création de la Utilisateur' });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const updatedFields = {
            name: req.body.name
        };
        const success = await userModel.updateById(id, updatedFields);
        if (!success) {
            res.status(404).json({ message: 'Utilisateur non trouvé' });
        } else {
            res.json({ message: 'Utilisateur mis à jour' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const success = await userModel.deleteById(id);
        if (!success) {
            res.status(404).json({ message: 'Utilisateur non trouvé' });
        } else {
            res.status(200).json({ message: 'Utilisateur supprimé' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur' });
    }
};

exports.getSalt = async (req, res) => {
    try {
        login = req.query.login;
        const salt = await userModel.getSalt(login);
        if (salt) {
            res.json({ salt });
        } else {
            res.status(404).json({ message: 'Salt global non trouvé' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la récupération du salt global' });
    }
};

exports.login = async (req, res) => {
    try {
        login = req.body.login;
        console.log(login);
        // password = req.body.password;
        const salt = await userModel.getSalt(login);
        console.log(salt);
        const userId = await userModel.getByLoginReturnID(login);
        console.log(userId);
        const tokenExiste = await tokenModel.getToken(userId);
        console.log(tokenExiste);
        if (tokenExiste) {
            console.log("Token existant");
            if (tokenExiste.expiresIn < Date.now()) {
                const success = await tokenModel.deleteById(tokenExiste.userId);
                if (!success) {
                    res.status(404).json({ message: "Token non trouvé" });
                }
                else {
                    res.status(200).json({ message: "Veuillez vous reconnecter" });
                }
            }
            else {
                // res.status(200).json({ message: "Vous êtes déjà connecter" });
                res.status(201).json({ token: Buffer.from(JSON.stringify(tokenExiste)).toString('base64') });
            }
        }
        else {
            console.log("Va créer un token");
            let datas = { grainDeSel: salt, login: login, crypto: crypto, token: tokenModel, function: fonctions };
            const creationToken = await userModel.createToken(req, res, datas);
        }
        // if (salt) {
        //     const hashedPassword = crypto.createHash('sha256').update(password + salt).digest('hex');
        //     const user = await userModel.getLoginAndPassword(login, hashedPassword);
        //     if (user === true) {
        //         const token = await userModel.createToken(login, req);
        //         const tokenOk = await userModel.verifyToken(token);
        //         console.log(token);
        //         res.json({ token });
        //     } else {
        //         res.status(401).json({ message: 'Utilisateur ou mot de passe incorrect' });
        //     }
        // } else {
        //     res.status(404).json({ message: 'Salt global non trouvé' });
        // }
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la connexion' });
    }
}

// Noah connexion
exports.connexionUtilisateurs = async (req, res) => {
    try {
        const email = req.body.email;
        const grainDeSel = await userModel.getByIdentifiantEtRecuperationGrain(email);
        const userId = await userModel.getByIdentifiant(email);
        const tokenExiste = await tokenModel.recupToken(userId);

        if (tokenExiste) {
            if (tokenExiste.expiresIn < Date.now()) {
                const success = await tokenModel.deleteById(tokenExiste.userId);
                if (!success) {
                    res.status(404).json({ message: "Token non trouvé" });
                }
                else {
                    res.status(200).json({ message: "Veuillez vous reconnecter" });
                }
            }
            else {
                // res.status(200).json({ message: "Vous êtes déjà connecter" });
                res.status(201).json({ token: Buffer.from(JSON.stringify(tokenExiste)).toString('base64') });
            }
        }
        else {
            let datas = { grainDeSel: grainDeSel, email: email, crypto: crypto, token: tokenModel, function: fonctions };
            const creationToken = await userModel.createToken(req, res, datas);
        }
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la récupération du user" });
    }
};