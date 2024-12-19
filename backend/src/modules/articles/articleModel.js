const { ObjectId } = require('mongodb');
// const TokenModel = require('./articles/token_model');
const crypto = require('crypto');

class ArticleModel {
	constructor(collection) {
		this.collection = collection;
	}

	async getAll() {
		console.log('ça pète pas')
		return await this.collection.find({}).toArray();
	}

	async getById(id) {
		return await this.collection.findOne({ _id: new ObjectId(id) });
	}

	async getByLogin(login) {
		const article = await this.collection.findOne({ login: login });
		return article;
	}

	async create(newArticle) {
		const result = await this.collection.insertOne(newArticle);
		return { _id: result.insertedId, ...newArticle };
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
		const lignes = ['name', 'description'];
		// Vérification des champs obligatoires
		for (const ligne of lignes) {
			if (!datas[ligne] || datas[ligne].trim().length === 0) {
				if (ligne === 'name') {
					throw "Veuillez définir un Nom d'article.";
				}
				if (ligne === 'description' && nouveauCompte) {
					throw "Veuillez ajouter une description." ;
				}
			}
			if ((!datas['prix'] && !datas['prix_kg'])|| (datas['prix_kg'] === 0 && datas['prix'] === 0)) {
				throw "Veuillez définir un prix." ;
			}
		}

		return true;
	}



}
module.exports = ArticleModel;