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

class AuthController {
    async register(req: Request, res: Response): Promise<void> {
        try {
            const { name, fname, adress, email, login, motDePasse } = req.body;
            if (!name || !fname || !adress || !email || !login || !motDePasse) {
                res.status(404).json({ message: "Information manquant" });
                return;
            }

            const nginx_urls: string[] = [
                process.env.USER_URL_NGINX_1 as string,
                process.env.USER_URL_NGINX_2 as string
            ].filter(Boolean);

            const urlValide = await verificationUrl(nginx_urls);
            if (!urlValide) {
                res.status(404).json({ message: "Aucune URL valide trouvée" });
                return;
            }

            const newUtilisateur: Register = { name, fname, adress, email, login };
            const response = await axios.post(`${urlValide}`, newUtilisateur);
            if (!response || !response.data) {
                res.status(404).json({ message: "Erreur lors de la récupération du user par défaut" });
                return;
            }

            const updateUserRegister: UpdateRegister = { email, salt: response.data.salt, motDePasse };
            if (!updateUserRegister) {
                res.status(404).json({ message: "Information manquant" });
                return;
            }

            const updateResponse = await axios.put(`${urlValide}`, updateUserRegister);
            if (!updateResponse || !updateResponse.data) {
                res.status(404).json({ message: "Erreur lors de la récupération du rôle par défaut" });
                return;
            }

            const { issuedAt, deviceFingerprint } = Outils.createData(req);
            if (!issuedAt || !deviceFingerprint) {
                res.status(404).json({ message: "Erreur lors de la création des données de token" });
                return;
            }

            const expiresInAccess: number = Outils.createExpiresIn();
            if (!expiresInAccess) {
                res.status(404).json({ message: "Erreur lors de la création de l'expiration de l'accès" });
                return;
            }

            const data: string = `${response.data._id}${response.data.role}${issuedAt}${expiresInAccess}${deviceFingerprint}`;
            const { nonce, proofOfWork } = Outils.createNonce(data);
            if (!nonce || !proofOfWork) {
                res.status(404).json({ message: "Erreur lors de la création des données de nonce et proofOfWork" });
                return;
            }

            const payloadAccess: PayloadAccess = {
                userId: new ObjectId(response.data._id), role: response.data.role,
                issuedAt, expiresIn: expiresInAccess, nonce, proofOfWork,
                scope: ['read', 'write'], issuer: "authServer", deviceFingerprint
            }

            const tokenAccess: string = Outils.generateToken(payloadAccess);
            if (!tokenAccess) {
                res.status(404).json({ message: "Erreur lors de la création du token" });
                return;
            }

            const expiresInRefresh: number = Outils.createExpiresIn(false);
            if (!expiresInRefresh) {
                res.status(404).json({ message: "Erreur lors de la création de l'expiration du rafraichissement" });
                return;
            }

            const payloadRefresh: PayloadRefresh = {
                userId: new ObjectId(response.data._id), issuedAt,
                expiresIn: expiresInRefresh, deviceFingerprint
            };

            const tokenRefresh: string = Outils.generateToken(payloadRefresh);
            if (!tokenRefresh) {
                res.status(404).json({ message: "Erreur lors de la création du token" });
                return;
            }

            const tokenObjet: Tokens = { tokenAccess: `Bearer ${tokenAccess}`, tokenRefresh }
            if (!tokenObjet) {
                res.status(404).json({ message: "Erreur lors de la création du token dans la base de données" });
                return;
            }

            const tokenExisteBDD = await TokenModel.collection.updateOne(
                { userId: new ObjectId(response.data._id) },
                { $set: tokenObjet }, { upsert: true }
            );
            if (!(tokenExisteBDD.modifiedCount === 1 || tokenExisteBDD.upsertedCount === 1)) {
                res.status(500).json({ message: "Erreur lors de la création ou modification du token dans la base de données" });
                return;
            }

            res.cookie("tokenAccess", `Bearer ${tokenAccess}`, { httpOnly: true, secure: true, sameSite: "strict" });
            res.cookie("tokenRefresh", tokenRefresh, { httpOnly: true, secure: true, sameSite: "strict" });
            res.status(200).json({ message: "Compte créé" });
        }
        catch (err) {
            console.error("Erreur register :", err);
            res.status(500).json({ message: "Aucun compte créé" });
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            let { identifiant, motDePasse } = req.body;
            if (!identifiant || !motDePasse) {
                res.status(404).json({ message: "Information manquant" });
                return;
            }

            const nginx_urls: string[] = [
                process.env.USER_URL_NGINX_1 as string,
                process.env.USER_URL_NGINX_2 as string
            ].filter(Boolean);

            const urlValide = await verificationUrl(nginx_urls);
            if (!urlValide) {
                res.status(404).json({ message: "Aucune URL valide trouvée" });
                return;
            }

            let response;
            if (identifiant.includes("@")) {
                response = await axios.get(`${urlValide}filtrer/email/${identifiant}`);
            } else {
                response = await axios.get(`${urlValide}filtrer/login/${identifiant}`);
            }
            if (!response || !response.data) {
                res.status(404).json({ message: "Information manquant" });
                return;
            }

            const compareMdpHasher = crypto.createHash('sha256').update(motDePasse + process.env.PEPPER + response.data.salt).digest('hex');
            if (compareMdpHasher !== response.data.password) {
                res.status(404).json({ message: "Mauvais mot de passe" });
                return;
            }

            const { issuedAt, deviceFingerprint } = Outils.createData(req);
            if (!issuedAt || !deviceFingerprint) {
                res.status(404).json({ message: "Erreur lors de la création des données de token" });
                return;
            }

            const expiresInAccess: number = Outils.createExpiresIn();
            if (!expiresInAccess) {
                res.status(404).json({ message: "Erreur lors de la création de l'expiration de l'accès" });
                return;
            }

            const data: string = `${response.data._id}${response.data.role}${issuedAt}${expiresInAccess}${deviceFingerprint}`;
            const { nonce, proofOfWork } = Outils.createNonce(data);
            if (!nonce || !proofOfWork) {
                res.status(404).json({ message: "Erreur lors de la création des données de nonce et proofOfWork" });
                return;
            }

            const payloadAccess: PayloadAccess = {
                userId: new ObjectId(response.data._id), role: response.data.role,
                issuedAt, expiresIn: expiresInAccess, nonce, proofOfWork,
                scope: ['read', 'write'], issuer: "authServer",
                deviceFingerprint
            }

            const tokenAccess: string = Outils.generateToken(payloadAccess);
            if (!tokenAccess) {
                res.status(404).json({ message: "Erreur lors de la création du token" });
                return;
            }

            const expiresInRefresh: number = Outils.createExpiresIn(false);
            if (!expiresInRefresh) {
                res.status(404).json({ message: "Erreur lors de la création de l'expiration du rafraichissement" });
                return;
            }

            const payloadRefresh: PayloadRefresh = {
                userId: new ObjectId(response.data._id), issuedAt,
                expiresIn: expiresInRefresh, deviceFingerprint
            };

            const tokenRefresh: string = Outils.generateToken(payloadRefresh);
            if (!tokenRefresh) {
                res.status(404).json({ message: "Erreur lors de la création du token" });
                return;
            }

            const tokenObjet: Tokens = { tokenAccess: `Bearer ${tokenAccess}`, tokenRefresh }
            if (!tokenObjet) {
                res.status(404).json({ message: "Erreur lors de la création du token dans la base de données" });
                return;
            }

            const tokenExisteBDD = await TokenModel.collection.updateOne(
                { userId: new ObjectId(response.data._id) },
                { $set: tokenObjet }, { upsert: true }
            );
            if (!(tokenExisteBDD.modifiedCount === 1 || tokenExisteBDD.upsertedCount === 1)) {
                res.status(404).json({ message: "Erreur lors de la création ou modification du token dans la base de données" });
                return;
            }

            res.cookie("tokenAccess", `Bearer ${tokenAccess}`, { httpOnly: true, secure: true, sameSite: "strict" });
            res.cookie("tokenRefresh", tokenRefresh, { httpOnly: true, secure: true, sameSite: "strict" });
            res.status(200).json({ message: "Utilisateur connectée" });
        }
        catch (err) {
            console.error("Erreur login :", err);
            res.status(500).json({ message: "Utilisateur non connectée" });
        }
    }

