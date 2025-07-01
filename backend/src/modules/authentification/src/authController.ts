import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import Outils from './authOutils';
import crypto from 'crypto';
import { TokenModel } from './tokenModel';
import axios from "axios";
import { nextTick } from 'process';

// Interface pour la création de l'utilisateur
interface Register {
    name: string; fname: string; adress: string;
    email: string; login: string;
}

interface UpdateRegister {
    email: string; motDePasse: string;
    salt: string;
}

interface PayloadAccess {
    userId: ObjectId; role: string;
    issuedAt: number; expiresIn: number;
    nonce: number; proofOfWork: string;
    scope: string[]; issuer: string;
    deviceFingerprint: string;
}

interface PayloadRefresh {
    userId: ObjectId; issuedAt: number;
    expiresIn: number; deviceFingerprint: string;
}

interface Tokens {
    tokenAccess: string;
    tokenRefresh: string;
}

class AuthController {
    async register(req: Request, res: Response): Promise<void> {
        try {
            const { name, fname, adress, email, login, motDePasse } = req.body;
            if (!name || !fname || !adress || !email || !login || !motDePasse) {
                throw new Error("Information manquant");
            }

            const newUtilisateur: Register = { name, fname, adress, email, login };
            const response = await axios.post(`${process.env.USER_URL}`, newUtilisateur);
            if (!response || !response.data) {
                throw new Error("Erreur lors de la récupération du user par défaut");
            }

            const updateUserRegister: UpdateRegister = { email, salt: response.data.salt, motDePasse };
            if (!updateUserRegister) {
                throw new Error("Information manquant");
            }

            const updateResponse = await axios.put(`${process.env.USER_URL}`, updateUserRegister);
            if (!updateResponse || !updateResponse.data) {
                throw new Error("Erreur lors de la récupération du rôle par défaut");
            }

            const { issuedAt, deviceFingerprint } = Outils.createData(req);
            if (!issuedAt || !deviceFingerprint) {
                throw new Error("Erreur lors de la création des données de token");
            }

            const expiresInAccess: number = Outils.createExpiresIn();
            if (!expiresInAccess) {
                throw new Error("Erreur lors de la création de l'expiration de l'accès");
            }

            const data: string = `${response.data._id}${response.data.role}${issuedAt}${expiresInAccess}${deviceFingerprint}`;
            const { nonce, proofOfWork } = Outils.createNonce(data);
            if (!nonce || !proofOfWork) {
                throw new Error("Erreur lors de la création des données de nonce et proofOfWork");
            }

            const payloadAccess: PayloadAccess = {
                userId: new ObjectId(response.data._id), role: response.data.role,
                issuedAt, expiresIn: expiresInAccess, nonce, proofOfWork,
                scope: ['read', 'write'], issuer: "authServer", deviceFingerprint
            }

            const tokenAccess: string = Outils.generateToken(payloadAccess);
            if (!tokenAccess) {
                throw new Error("Erreur lors de la création du token");
            }

            const expiresInRefresh: number = Outils.createExpiresIn(false);
            if (!expiresInRefresh) {
                throw new Error("Erreur lors de la création de l'expiration du rafraichissement");
            }

            const payloadRefresh: PayloadRefresh = {
                userId: new ObjectId(response.data._id), issuedAt,
                expiresIn: expiresInRefresh, deviceFingerprint
            };

            const tokenRefresh: string = Outils.generateToken(payloadRefresh);
            if (!tokenRefresh) {
                throw new Error("Erreur lors de la création du token");
            }

            const tokenObjet: Tokens = { tokenAccess: `Bearer ${tokenAccess}`, tokenRefresh }
            if (!tokenObjet) {
                throw new Error("Erreur lors de la création du token dans la base de données");
            }

            const tokenExisteBDD = await TokenModel.collection.updateOne(
                { userId: new ObjectId(response.data._id) },
                { $set: tokenObjet }, { upsert: true }
            );
            if (!(tokenExisteBDD.modifiedCount === 1 || tokenExisteBDD.upsertedCount === 1)) {
                throw new Error("Erreur lors de la création ou modification du token dans la base de données");
            }

            res.cookie("tokenAccess", `Bearer ${tokenAccess}`, { httpOnly: true, secure: true, sameSite: "strict" });
            res.cookie("tokenRefresh", tokenRefresh, { httpOnly: true, secure: true, sameSite: "strict" });
            res.status(201).json({ message: "Compte créé" });
        }
        catch (err) {
            res.status(500).json({ message: "Aucun compte créé" });
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            let { identifiant, motDePasse } = req.body;
            if (!identifiant || !motDePasse) {
                throw new Error("Information manquant");
            }

            let response;
            if (identifiant.includes("@")) {
                response = await axios.get(`${process.env.USER_URL}filtrer/email/${identifiant}`);
            } else {
                response = await axios.get(`${process.env.USER_URL}filtrer/login/${identifiant}`);
            }
            if (!response || !response.data) {
                throw new Error("Information manquant");
            }

            const compareMdpHasher = crypto.createHash('sha256').update(motDePasse + process.env.PEPPER + response.data.salt).digest('hex');
            if (compareMdpHasher !== response.data.password) {
                throw new Error("Mauvais mot de passe");
            }

            const { issuedAt, deviceFingerprint } = Outils.createData(req);
            if (!issuedAt || !deviceFingerprint) {
                throw new Error("Erreur lors de la création des données de token");
            }

            const expiresInAccess: number = Outils.createExpiresIn();
            if (!expiresInAccess) {
                throw new Error("Erreur lors de la création de l'expiration de l'accès");
            }

            const data: string = `${response.data._id}${response.data.role}${issuedAt}${expiresInAccess}${deviceFingerprint}`;
            const { nonce, proofOfWork } = Outils.createNonce(data);
            if (!nonce || !proofOfWork) {
                throw new Error("Erreur lors de la création des données de nonce et proofOfWork");
            }

            const payloadAccess: PayloadAccess = {
                userId: new ObjectId(response.data._id), role: response.data.role,
                issuedAt, expiresIn: expiresInAccess, nonce, proofOfWork,
                scope: ['read', 'write'], issuer: "authServer",
                deviceFingerprint
            }

            const tokenAccess: string = Outils.generateToken(payloadAccess);
            if (!tokenAccess) {
                throw new Error("Erreur lors de la création du token");
            }

            const expiresInRefresh: number = Outils.createExpiresIn(false);
            if (!expiresInRefresh) {
                throw new Error("Erreur lors de la création de l'expiration du rafraichissement");
            }

            const payloadRefresh: PayloadRefresh = {
                userId: new ObjectId(response.data._id), issuedAt,
                expiresIn: expiresInRefresh, deviceFingerprint
            };

            const tokenRefresh: string = Outils.generateToken(payloadRefresh);
            if (!tokenRefresh) {
                throw new Error("Erreur lors de la création du token");
            }

            const tokenObjet: Tokens = { tokenAccess: `Bearer ${tokenAccess}`, tokenRefresh }
            if (!tokenObjet) {
                throw new Error("Erreur lors de la création du token dans la base de données");
            }

            const tokenExisteBDD = await TokenModel.collection.updateOne(
                { userId: new ObjectId(response.data._id) },
                { $set: tokenObjet }, { upsert: true }
            );
            if (!(tokenExisteBDD.modifiedCount === 1 || tokenExisteBDD.upsertedCount === 1)) {
                throw new Error("Erreur lors de la création ou modification du token dans la base de données");
            }

            res.cookie("tokenAccess", `Bearer ${tokenAccess}`, { httpOnly: true, secure: true, sameSite: "strict" });
            res.cookie("tokenRefresh", tokenRefresh, { httpOnly: true, secure: true, sameSite: "strict" });
            res.status(201).json({ message: "Utilisateur connectée" });
        }
        catch (err) {
            res.status(500).json({ message: "Utilisateur non connectée" });
        }
    }

