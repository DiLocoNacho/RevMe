const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = process.env.SALT;
const iv = crypto.randomBytes(16);

module.exports = {

    encryptKey: ((apiKey) => {
        let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
        let encrypted = cipher.update(apiKey);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
    }),

    decryptKey: ((encryptedApiKey) => {
        let iv = Buffer.from(encryptedApiKey.iv, 'hex');
        let encryptedText = Buffer.from(encryptedApiKey.encryptedApiKey.toString(), 'hex');
        let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    })
}