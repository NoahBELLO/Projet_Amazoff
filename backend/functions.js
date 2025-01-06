const crypto = require('crypto');

exports.strRandom = (nombreCaractere) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < nombreCaractere; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

exports.createNonce = (datas) => {
    let compteur = 0; let result;
    while (true) {
        result = crypto.createHash('sha256').update(datas + compteur).digest('hex');
        if (result.startsWith('000')) {
            return { nonce: compteur, proofOfWork: result };
        }
        compteur++;
    }
}

exports.verifNonce = (datas, nonce, proofOfWork) => {
    let result = crypto.createHash('sha256').update(datas + nonce).digest('hex');
    return result === proofOfWork && result.startsWith('000');
}

exports.createData = (req) => {
    const issuedAt = Date.now();
    const expiresIn = Date.now() + 900000;
    const fuseauHoraire = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const ipAdresse = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const navigateur = req.headers['user-agent'] || '';
    const deviceFingerprint = crypto.createHash('sha256').update(ipAdresse + fuseauHoraire + navigateur).digest('hex');
    return { debutToken: issuedAt, finToken: expiresIn, empreinteOrdi: deviceFingerprint };
}