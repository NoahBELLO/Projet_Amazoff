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

async function verificationUrl(urls: string[]): Promise<string> {
    for (const url of urls) {
        try {
            await axios.get(`${url}health`, { timeout: 3000 });
            return url;
        } catch (e) {

        }
    }
    return "";
}

class UserController {
    async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            let users = await UserModel.collection.find({}).toArray();

            if (!users) {
                res.status(404).json({ message: "Liste utilisateur non trouvée" });
                return;
            }

            res.status(200).json(users);
        }
        catch (err) {
            console.error("Erreur lors de la récupération des utilisateurs:", err);
            res.status(500).json({ message: "Aucun utilisateur trouvé" });
        }
    }

    async getUserById(req: Request, res: Response): Promise<void> {
        try {
            let { id } = req.params;
            if (!id) {
                res.status(404).json({ message: "ID manquant" });
                return;
            }

            let user = await UserModel.collection.findOne({ _id: new ObjectId(id) });
            if (!user) {
                res.status(404).json({ message: "Utilisateur non trouvé" });
                return;
            }

            res.status(200).json(user);
        }
        catch (err) {
            console.error("Erreur lors de la récupération de l'utilisateur:", err);
            res.status(500).json({ message: "Aucun utilisateur trouvé" });
        }
    }

    async getUserInfo(req: Request, res: Response): Promise<void> {
        try {
            let { id } = req.params;
            if (!id) {
                res.status(404).json({ message: "ID manquant" });
                return;
            }

            let user = await UserModel.collection.findOne({ _id: new ObjectId(id) }, { projection: { _id: 0, name: 1, fname: 1 } });
            if (!user) {
                res.status(404).json({ message: "Utilisateur non trouvé" });
                return;
            }

            res.status(200).json(user);
        }
        catch (err) {
            console.error("Erreur lors de la récupération de l'utilisateur:", err);
            res.status(500).json({ message: "Aucun utilisateur trouvé" });
        }
    }

    async getUserInfos(req: Request, res: Response): Promise<void> {
        try {
            let { id } = req.params;
            if (!id) {
                res.status(404).json({ message: "ID manquant" });
                return;
            }

            let user = await UserModel.collection.findOne({ _id: new ObjectId(id) }, {
                projection: {
                    _id: 0, name: 1, fname: 1, email: 1, adress: 1,
                    login: 1
                }
            });
            if (!user) {
                res.status(404).json({ message: "Utilisateur non trouvé" });
                return;
            }

            res.status(200).json(user);
        }
        catch (err) {
            console.error("Erreur lors de la récupération de l'utilisateur:", err);
            res.status(500).json({ message: "Aucun utilisateur trouvé" });
        }
    }

    async getUserByIdFiltrer(req: Request, res: Response): Promise<void> {
        try {
            let { id } = req.params;
            if (!id) {
                res.status(404).json({ message: "ID manquant" });
                return;
            }

            let user = await UserModel.collection.findOne({ _id: new ObjectId(id) }, { projection: { _id: 1, role: 1, salt: 1, password: 1 } });
            if (!user) {
                res.status(404).json({ message: "Utilisateur non trouvé" });
                return;
            }

            res.status(200).json(user);
        }
        catch (err) {
            console.error("Erreur lors de la récupération de l'utilisateur:", err);
            res.status(500).json({ message: "Aucun utilisateur trouvé" });
        }
    }

    async getUserByIdMiddleware(req: Request, res: Response): Promise<void> {
        try {
            let { id } = req.params;
            if (!id) {
                res.status(404).json({ message: "ID manquant" });
                return;
            }

            let user = await UserModel.collection.findOne({ _id: new ObjectId(id) }, { projection: { _id: 1, email: 1, role: 1 } });
            if (!user) {
                res.status(404).json({ message: "Utilisateur non trouvé" });
                return;
            }

            res.status(200).json(user);
        }
        catch (err) {
            console.error("Erreur lors de la récupération de l'utilisateur:", err);
            res.status(500).json({ message: "Aucun utilisateur trouvé" });
        }
    }

    async getUserByIdFiltrerAvisPython(req: Request, res: Response): Promise<void> {
        try {
            let { id } = req.params;
            if (!id) {
                res.status(404).json({ message: "ID manquant" });
                return;
            }

            let user = await UserModel.collection.findOne({ _id: new ObjectId(id) }, { projection: { name: 1, fname: 1 } });
            if (!user) {
                res.status(404).json({ message: "Utilisateur non trouvé" });
                return;
            }

            res.status(200).json(user);
        }
        catch (err) {
            console.error("Erreur lors de la récupération de l'utilisateur:", err);
            res.status(500).json({ message: "Aucun utilisateur trouvé" });
        }
    }

    async getUserByIdFiltrerCommandesPython(req: Request, res: Response): Promise<void> {
        try {
            let { id } = req.params;
            if (!id) {
                res.status(404).json({ message: "ID manquant" });
                return;
            }

            let user = await UserModel.collection.findOne({ _id: new ObjectId(id) }, { projection: { _id: 1 } });
            if (!user) {
                res.status(404).json({ message: "Utilisateur non trouvé" });
                return;
            }

            res.status(200).json(user);
        }
        catch (err) {
            console.error("Erreur lors de la récupération de l'utilisateur:", err);
            res.status(500).json({ message: "Aucun utilisateur trouvé" });
        }
    }

    async getUserByEmail(req: Request, res: Response): Promise<void> {
        try {
            let { email } = req.params;
            if (!email) {
                res.status(404).json({ message: "Email manquant" });
                return;
            }

            let user = await UserModel.collection.findOne({ email: email });
            if (!user) {
                res.status(404).json({ message: "Utilisateur non trouvé" });
                return;
            }

            res.status(200).json(user);
        }
        catch (err) {
            console.error("Erreur lors de la récupération de l'utilisateur:", err);
            res.status(500).json({ message: "Aucun utilisateur trouvé" });
        }
    }

    async getUserByEmailFiltrer(req: Request, res: Response): Promise<void> {
        try {
            let { email } = req.params;
            if (!email) {
                res.status(404).json({ message: "Email manquant" });
                return;
            }

            let user = await UserModel.collection.findOne({ email: email }, { projection: { _id: 1, role: 1, salt: 1, password: 1 } });
            if (!user) {
                res.status(404).json({ message: "Utilisateur non trouvé" });
                return;
            }

            res.status(200).json(user);
        }
        catch (err) {
            console.error("Erreur lors de la récupération de l'utilisateur:", err);
            res.status(500).json({ message: "Aucun utilisateur trouvé" });
        }
    }

    async getUserByLogin(req: Request, res: Response): Promise<void> {
        try {
            let { login } = req.params;
            if (!login) {
                res.status(404).json({ message: "Login manquant" });
                return;
            }

            let user = await UserModel.collection.findOne({ login: login });
            if (!user) {
                res.status(404).json({ message: "Utilisateur non trouvé" });
                return;
            }

            res.status(200).json(user);
        }
        catch (err) {
            console.error("Erreur lors de la récupération de l'utilisateur:", err);
            res.status(500).json({ message: "Aucun utilisateur trouvé" });
        }
    }

    async getUserByLoginFiltrer(req: Request, res: Response): Promise<void> {
        try {
            let { login } = req.params;
            if (!login) {
                res.status(404).json({ message: "Login manquant" });
                return;
            }

            let user = await UserModel.collection.findOne({ login: login }, { projection: { _id: 1, role: 1, salt: 1, password: 1 } });
            if (!user) {
                res.status(404).json({ message: "Utilisateur non trouvé" });
                return;
            }

            res.status(200).json(user);
        }
        catch (err) {
            console.error("Erreur lors de la récupération de l'utilisateur:", err);
            res.status(404).json({ message: "Aucun utilisateur trouvé" });
        }
    }

    async createUser(req: Request, res: Response): Promise<void> {
        try {
            const nginx_urls_role: string[] = [
                process.env.ROLE_URL_NGINX_1 as string,
                process.env.ROLE_URL_NGINX_2 as string
            ].filter(Boolean);

            const urlValideRole = await verificationUrl(nginx_urls_role);
            if (!urlValideRole) {
                res.status(404).json({ message: "Aucune URL valide trouvée" });
                return;
            }

            const response = await axios.get(`${urlValideRole}name/client`);
            if (!response || !response.data) {
                res.status(404).json({ message: "Erreur lors de la récupération du rôle par défaut" });
                return;
            }

            const role = [new ObjectId(response.data._id)];
            const { name, fname, adress, email, login } = req.body;
            if (!name || !fname || !adress || !email || !login) {
                res.status(404).json({ message: "Information manquante" });
                return;
            }

            const existingUser = await UserModel.collection.findOne({ email: email });
            const existingUser2 = await UserModel.collection.findOne({ login: login });
            if (existingUser || existingUser2) {
                res.status(404).json({ message: "Le user existe déjà" });
                return;
            }

            let nombreCaractererAleatoire: number = Math.floor(Math.random() * 20) + 1;
            const salt: string = UserOutils.createGrainDeSel(nombreCaractererAleatoire);
            if (!salt) {
                res.status(404).json({ message: "Erreur lors de la création du grain de sel" });
                return;
            }

            let newUtilisateur: UtilisateurCréation = { name, fname, adress, email, login, role, salt };
            if (!newUtilisateur) {
                res.status(404).json({ message: "Information manquante" });
                return;
            }

            let user = await UserModel.collection.insertOne(newUtilisateur);
            if (!user || !user.insertedId) {
                res.status(404).json({ message: "Utilisateur non crée" });
                return;
            }

            const nginx_urls_paniers: string[] = [
                process.env.PANIER_URL_NGINX_1 as string,
                process.env.PANIER_URL_NGINX_2 as string
            ].filter(Boolean);

            const urlValidePaniers = await verificationUrl(nginx_urls_paniers);
            if (!urlValidePaniers) {
                res.status(404).json({ message: "Aucune URL valide trouvée" });
                return;
            }

            const responsePanier = await axios.post(`${urlValidePaniers}create_cart/${user.insertedId}`);
            if (!responsePanier || !responsePanier.data) {
                res.status(404).json({ message: "Erreur lors de la création du panier par défaut" });
                return;
            }

            res.status(200).json({ salt: salt, _id: user.insertedId, role: role });
        }
        catch (err) {
            console.error("Erreur création utilisateur :", err);
            res.status(500).json({ message: "Aucun utilisateur crée" });
        }
    }

    async updateUserRegister(req: Request, res: Response): Promise<void> {
        try {
            const { email, salt, motDePasse } = req.body;
            if (!email || !salt || !motDePasse) {
                res.status(404).json({ message: "Information manquante" });
                return;
            }

            const passwordHasher = crypto.createHash('sha256').update(motDePasse + process.env.PEPPER + salt).digest('hex');
            if (!passwordHasher) {
                res.status(404).json({ message: "Erreur lors de la création du hash du mot de passe" });
                return;
            }

            const result = await UserModel.collection.updateOne(
                { email: email },
                { $set: { password: passwordHasher } }
            );
            if (result.modifiedCount === 0) {
                res.status(404).json({ message: "Aucun utilisateur mis à jour" });
                return;
            }

            res.status(200).json({ message: "Utilisateur mis à jour" });
        }
        catch (err) {
            console.error("Erreur lors de la mise à jour de l'utilisateur :", err);
            res.status(500).json({ message: "Aucun utilisateur mis à jour" });
        }
    }

    async updateUserById(req: Request, res: Response): Promise<void> {
        try {
            // Récupérer le mot de passe hasher en FrontEnd
            const { id } = req.params;
            const { name, fname, email, login, role, motDePasse } = req.body;
            if (!id || !name || !fname || !email || !login || !role || !motDePasse) {
                res.status(404).json({ message: "Information manquante" });
                return;
            }

            const user = await UserModel.collection.findOne({ _id: new ObjectId(id) });
            if (!user) {
                res.status(404).json({ message: "Utilisateur non trouvée" });
                return;
            }

            // Hasher le mot de passe en FrontEnd
            const passwordHasher = crypto.createHash('sha256').update(motDePasse + user.salt).digest('hex');
            if (!passwordHasher) {
                res.status(404).json({ message: "Erreur lors de la création du hash du mot de passe" });
                return;
            }

            let updateUtilisateur = { name, fname, email, login, role, password: passwordHasher };
            if (!updateUtilisateur) {
                res.status(404).json({ message: "Information manquante" });
                return;
            }

            const result = await UserModel.collection.updateOne(
                { _id: new ObjectId(id) },
                { $set: updateUtilisateur }
            );
            if (result.modifiedCount === 0) {
                res.status(404).json({ message: "Aucun utilisateur mis à jour" });
                return;
            }

            res.status(200).json({ message: "Utilisateur mis à jour" });
        }
        catch (err) {
            console.error("Erreur lors de la mise à jour de l'utilisateur :", err);
            res.status(500).json({ message: "Aucun utilisateur mis à jour" });
        }
    }

    async updateUserByEmail(req: Request, res: Response): Promise<void> {
        try {
            // Récupérer le mot de passe hasher en FrontEnd
            const { email } = req.params;
            const { name, fname, login, newEmail, role, motDePasse /*, mdpHasher */ } = req.body;
            if (!name || !fname || !email || !newEmail || !login || !role || !motDePasse) {
                res.status(404).json({ message: "Information manquante" });
                return;
            }

            const user = await UserModel.collection.findOne({ email: email });
            if (!user) {
                res.status(404).json({ message: "Utilisateur non trouvée" });
                return;
            }

            // Hasher le mot de passe en FrontEnd
            const passwordHasher = crypto.createHash('sha256').update(motDePasse + user.salt).digest('hex');
            if (!passwordHasher) {
                res.status(404).json({ message: "Erreur lors de la création du hash du mot de passe" });
                return;
            }

            let updateUtilisateur: Utilisateur = { name, fname, email: newEmail, login, role, password: passwordHasher };
            if (!updateUtilisateur) {
                res.status(404).json({ message: "Information manquante" });
                return;
            }

            const result = await UserModel.collection.updateOne(
                { email: email },
                { $set: updateUtilisateur }
            );
            if (result.modifiedCount === 0) {
                res.status(404).json({ message: "Aucun utilisateur mis à jour" });
                return;
            }

            res.status(200).json({ message: "Utilisateur mis à jour" });
        }
        catch (err) {
            console.error("Erreur lors de la mise à jour de l'utilisateur :", err);
            res.status(500).json({ message: "Aucun utilisateur mis à jour" });
        }
    }

    async updateUserByLogin(req: Request, res: Response): Promise<void> {
        try {
            // Récupérer le mot de passe hasher en FrontEnd
            const { login } = req.params;
            const { name, fname, newLogin, email, role, motDePasse /*, mdpHasher */ } = req.body;
            if (!name || !fname || !email || !newLogin || !login || !role || !motDePasse) {
                res.status(404).json({ message: "Information manquante" });
                return;
            }

            const user = await UserModel.collection.findOne({ login: login });
            if (!user) {
                res.status(404).json({ message: "Utilisateur non trouvée" });
                return;
            }

            // Hasher le mot de passe en FrontEnd
            const passwordHasher = crypto.createHash('sha256').update(motDePasse + user.salt).digest('hex');
            if (!passwordHasher) {
                res.status(404).json({ message: "Erreur lors de la création du hash du mot de passe" });
                return;
            }

            let updateUtilisateur: Utilisateur = { name, fname, email, login: newLogin, role, password: passwordHasher };
            if (!updateUtilisateur) {
                res.status(404).json({ message: "Information manquante" });
                return;
            }

            const result = await UserModel.collection.updateOne(
                { login: login },
                { $set: updateUtilisateur }
            );
            if (result.modifiedCount === 0) {
                res.status(404).json({ message: "Aucun utilisateur mis à jour" });
                return;
            }

            res.status(200).json({ message: "Utilisateur mis à jour" });
        }
        catch (err) {
            console.error("Erreur lors de la mise à jour de l'utilisateur :", err);
            res.status(500).json({ message: "Aucun utilisateur mis à jour" });
        }
    }

    async deleteUserById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(404).json({ message: "Information manquante" });
                return;
            }

            const result = await UserModel.collection.deleteOne({ _id: new ObjectId(id) });
            if (result.deletedCount === 0) {
                res.status(404).json({ message: "Aucun rôle supprimé" });
                return;
            }

            const nginx_urls: string[] = [
                process.env.PANIER_URL_NGINX_1 as string,
                process.env.PANIER_URL_NGINX_2 as string
            ].filter(Boolean);

            const urlValide = await verificationUrl(nginx_urls);
            if (!urlValide) {
                res.status(404).json({ message: "Aucune URL valide trouvée" });
                return;
            }

            const response = await axios.delete(`${urlValide}delete_cart/${id}`);
            if (!response || !response.data) {
                res.status(404).json({ message: "Erreur lors de la suppression du panier" });
                return;
            }

            res.status(200).json({ message: "User supprimé avec succès" });
        }
        catch (err) {
            console.error("Erreur lors de la suppression de l'utilisateur :", err);
            res.status(500).json({ message: "Aucun utilisateur supprimé" });
        }
    }

    async deleteUserByEmail(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.params;
            if (!email) {
                res.status(404).json({ message: "Information manquante" });
                return;
            }

            const user = await UserModel.collection.findOne({ email: email }, { projection: { _id: 1 } });
            if (!user) {
                res.status(404).json({ message: "Utilisateur non trouvé" });
                return;
            }

            const result = await UserModel.collection.deleteOne({ email: email });
            if (result.deletedCount === 0) {
                res.status(404).json({ message: "Aucun utilisateur supprimé" });
                return;
            }

            const nginx_urls: string[] = [
                process.env.PANIER_URL_NGINX_1 as string,
                process.env.PANIER_URL_NGINX_2 as string
            ].filter(Boolean);

            const urlValide = await verificationUrl(nginx_urls);
            if (!urlValide) {
                res.status(404).json({ message: "Aucune URL valide trouvée" });
                return;
            }

            const response = await axios.delete(`${urlValide}delete_cart/${user._id}`);
            if (!response || !response.data) {
                res.status(404).json({ message: "Erreur lors de la suppression du panier" });
                return;
            }

            res.status(200).json({ message: "Utilisateur supprimé avec succès" });
        }
        catch (err) {
            console.error("Erreur lors de la suppression de l'utilisateur :", err);
            res.status(500).json({ message: "Aucun utilisateur supprimé" });
        }
    }

    async deleteUserByLogin(req: Request, res: Response): Promise<void> {
        try {
            const { login } = req.params;
            if (!login) {
                res.status(404).json({ message: "Information manquante" });
                return;
            }

            const user = await UserModel.collection.findOne({ login: login }, { projection: { _id: 1 } });
            if (!user) {
                res.status(404).json({ message: "Utilisateur non trouvé" });
                return;
            }

            const result = await UserModel.collection.deleteOne({ login: login });
            if (result.deletedCount === 0) {
                res.status(404).json({ message: "Aucun utilisateur supprimé" });
                return;
            }

            const nginx_urls: string[] = [
                process.env.PANIER_URL_NGINX_1 as string,
                process.env.PANIER_URL_NGINX_2 as string
            ].filter(Boolean);

            const urlValide = await verificationUrl(nginx_urls);
            if (!urlValide) {
                res.status(404).json({ message: "Aucune URL valide trouvée" });
                return;
            }

            const response = await axios.delete(`${urlValide}delete_cart/${user._id}`);
            if (!response || !response.data) {
                res.status(404).json({ message: "Erreur lors de la suppression du panier" });
                return;
            }

            res.status(200).json({ message: "Utilisateur supprimé avec succès" });
        }
        catch (err) {
            console.error("Erreur lors de la suppression de l'utilisateur :", err);
            res.status(500).json({ message: "Aucun utilisateur supprimé" });
        }
    }

    async patchUserById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const updateData = req.body;

            let user = await UserModel.collection.findOne({ _id: new ObjectId(id) }, { projection: { salt: 1, role: 1 } });
            if (!user) {
                res.status(404).json({ message: "Utilisateur non trouvé" });
                return;
            }

            const donnee: any = {};
            donnee.role = user.role;
            if (updateData.name) donnee.name = updateData.name;
            if (updateData.fname) donnee.fname = updateData.fname;
            if (updateData.email) donnee.email = updateData.email;
            if (updateData.login) donnee.login = updateData.login;
            if (updateData.role) donnee.role = updateData.role;
            if (updateData.adress) donnee.adress = updateData.adress;
            if (updateData.password) {
                donnee.password = crypto.createHash('sha256').update(updateData.password + process.env.PEPPER + user.salt).digest('hex');
            }

            if (Object.keys(donnee).length === 0) {
                res.status(400).json({ message: "Aucune donnée à mettre à jour" });
                return;
            }

            const result = await UserModel.collection.updateOne({ _id: new ObjectId(id) }, { $set: donnee });
            if (result.modifiedCount === 0) {
                res.status(404).json({ message: "Aucune information mise à jour" });
                return;
            }

            const notif_payload = {
                userId: id,
                message: "Votre profil a été modifié.",
                title: "Modification profil",
                type: "info"
            }

            const nginx_urls: string[] = [
                process.env.NOTIFICATION_URL_NGINX_1 as string,
                process.env.NOTIFICATION_URL_NGINX_2 as string
            ].filter(Boolean);

            const urlValide = await verificationUrl(nginx_urls);
            if (!urlValide) {
                res.status(404).json({ message: "Aucune URL valide trouvée" });
                return;
            }

            const response = await axios.post(`${urlValide}create-notif`, notif_payload);
            if (!response || !response.data) {
                res.status(404).json({ message: "Erreur lors de la création de la notification" });
                return;
            }

            res.status(200).json({ message: "Informations mises à jour avec succès" });
        } catch (err) {
            console.error("Erreur lors de la mise à jour de l'utilisateur :", err);
            res.status(500).json({ message: "Erreur lors de la mise à jour de l'utilisateur" });
        }
    }

    async patchUserRole(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { role } = req.body;
            if (!id || !role) {
                res.status(400).json({ message: "ID ou rôle manquant" });
                return;
            }

            const nginx_urls_role: string[] = [
                process.env.ROLE_URL_NGINX_1 as string,
                process.env.ROLE_URL_NGINX_2 as string
            ].filter(Boolean);

            const urlValideRole = await verificationUrl(nginx_urls_role);
            if (!urlValideRole) {
                res.status(404).json({ message: "Aucune URL valide trouvée" });
                return;
            }

            // Si tu stockes le rôle comme ObjectId, convertis-le
            const response = await axios.get(`${urlValideRole}name/${role}`);
            if (!response || !response.data) {
                res.status(401).json({ message: "Utilisateur introuvable pour role" });
                return;
            }
            
            const result = await UserModel.collection.updateOne(
                { _id: new ObjectId(id) },
                { $set: { role: [new ObjectId(response.data._id)] } }
            );            
            if (result.modifiedCount === 0) {
                res.status(404).json({ message: "Aucun utilisateur mis à jour" });
                return;
            }

            res.status(200).json({ message: "Rôle mis à jour avec succès" });
        } catch (err) {
            console.error("Erreur lors de la mise à jour du rôle :", err);
            res.status(500).json({ message: "Erreur lors de la mise à jour du rôle" });
        }
    }
}

export default UserController;