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
        console.log(req)
        const id = req.params.id;
        console.log(id);
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
            newUtilisateur.password = crypto.createHash('md5').update(req.body.password + salt).digest('hex') // hasher le mot de passe
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
    try {
        const id = req.params.id;
        const old_password = req.body.old_password;
        const new_password = req.body.new_password;
        const matching_password = req.body.matching_password;

        old_password = crypto.createHash('md5').update(old_password + salt).digest('hex');
        new_password = crypto.createHash('md5').update(new_password + salt).digest('hex');
        matching_password = crypto.createHash('md5').update(matching_password + salt).digest('hex');

        const result = await userModel.validatePassword(id, old_password, new_password, matching_password);

        if (result === true) {
            user.Model.savePassword(id, new_password);
        };
    }
    catch (err) {
        res.status(500).json({ message: 'Erreur lors de la modification du mot de passe' });
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
        let crypto = require('crypto');
        login = req.body.login;
        console.log(login)
        password = req.body.password;
        console.log(password)
        const salt = await userModel.getSalt(login);
        if (salt) {
            const hashedPassword = crypto.createHash('md5').update(password + salt).digest('hex');
            const user = await userModel.getLoginAndPassword(login, hashedPassword);
            if (user === true) {
                const token = await userModel.createToken(login, req);
                const tokenOk = await userModel.verifyToken(token);
                console.log(token);
                res.json({ token });
            } else {
                res.status(401).json({ message: 'Utilisateur ou mot de passe incorrect' });
            }
        } else {
            res.status(404).json({ message: 'Salt global non trouvé' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la connexion' });
    }

}
