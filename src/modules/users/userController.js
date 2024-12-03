const UserModel = require('./userModel');


let userModel;

exports.init = (collection) => {
    userModel = new UserModel(collection);
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
        const id = req.params.id;
        const user = await userModel.getById(id);
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
            id: 0,
            name: req.body.name,
            fname: req.body.fname,
            email: req.body.email,
            login: req.body.login,
            password: req.body.password,
            salt: salt,
        };
        //inspection des données
        if (userModel.checkDatas(newUtilisateur) === true) {
            newUtilisateur.password = crypto.createHash('sha256').update(req.body.password + salt).digest('hex') // hasher le mot de passe
            const createdUtilisateur = await userModel.create(newUtilisateur);
            res.status(201).json(createdUtilisateur);
        }
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

exports.editPassword = async (req, res) => {
        const login = req.body.login;
        const old_password = req.body.old_password;
        const new_password = req.body.new_password;
        const matching_password = req.body.matching_password;
        const result = await userModel.validatePassword(login, old_password, new_password, matching_password, res);
        if (result === true) {
            try{
                
                userModel.savePassword(login, new_password);
                res.status(200).json({ message: 'Mot de passe modifié avec succès' });
            }
            catch(err) {
                res.status(500).json({ message: 'Erreur lors de la sauvegarde du mot de passe' });
            }
        };
    }

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