    async logout(req: Request, res: Response): Promise<void> {
        try {
            const { tokenAccess, tokenRefresh }: Record<string, string> = req.cookies;
            if (!tokenAccess || !tokenRefresh) {
                res.status(401).json({ message: "Token(s) manquant(s)" });
                return;
            }

            const deviceFingerprintTest: string = Outils.createDeviceFingerprint(req);

            const goodAccessToken = Outils.verifyAccessToken(tokenAccess, deviceFingerprintTest);
            if (!goodAccessToken) {
                res.status(401).json({ message: "AccessToken invalide ou expiré" });
                return;
            }

            const result = await TokenModel.collection.deleteOne({ userId: new ObjectId(goodAccessToken.userId) });
            if (result.deletedCount === 0) {
                throw new Error("Aucun token supprimé");
            }

            res.clearCookie("tokenAccess");
            res.clearCookie("tokenRefresh");
            res.status(200).json({ message: "Déconnecté" });
        }
        catch (err) {
            res.status(500).json({ message: "Aucun token supprimé" });
        }
    }

    async refresh(req: Request, res: Response): Promise<void> {
        try {
            const tokenRefresh: string | undefined = req.cookies.tokenRefresh;
            if (!tokenRefresh) {
                throw new Error("Token de rafraîchissement manquant");
            }

            const { issuedAt, deviceFingerprint } = Outils.createData(req);
            if (!issuedAt || !deviceFingerprint) {
                throw new Error("Erreur lors de la création des données de token");
            }

            const payloadRefresh = Outils.verifyRefreshToken(tokenRefresh, deviceFingerprint);
            if (!payloadRefresh) {
                throw new Error("Token de rafraîchissement invalide");
            }

            const response = await axios.get(`${process.env.USER_URL}filtrer/id/${payloadRefresh.userId}`);
            if (!response || !response.data) {
                throw new Error("Utilisateur introuvable");
            }

            const expiresInAccess = Outils.createExpiresIn();
            const data = `${payloadRefresh.userId}${response.data.role}${issuedAt}${expiresInAccess}${deviceFingerprint}`;
            const { nonce, proofOfWork } = Outils.createNonce(data);
            if (!nonce || !proofOfWork) {
                throw new Error("Erreur lors de la création des données de nonce et proofOfWork");
            }

            const payloadAccess: PayloadAccess = {
                userId: new ObjectId(payloadRefresh.userId), role: response.data.role,
                issuedAt, expiresIn: expiresInAccess, nonce, proofOfWork,
                scope: ['read', 'write'], issuer: "authServer",
                deviceFingerprint
            }

            const tokenAccess = Outils.generateToken(payloadAccess);
            if (!tokenAccess) {
                throw new Error("Erreur lors de la création du token d'accès");
            }

            const updateResult = await TokenModel.collection.updateOne(
                { userId: new ObjectId(payloadRefresh.userId) },
                { $set: { tokenAccess: `Bearer ${tokenAccess}` } }
            );
            if (updateResult.modifiedCount !== 1) {
                throw new Error("Erreur lors de la mise à jour du token d'accès");
            }

            res.cookie("tokenAccess", `Bearer ${tokenAccess}`/* , { httpOnly: false, secure: false, sameSite: "strict" } */);
            res.status(200).json({ message: "Token d'accès renouvelé" });

        } catch (err) {
            res.status(401).json({ message: "Impossible de renouveler le token" });
        }
    }

