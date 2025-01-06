const { ObjectId } = require("mongodb");
const fonction = require("../../../../functions");

class TokenModel {
    constructor(collection2) {
        this.collection = collection2;
    }

    async create(newToken) {
        const result = await this.collection.insertOne(newToken);
        return { _id: result.insertedId, ...newToken };
    }

    async updateById(id, updatedToken) {
        const { _id, userId, ...fieldsToUpdate } = updatedToken;
        const result = await this.collection.updateOne(
            { userId: new ObjectId(id) },
            { $set: fieldsToUpdate }
        );
        return result.matchedCount > 0;
    }

    async deleteById(id) {
        const result = await this.collection.deleteOne({ userId: new ObjectId(id) });
        return result.deletedCount > 0;
    }

    async getToken(id) {
        console.log("dans la fonction");
        return await this.collection.findOne({ userId: new ObjectId(id) });
    }

    // async verifToken(tokenExiste, res, req) {
    //     if (tokenExiste) {
    //         if (tokenExiste.expiresIn < Date.now()) {
    //             const success = await this.deleteById(tokenExiste.userId);
    //             if (!success) {
    //                 return res.status(404).json({ message: 'Token non trouvé' });
    //             }
    //             return false;
    //         }
    //         else {
    //             let donnee = fonction.createData(req);
    //             let data = tokenExiste.userId + tokenExiste.role + tokenExiste.issuedAt + donnee.finToken + tokenExiste.deviceFingerprint;
    //             let donnees = fonction.createNonce(data);
    //             const newToken = {
    //                 userId: tokenExiste.userId, role: tokenExiste.role,
    //                 issuedAt: tokenExiste.issuedAt, expiresIn: donnee.finToken,
    //                 nonce: donnees.nonce, proofOfWork: donnees.proofOfWork,
    //                 scope: ["write", "read"], issuer: "authServer",
    //                 deviceFingerprint: tokenExiste.deviceFingerprint
    //             };

    //             const success = await this.updateById(tokenExiste.userId, tokenExiste);
    //             if (!success) {
    //                 return res.status(404).json({ message: 'Token non trouvé' });
    //             }
    //             return res.status(201).json({ token: Buffer.from(JSON.stringify(tokenExiste)).toString('base64') });
    //             // return true;
    //         }
    //     }
    // }
}

module.exports = TokenModel;