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
            name: req.body.name,
            fname: req.body.fname,
            email: req.body.email,
            login: req.body.login,
            password: crypto.createHash('md5').update(req.body.password + salt).digest('hex'), // hasher le mot de passe
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
    // exports.test =async (req, res) =>{
    //   if(req.query == "coucou")
    // }
}