    async logout(req: Request, res: Response): Promise<void> {
        try {
            const { tokenAccess, tokenRefresh }: Record<string, string> = req.cookies;
            if (!tokenAccess || !tokenRefresh) {
                res.status(404).json({ message: "Token(s) manquant(s)" });
                return;
            }

            const deviceFingerprintTest: string = Outils.createDeviceFingerprint(req);

            const goodAccessToken = Outils.verifyAccessToken(tokenAccess, deviceFingerprintTest);
            if (!goodAccessToken) {
                res.status(404).json({ message: "AccessToken invalide ou expiré" });
                return;
            }

            const result = await TokenModel.collection.deleteOne({ userId: new ObjectId(goodAccessToken.userId) });
            if (result.deletedCount === 0) {
                res.status(404).json({ message: "Aucun token supprimé" });
                return;
            }

            res.clearCookie("tokenAccess");
            res.clearCookie("tokenRefresh");
            res.status(200).json({ message: "Déconnecté" });
        }
        catch (err) {
            console.error("Erreur logout :", err);
            res.status(500).json({ message: "Aucun token supprimé" });
        }
    }

    async refresh(req: Request, res: Response): Promise<void> {
        try {
            const tokenRefresh: string | undefined = req.cookies.tokenRefresh;
            if (!tokenRefresh) {
                res.status(404).json({ message: "Token de rafraîchissement manquant" });
                return;
            }

            const { issuedAt, deviceFingerprint } = Outils.createData(req);
            if (!issuedAt || !deviceFingerprint) {
                res.status(404).json({ message: "Erreur lors de la création des données de token" });
                return;
            }

            const payloadRefresh = Outils.verifyRefreshToken(tokenRefresh, deviceFingerprint);
            if (!payloadRefresh) {
                res.status(404).json({ message: "Token de rafraîchissement invalide" });
                return;
            }

            const nginx_urls: string[] = [
                process.env.USER_URL_NGINX_1 as string,
                process.env.USER_URL_NGINX_2 as string
            ].filter(Boolean);

            const urlValide = await verificationUrl(nginx_urls);
            if (!urlValide) {
                res.status(404).json({ message: "Aucune URL valide trouvée" });
                return;
            }

            const response = await axios.get(`${urlValide}filtrer/id/${payloadRefresh.userId}`);
            if (!response || !response.data) {
                res.status(404).json({ message: "Utilisateur introuvable" });
                return;
            }

            const expiresInAccess = Outils.createExpiresIn();
            const data = `${payloadRefresh.userId}${response.data.role}${issuedAt}${expiresInAccess}${deviceFingerprint}`;
            const { nonce, proofOfWork } = Outils.createNonce(data);
            if (!nonce || !proofOfWork) {
                res.status(404).json({ message: "Erreur lors de la création des données de nonce et proofOfWork" });
                return;
            }

            const payloadAccess: PayloadAccess = {
                userId: new ObjectId(payloadRefresh.userId), role: response.data.role,
                issuedAt, expiresIn: expiresInAccess, nonce, proofOfWork,
                scope: ['read', 'write'], issuer: "authServer",
                deviceFingerprint
            }

            const tokenAccess = Outils.generateToken(payloadAccess);
            if (!tokenAccess) {
                res.status(404).json({ message: "Erreur lors de la création du token d'accès" });
                return;
            }

            const updateResult = await TokenModel.collection.updateOne(
                { userId: new ObjectId(payloadRefresh.userId) },
                { $set: { tokenAccess: `Bearer ${tokenAccess}` } }
            );
            if (updateResult.modifiedCount !== 1) {
                res.status(404).json({ message: "Erreur lors de la mise à jour du token d'accès" });
                return;
            }

            res.cookie("tokenAccess", `Bearer ${tokenAccess}`, { httpOnly: true, secure: true, sameSite: "strict" });
            res.status(200).json({ message: "Token d'accès renouvelé" });

        } catch (err) {
            console.error("Erreur lors du rafraîchissement du token :", err);
            res.status(500).json({ message: "Impossible de renouveler le token" });
        }
    }

