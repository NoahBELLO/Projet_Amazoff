import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import UserOutils from './userOutils';
import crypto from 'crypto';
import { UserModel } from './userModel';
import axios from 'axios';

// Interface pour la création de l'utilisateur
interface UtilisateurCréation {
    name: string; fname: string;
    email: string; login: string;
    role: ObjectId[]; salt: string; adress: string;
}

interface Utilisateur {
    name: string; fname: string;
    email: string; login: string;
    role: ObjectId; password: string;
}

class UserController {
    async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            let users = await UserModel.collection.find({}).toArray();

            if (!users) {
                throw new Error("Liste utilisateur non trouvée");
            }
            res.status(201).json(users);
        }
        catch (err) {
            res.status(500).json({ message: "Aucun utilisateur trouver" });
        }
    }

    async getUserById(req: Request, res: Response): Promise<void> {
        try {
            let { id } = req.params;
            if (!id) {
                throw new Error("ID manquant");
            }

            let user = await UserModel.collection.findOne({ _id: new ObjectId(id) });
            if (!user) {
                throw new Error("Utilisateur non trouvée");
            }
            res.status(201).json(user);
        }
        catch (err) {
            res.status(500).json({ message: "Aucun utilisateur trouver" });
        }
    }

    async getUserByIdFiltrer(req: Request, res: Response): Promise<void> {
        try {
            let { id } = req.params;
            if (!id) {
                throw new Error("ID manquant");
            }

            let user = await UserModel.collection.findOne({ _id: new ObjectId(id) }, { projection: { _id: 1, role: 1, salt: 1, password: 1 } });
            if (!user) {
                throw new Error("Utilisateur non trouvée");
            }
            res.status(201).json(user);
        }
        catch (err) {
            res.status(500).json({ message: "Aucun utilisateur trouver" });
        }
    }

    async getUserByEmail(req: Request, res: Response): Promise<void> {
        try {
            let { email } = req.params;
            if (!email) {
                throw new Error("Email manquant");
            }

            let user = await UserModel.collection.findOne({ email: email });
            if (!user) {
                throw new Error("Utilisateur non trouvée");
            }
            res.status(201).json(user);
        }
        catch (err) {
            res.status(500).json({ message: "Aucun utilisateur trouver" });
        }
    }

    async getUserByEmailFiltrer(req: Request, res: Response): Promise<void> {
        try {
            let { email } = req.params;
            if (!email) {
                throw new Error("Email manquant");
            }

            let user = await UserModel.collection.findOne({ email: email }, { projection: { _id: 1, role: 1, salt: 1, password: 1 } });
            if (!user) {
                res.status(404).json({ message: "Utilisateur non trouvé" });
                return;
            }
            res.status(201).json(user);
        }
        catch (err) {
            res.status(500).json({ message: "Aucun utilisateur trouver" });
        }
    }

    async getUserByLogin(req: Request, res: Response): Promise<void> {
        try {
            let { login } = req.params;
            if (!login) {
                throw new Error("Login manquant");
            }

            let user = await UserModel.collection.findOne({ login: login });
            if (!user) {
                throw new Error("Utilisateur non trouvée");
            }
            res.status(201).json(user);
        }
        catch (err) {
            res.status(500).json({ message: "Aucun utilisateur trouver" });
        }
    }

    async getUserByLoginFiltrer(req: Request, res: Response): Promise<void> {
        try {
            let { login } = req.params;
            if (!login) {
                throw new Error("Login manquant");
            }

            let user = await UserModel.collection.findOne({ login: login }, { projection: { _id: 1, role: 1, salt: 1, password: 1 } });
            if (!user) {
                throw new Error("Utilisateur non trouvée");
            }
            res.status(201).json(user);
        }
        catch (err) {
            res.status(500).json({ message: "Aucun utilisateur trouver" });
        }
    }

    async createUser(req: Request, res: Response): Promise<void> {
        try {
            const response = await axios.get(`${process.env.ROLE_URL}name/client`);
            if (!response || !response.data) {
                throw new Error("Erreur lors de la récupération du rôle par défaut");
            }

            const role = [new ObjectId(response.data._id)];
            const { name, fname, adress, email, login } = req.body;
            if (!name || !fname || !adress || !email || !login) {
                throw new Error("Information manquant");
            }

            const existingUser = await UserModel.collection.findOne({ email: email });
            const existingUser2 = await UserModel.collection.findOne({ login: login });
            if (existingUser || existingUser2) {
                throw new Error("Le user existe déjà");
            }

            let nombreCaractererAleatoire: number = Math.floor(Math.random() * 20) + 1;
            const salt: string = UserOutils.createGrainDeSel(nombreCaractererAleatoire);
            if (!salt) {
                throw new Error("Erreur lors de la création du grain de sel");
            }

            let newUtilisateur: UtilisateurCréation = { name, fname, adress, email, login, role, salt };
            if (!newUtilisateur) {
                throw new Error("Information manquant");
            }

            let user = await UserModel.collection.insertOne(newUtilisateur);
            if (!user || !user.insertedId) {
                throw new Error("Utilisateur non crée");
            }

            // const response = await axios.post(`${process.env.PANIER_URL}`, user.insertedId);
            // if (!response || !response.data) {
            //     throw new Error("Erreur lors de la récupération du user par défaut");
            // }

            res.status(201).json({ salt: salt, _id: user.insertedId, role: role });
        }
        catch (err) {
            console.error("Erreur création utilisateur :", err);
            res.status(500).json({ message: "Aucun utilisateur crée" });
        }
    }

    async updateUserRegister(req: Request, res: Response): Promise<void> {
        try {
            const { email, salt, motDePasse, /* mdpHasher */ } = req.body;
            if (!email || !salt || !motDePasse) {
                throw new Error("Information manquant");
            }

            const passwordHasher = crypto.createHash('sha256').update(motDePasse + process.env.PEPPER + salt).digest('hex');
            if (!passwordHasher) {
                throw new Error("Erreur lors de la création du hash du mot de passe");
            }

            const result = await UserModel.collection.updateOne(
                { email: email },
                { $set: { password: passwordHasher } }
            );
            if (result.modifiedCount === 0) {
                throw new Error("Aucun utilisateur mis à jour");
            }

            res.status(201).json({ message: "Utilisateur mis à jour" });
        }
        catch (err) {
            res.status(500).json({ message: "Aucun utilisateur mis à jour" });
        }
    }

    async updateUserById(req: Request, res: Response): Promise<void> {
        try {
            // Récupérer le mot de passe hasher en FrontEnd
            const { id } = req.params;
            const { name, fname, email, login, role, motDePasse /*, mdpHasher */ } = req.body;
            if (!id || !name || !fname || !email || !login || !role || !motDePasse) {
                throw new Error("Information manquant");
            }

            const user = await UserModel.collection.findOne({ _id: new ObjectId(id) });
            if (!user) {
                throw new Error("Utilisateur non trouvée");
            }

            // Hasher le mot de passe en FrontEnd
            const passwordHasher = crypto.createHash('sha256').update(motDePasse + user.salt).digest('hex');
            if (!passwordHasher) {
                throw new Error("Erreur lors de la création du hash du mot de passe");
            }

            let updateUtilisateur = { name, fname, email, login, role, password: passwordHasher };
            if (!updateUtilisateur) {
                throw new Error("Information manquant");
            }

            const result = await UserModel.collection.updateOne(
                { _id: new ObjectId(id) },
                { $set: updateUtilisateur }
            );
            if (result.modifiedCount === 0) {
                throw new Error("Aucun utilisateur mis à jour");
            }

            res.status(201).json({ message: "Utilisateur mis à jour" });
        }
        catch (err) {
            res.status(500).json({ message: "Aucun utilisateur mis à jour" });
        }
    }

    async updateUserByEmail(req: Request, res: Response): Promise<void> {
        try {
            // Récupérer le mot de passe hasher en FrontEnd
            const { email } = req.params;
            const { name, fname, login, newEmail, role, motDePasse /*, mdpHasher */ } = req.body;
            if (!name || !fname || !email || !newEmail || !login || !role || !motDePasse) {
                throw new Error("Information manquant");
            }

            const user = await UserModel.collection.findOne({ email: email });
            if (!user) {
                throw new Error("Utilisateur non trouvée");
            }

            // Hasher le mot de passe en FrontEnd
            const passwordHasher = crypto.createHash('sha256').update(motDePasse + user.salt).digest('hex');
            if (!passwordHasher) {
                throw new Error("Erreur lors de la création du hash du mot de passe");
            }

            let updateUtilisateur: Utilisateur = { name, fname, email: newEmail, login, role, password: passwordHasher };
            if (!updateUtilisateur) {
                throw new Error("Information manquant");
            }

            const result = await UserModel.collection.updateOne(
                { email: email },
                { $set: updateUtilisateur }
            );
            if (result.modifiedCount === 0) {
                throw new Error("Aucun utilisateur mis à jour");
            }

            res.status(201).json({ message: "Utilisateur mis à jour" });
        }
        catch (err) {
            res.status(500).json({ message: "Aucun utilisateur mis à jour" });
        }
    }

    async updateUserByLogin(req: Request, res: Response): Promise<void> {
        try {
            // Récupérer le mot de passe hasher en FrontEnd
            const { login } = req.params;
            const { name, fname, newLogin, email, role, motDePasse /*, mdpHasher */ } = req.body;
            if (!name || !fname || !email || !newLogin || !login || !role || !motDePasse) {
                throw new Error("Information manquant");
            }

            const user = await UserModel.collection.findOne({ login: login });
            if (!user) {
                throw new Error("Utilisateur non trouvée");
            }

            // Hasher le mot de passe en FrontEnd
            const passwordHasher = crypto.createHash('sha256').update(motDePasse + user.salt).digest('hex');
            if (!passwordHasher) {
                throw new Error("Erreur lors de la création du hash du mot de passe");
            }

            let updateUtilisateur: Utilisateur = { name, fname, email, login: newLogin, role, password: passwordHasher };
            if (!updateUtilisateur) {
                throw new Error("Information manquant");
            }

            const result = await UserModel.collection.updateOne(
                { login: login },
                { $set: updateUtilisateur }
            );
            if (result.modifiedCount === 0) {
                throw new Error("Aucun utilisateur mis à jour");
            }

            res.status(201).json({ message: "Utilisateur mis à jour" });
        }
        catch (err) {
            res.status(500).json({ message: "Aucun utilisateur mis à jour" });
        }
    }

    async deleteUserById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            if (!id) {
                throw new Error("Information manquant");
            }

            const result = await UserModel.collection.deleteOne({ _id: new ObjectId(id) });
            if (result.deletedCount === 0) {
                throw new Error("Aucun rôle supprimé");
            }

            res.status(200).json({ message: "Rôle supprimé avec succès" });
        }
        catch (err) {
            res.status(500).json({ message: "Aucun rôle supprimé" });
        }
    }

    async deleteUserByEmail(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.params;
            if (!email) {
                throw new Error("Information manquant");
            }

            const result = await UserModel.collection.deleteOne({ email: email });
            if (result.deletedCount === 0) {
                throw new Error("Aucun rôle supprimé");
            }

            res.status(200).json({ message: "Rôle supprimé avec succès" });
        }
        catch (err) {
            res.status(500).json({ message: "Aucun rôle supprimé" });
        }
    }

    async deleteUserByLogin(req: Request, res: Response): Promise<void> {
        try {
            const { login } = req.params;
            if (!login) {
                throw new Error("Information manquant");
            }

            const result = await UserModel.collection.deleteOne({ login: login });
            if (result.deletedCount === 0) {
                throw new Error("Aucun rôle supprimé");
            }

            res.status(200).json({ message: "Rôle supprimé avec succès" });
        }
        catch (err) {
            res.status(500).json({ message: "Aucun rôle supprimé" });
        }
    }
}
export default UserController;