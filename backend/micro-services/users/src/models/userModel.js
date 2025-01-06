const { ObjectId } = require('mongodb');
const TokenModel = require('./tokenModel');
const crypto = require('crypto');

class UserModel {
	constructor(collection) {
		this.collection = collection;
	}

	async getAll() {
		return await this.collection.find({}).toArray();
	}

	async getById(id) {
		return await this.collection.findOne({ _id: new ObjectId(id) });
	}

	async getByLogin(login) {
		const user = await this.collection.findOne({ login: login });
		return user;
	}

	async getSalt(login){
		let utilisateur = await this.collection.findOne({ login: login });
        if (utilisateur) {
            return utilisateur.salt;
        }
        else {
            return null;
        }
	}

	async create(newUser) {
		const result = await this.collection.insertOne(newUser);
		return { _id: result.insertedId, ...newUser };
	}

	async updateById(id, updatedFields) {
		const result = await this.collection.updateOne(
			{ _id: new ObjectId(id) },
			{ $set: updatedFields }
		);
		return result.matchedCount > 0;
	}

	async deleteById(id) {
		const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
		return result.deletedCount > 0;
	}

	checkDatas(datas) {
		const nouveauCompte = (datas.id === 0);
		const lignes = ['fname', 'name', 'login', 'password'];

		// Vérification des champs obligatoires
		for (const ligne of lignes) {
			if (!datas[ligne] || datas[ligne].trim().length === 0) {
				if (ligne === 'fname') {
					throw "Veuillez définir un Prénom.";
				}
				if (ligne === 'name') {
					throw "Veuillez définir un Nom."
				};

				if (ligne === 'login' && nouveauCompte) {
					throw "Veuillez définir un Login."
				};
				if (ligne === 'password' && nouveauCompte) {
					throw "Veuillez définir un mot de passe."
				};
			}
		}

		// Vérification de l'adresse email
		const regexEmail = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,7}\b/;
		if (!('email' in datas) || !regexEmail.test(datas.email)) {
			throw "Veuillez définir une adresse email valide."
		};

		delete datas.id;
		return true;
	}

	strRandom = (nombreCaractere) => {
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let result = '';
		for (let i = 0; i < nombreCaractere; i++) {
			result += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		return result;
	};

	async validatePassword(login, old_password, new_password, matching_password, res) {
		const user = await this.collection.findOne({ login: login });
		old_password = crypto.createHash('sha256').update(old_password + user.salt).digest('hex');

		if (old_password != user.password) {
			throw "Mot de passe incorrect."
		}
		if (new_password === null || matching_password === null)
			throw "Veuillez renseigner tous les champs."

		if (new_password.length <= 4) {
			throw "Le nouveau mot de passe est trop court"
		}
		if (new_password != matching_password) {
			throw "les nouveaux mot de passe ne correspondent pas"
		}
		return true;
	}
	async savePassword(login, new_password) {
		try {
			const salt = this.strRandom(8)
			const hashedPassword = crypto.createHash('sha256').update(new_password + salt).digest('hex');
			const result = await this.collection.updateOne(
				{ login: login },
				{
					$set: {
						password: hashedPassword,
						salt: salt
					}
				});

			return result.matchedCount > 0;
		}
		catch (error) {
			throw "Erreur lors de l'update du mot de passe"
		}
	}

	async createToken(req, res, datas) {
		if (datas.grainDeSel) {
			let hash = datas.crypto.createHash('sha256').update(req.body.password + datas.grainDeSel).digest('hex');
			const utilisateur = await this.getByIdentifiantAndPassword(datas.email, hash);
			if (utilisateur) {
				let donnee = datas.function.createData(req);
				let data = utilisateur.id + utilisateur.role + donnee.debutToken + donnee.finToken + donnee.empreinteOrdi;
				let donnees = datas.function.createNonce(data);
				const newToken = {
					userId: utilisateur.id, role: utilisateur.role,
					issuedAt: donnee.debutToken, expiresIn: donnee.finToken,
					nonce: donnees.nonce, proofOfWork: donnees.proofOfWork,
					scope: ["write", "read"], issuer: "authServer",
					deviceFingerprint: donnee.empreinteOrdi
				};
				const createdToken = await datas.token.create(newToken);
				res.status(201).json({ token: Buffer.from(JSON.stringify(createdToken)).toString('base64') });
			} else {
				res.status(401).json({ message: "Mot de passe incorrect" });
			}
		} else {
			res.status(404).json({ message: "Utilisateur non inscrit" });
		}
	}
}
module.exports = UserModel;