    async googleAuth(req: Request, res: Response): Promise<void> {
        try {
            if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_REDIRECT_URI) {
                res.status(404).json({ message: "Configuration OAuth Google manquante" });
                return;
            }

            const redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}` +
                `&redirect_uri=${encodeURIComponent(process.env.GOOGLE_REDIRECT_URI as string)}&response_type=code&scope=openid%20email%20profile`;

            res.redirect(redirectUrl);
        } catch (err) {
            console.error("Erreur dans googleAuth :", err);
            res.status(500).json({ message: "Redirection échouée" });
        }
    }

    async googleAuthCallback(req: Request, res: Response): Promise<void> {
        try {
            const { code } = req.query;
            if (!code) {
                res.status(404).json({ message: "Authorization code manquant" });
                return;
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
                res.status(404).json({ message: "Token d'accès manquant" });
                return;
            }

            const userInfoResponse = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
                headers: { Authorization: `Bearer ${access_token}` }
            });

            const userInfo = userInfoResponse.data;
            if (!userInfo) {
                res.status(404).json({ message: "Informations utilisateur manquantes" });
                return;
            }

            const nginx_urls: string[] = [
                process.env.USER_URL_NGINX_1 as string,
                process.env.USER_URL_NGINX_2 as string
            ].filter(Boolean);

            const urlValide = await verificationUrl(nginx_urls);
            if (!urlValide) {
                res.status(404).json({ message: "Aucune URL valide trouvée" });
                return;
            }

            let user = null;
            try {
                const userResponse = await axios.get(`${urlValide}filtrer/email/${userInfo.email}`);
                user = userResponse.data;
            } catch (err: any) {
                if (err.response && err.response.status === 404) {
                    user = null;
                } else {
                    console.error("Erreur lors de la recherche user:", err);
                    res.status(500).json({ message: "Erreur lors de la recherche de l'utilisateur" });
                    return;
                }
            }
            if (!user) {
                const newUser: Register = { name: userInfo.family_name, fname: userInfo.given_name, adress: "Remplir le champ adresse postal", email: userInfo.email, login: userInfo.name };
                const createResponse = await axios.post(`${urlValide}`, newUser);
                user = createResponse.data;
            }

            const { issuedAt, deviceFingerprint } = Outils.createData(req);
            if (!issuedAt || !deviceFingerprint) {
                res.status(404).json({ message: "Erreur lors de la création des données de token" });
                return;
            }

            const expiresInAccess: number = Outils.createExpiresIn();
            if (!expiresInAccess) {
                res.status(404).json({ message: "Erreur lors de la création de l'expiration de l'accès" });
                return;
            }

            const data: string = `${user._id}${user.role}${issuedAt}${expiresInAccess}${deviceFingerprint}`;
            const { nonce, proofOfWork } = Outils.createNonce(data);
            if (!nonce || !proofOfWork) {
                res.status(404).json({ message: "Erreur lors de la création des données de nonce et proofOfWork" });
                return;
            }

            const payloadAccess: PayloadAccess = {
                userId: new ObjectId(user._id), role: user.role,
                issuedAt, expiresIn: expiresInAccess, nonce, proofOfWork,
                scope: ['read', 'write'], issuer: "authServer",
                deviceFingerprint
            }

            const tokenAccess: string = Outils.generateToken(payloadAccess);
            if (!tokenAccess) {
                res.status(404).json({ message: "Erreur lors de la création du token" });
                return;
            }

            const expiresInRefresh: number = Outils.createExpiresIn(false);
            if (!expiresInRefresh) {
                res.status(404).json({ message: "Erreur lors de la création de l'expiration du rafraichissement" });
                return;
            }

            const payloadRefresh: PayloadRefresh = {
                userId: new ObjectId(user._id), issuedAt,
                expiresIn: expiresInRefresh, deviceFingerprint
            };

            const tokenRefresh: string = Outils.generateToken(payloadRefresh);
            if (!tokenRefresh) {
                res.status(404).json({ message: "Erreur lors de la création du token" });
                return;
            }

            const tokenObjet: Tokens = { tokenAccess: `Bearer ${tokenAccess}`, tokenRefresh }
            if (!tokenObjet) {
                res.status(404).json({ message: "Erreur lors de la création du token dans la base de données" });
                return;
            }

            const tokenExisteBDD = await TokenModel.collection.updateOne(
                { userId: new ObjectId(user._id) },
                { $set: tokenObjet }, { upsert: true }
            );
            if (!(tokenExisteBDD.modifiedCount === 1 || tokenExisteBDD.upsertedCount === 1)) {
                res.status(404).json({ message: "Erreur lors de la création ou modification du token dans la base de données" });
                return;
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