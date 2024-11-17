const { ObjectId } = require('mongodb');

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
		console.log(login);
		const user = await this.collection.findOne({ login: login });
		return user;
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

	strRandom = (nombreCaractere) => {
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let result = '';
		for (let i = 0; i < nombreCaractere; i++) {
			result += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		return result;
	};

	async createForm(login, req) {
		let crypto = require('crypto')
		const user = await this.getByLogin(login);
		const role = user.role
		const id = user._id
		const fuseauHoraire = Intl.DateTimeFormat().resolvedOptions().timeZone;
		const ipAdresse = req.ip;
		const navigateur = req.headers['user-agent'] || '';
		const deviceFingerprint = crypto.createHash('sha256').update(fuseauHoraire + ipAdresse + navigateur).digest('hex');
		const issuedAt = Date.now();
		const expiresAt = issuedAt + 90000; //15 minutes
		let form = {
			userId: id,
			role: role,
			issuedAt: issuedAt,
			expiresAt: expiresAt,
			deviceFingerprint: deviceFingerprint,
			scope: [],
			issuer: "auth server",
		}
		return form;
	}

	createNonce = (datas) => {
		let crypto = require('crypto')
		let i = 0;
		while (true) {
			datas = crypto.createHash('sha256').update(datas + i).digest('hex');
			if (datas.startsWith('000')) {
				let nonce = { nonce: i, proofOfWork: datas }
				return nonce;
			}
			i++;
		}
	}

	async createToken(login, req) {
		let form = await this.createForm(login, req)
		let result = this.createNonce(form);
		form.nonce = result.nonce
		form.proofOfWork = result.proofOfWork
		await this.create(form);
		const token = Buffer.from(JSON.stringify(form)).toString('base64');
		return token
	}

	async verifToken(token, res) {
		if (token) {
			if (token.expiresIn < Date.now()) {
				const success = await this.deleteById(tokenExiste.userId);
				if (!success) {
					res.status(404).json({ message: 'Token non trouvé' });
				} else {
					res.status(200).json({ message: 'Veuillez vous reconnecter' });
				}
				return false;
			}
			else {
				res.status(201).json({ token: Buffer.from(JSON.stringify(tokenExiste)).toString('base64') });
				return true;
			}
		}
	}

	async getSalt(identifiant) {
		try {
			// On suppose qu'il y a un document spécifique pour la config, par exemple avec _id = 'globalConfig'
			const user = await this.collection.findOne({ login: identifiant });
			if (user) {
				return user.salt;
			} else {
				return null;
			}

		} catch (error) {
			throw new Error('Erreur lors de la récupération du salt');
		}
	}
	async getLoginAndPassword(identifiant, hashedPassword) {
		const bdd_user = await this.collection.findOne({ login: identifiant });
		if (bdd_user.password === hashedPassword) {
			return true
		}
	}

	checkDatas(datas, res) {
		const nouveauCompte = (datas.id === 0);
		const lignes = ['fname', 'name', 'login', 'password'];
	
		console.log(datas)
		// Vérification des champs obligatoires
		for (const ligne of lignes) {
			if (!datas[ligne] || datas[ligne].trim().length === 0) {
				if (ligne === 'fname') {
					return res.status(400).json({ message: "Veuillez définir un Prénom." });
				}
				if (ligne === 'name') {
					return res.status(400).json({ message: "Veuillez définir un Nom." });
				}
				if (ligne === 'login' && nouveauCompte) {
					return res.status(400).json({ message: "Veuillez définir un Login." });
				}
				if (ligne === 'password' && nouveauCompte) {
					return res.status(400).json({ message: "Veuillez définir un mot de passe." });
				}
			}
		}
	
		// Vérification de l'adresse email
		const regexEmail = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,7}\b/;
		if (!('email' in datas) || !regexEmail.test(datas.email)) {
			return res.status(400).json({ message: "Veuillez définir une adresse email valide." });
		}
		delete datas.id;
		return true;
	}

	
}	

module.exports = UserModel;