    async googleAuth(req: Request, res: Response): Promise<void> {
        try {
            if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_REDIRECT_URI) {
                throw new Error("Missing Google OAuth config");
            }

            const redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}` +
                `&redirect_uri=${encodeURIComponent(process.env.GOOGLE_REDIRECT_URI as string)}&response_type=code&scope=openid%20email%20profile`;

            res.redirect(redirectUrl);
        } catch (err) {
            res.status(401).json({ message: "Redirection échouée" });
        }
    }

    async googleAuthCallback(req: Request, res: Response): Promise<void> {
        try {
            const { code } = req.query;
            if (!code) {
                throw new Error("Authorization code manquant");
            }

            const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', null, {
                params: {
                    code, client_id: process.env.GOOGLE_CLIENT_ID, client_secret: process.env.GOOGLE_CLIENT_SECRET,
                    redirect_uri: process.env.GOOGLE_REDIRECT_URI, grant_type: 'authorization_code'
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });

            const { access_token } = tokenResponse.data;
            if (!access_token) {
                throw new Error("Erreur lors de l'obtention du token d'accès");
            }

            const userInfoResponse = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
                headers: { Authorization: `Bearer ${access_token}` }
            });

            const userInfo = userInfoResponse.data;
            if (!userInfo) {
                throw new Error("Erreur lors de la récupération des informations utilisateur");
            }

            let user = null;
            try {
                const userResponse = await axios.get(`${process.env.USER_URL}filtrer/email/${userInfo.email}`);
                user = userResponse.data;
            } catch (err: any) {
                if (err.response && err.response.status === 404) {
                    user = null;
                } else {
                    console.error("Erreur lors de la recherche user:", err);
                    throw err;
                }
            }
            if (!user) {
                const newUser: Register = { name: userInfo.family_name, fname: userInfo.given_name, adress:"Remplir le champ adresse postal",email: userInfo.email, login: userInfo.name };
                const createResponse = await axios.post(`${process.env.USER_URL}`, newUser);
                user = createResponse.data;
            }

            const { issuedAt, deviceFingerprint } = Outils.createData(req);
            if (!issuedAt || !deviceFingerprint) {
                throw new Error("Erreur lors de la création des données de token");
            }

            const expiresInAccess: number = Outils.createExpiresIn();
            if (!expiresInAccess) {
                throw new Error("Erreur lors de la création de l'expiration de l'accès");
            }

            const data: string = `${user._id}${user.role}${issuedAt}${expiresInAccess}${deviceFingerprint}`;
            const { nonce, proofOfWork } = Outils.createNonce(data);
            if (!nonce || !proofOfWork) {
                throw new Error("Erreur lors de la création des données de nonce et proofOfWork");
            }

            const payloadAccess: PayloadAccess = {
                userId: new ObjectId(user._id), role: user.role,
                issuedAt, expiresIn: expiresInAccess, nonce, proofOfWork,
                scope: ['read', 'write'], issuer: "authServer",
                deviceFingerprint
            }

            const tokenAccess: string = Outils.generateToken(payloadAccess);
            if (!tokenAccess) {
                throw new Error("Erreur lors de la création du token");
            }

            const expiresInRefresh: number = Outils.createExpiresIn(false);
            if (!expiresInRefresh) {
                throw new Error("Erreur lors de la création de l'expiration du rafraichissement");
            }

            const payloadRefresh: PayloadRefresh = {
                userId: new ObjectId(user._id), issuedAt,
                expiresIn: expiresInRefresh, deviceFingerprint
            };

            const tokenRefresh: string = Outils.generateToken(payloadRefresh);
            if (!tokenRefresh) {
                throw new Error("Erreur lors de la création du token");
            }

            const tokenObjet: Tokens = { tokenAccess: `Bearer ${tokenAccess}`, tokenRefresh }
            if (!tokenObjet) {
                throw new Error("Erreur lors de la création du token dans la base de données");
            }

            const tokenExisteBDD = await TokenModel.collection.updateOne(
                { userId: new ObjectId(user._id) },
                { $set: tokenObjet }, { upsert: true }
            );
            if (!(tokenExisteBDD.modifiedCount === 1 || tokenExisteBDD.upsertedCount === 1)) {
                throw new Error("Erreur lors de la création ou modification du token dans la base de données");
            }

            res.cookie("tokenAccess", `Bearer ${tokenAccess}`, { httpOnly: true, secure: true, sameSite: "strict" });
            res.cookie("tokenRefresh", tokenRefresh, { httpOnly: true, secure: true, sameSite: "strict" });

            const redirectUrl = "http://localhost:4200/dashboard";
            res.redirect(redirectUrl);
        } catch (err) {
            console.error("Erreur dans googleAuthCallback :", err);
            const redirectUrl = "http://localhost:4200/";
            res.redirect(redirectUrl);
        }
    }
}

export default AuthController;