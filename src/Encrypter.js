const crypto = require('crypto');

class Encrypter {

    ALGORITHM = 'aes-256-cbc';

    #generateKey(secretKey) {
        return crypto.createHash('sha256').update(secretKey).digest();
    }

    encrypt(text, secretKey) {
        const iv = crypto.randomBytes(16);
        const key = this.#generateKey(secretKey);
        const cipher = crypto.createCipheriv(this.ALGORITHM, key, iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return iv.toString('hex') + ':' + encrypted;
    }

    decrypt(encrypted, secretKey) {
        const textParts = encrypted.split(':');
        const iv = Buffer.from(textParts.shift(), 'hex');
        const encryptedText = textParts.join(':');
        const key = this.#generateKey(secretKey);
        const decipher = crypto.createDecipheriv(this.ALGORITHM, key, iv);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }

}

module.exports = Encrypter;
