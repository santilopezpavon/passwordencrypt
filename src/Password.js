const fs = require('fs');
const path = require('path'); 
const crypto = require('crypto');

class Password {
    
    PASSWORD_FILE = 'PASSWORD_DB.json';
    ALGORITHM = 'aes-256-cbc';

    #getFileHashPath() {
        return path.join(__dirname, "../files", this.PASSWORD_FILE);
    }

    #generateKey(secretKey) {
        return crypto.createHash('sha256').update(secretKey).digest();
    }

    #encrypt(text, secretKey) {
        const iv = crypto.randomBytes(16);
        const key = this.#generateKey(secretKey);
        const cipher = crypto.createCipheriv(this.ALGORITHM, key, iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return iv.toString('hex') + ':' + encrypted;
    }

    #decrypt(encrypted, secretKey) {
        const textParts = encrypted.split(':');
        const iv = Buffer.from(textParts.shift(), 'hex');
        const encryptedText = textParts.join(':');
        const key = this.#generateKey(secretKey);
        const decipher = crypto.createDecipheriv(this.ALGORITHM, key, iv);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }

   
    addOrUpdateNewPassword(label, userName, password, secretKey, id = null) {
        const passwordFile = this.#getFileHashPath();
        const encryptedUserName = this.#encrypt(userName, secretKey);
        const encryptedPassword = this.#encrypt(password, secretKey);

        
        const passwordData = {
            "label": label,
            "userName": encryptedUserName,
            "password": encryptedPassword,
        };

        let passwordDB = [];
        if (fs.existsSync(passwordFile)) {
            const fileContent = fs.readFileSync(passwordFile, 'utf8');
            passwordDB = JSON.parse(fileContent);
        }
        if(id == null) {
            passwordDB.push(passwordData);
        } else if(typeof passwordDB[id] !== 'undefined')  {
            passwordDB[id] = passwordData;
        }        

        fs.writeFileSync(passwordFile, JSON.stringify(passwordDB, null, 2));
        console.log('Contraseña agregada con éxito.');
    }

    removePassword(id) {
        const passwordFile = this.#getFileHashPath();
        if (fs.existsSync(passwordFile)) {
            const fileContent = fs.readFileSync(passwordFile, 'utf8');
            const passwordDB = JSON.parse(fileContent);

            if(passwordDB[id]) {
                passwordDB.splice(id, 1);
                fs.writeFileSync(passwordFile, JSON.stringify(passwordDB, null, 2));

            }
        }

    }

    getPassword(id, secretKey) {
        const passwordFile = this.#getFileHashPath();
        if (fs.existsSync(passwordFile)) {
            const fileContent = fs.readFileSync(passwordFile, 'utf8');
            const passwordDB = JSON.parse(fileContent);

            if(passwordDB[id]) {
                return {
                    label: passwordDB[id].label,
                    userName: this.#decrypt(passwordDB[id].userName, secretKey),
                    password: this.#decrypt(passwordDB[id].password, secretKey),
                }
            }

        }
        return {};

    }

    getPasswords() {
        const passwordFile = this.#getFileHashPath();
        if (fs.existsSync(passwordFile)) {
            const fileContent = fs.readFileSync(passwordFile, 'utf8');
            const passwordDB = JSON.parse(fileContent);

           const decryptedPasswords = passwordDB.map((entry, index) => {
                if (entry.label) {
                  return {
                    label: entry.label,
                    userName: entry.userName,
                    password: entry.password,
                    pos: index 
                  };
                } else {
                  return null;
                }
              });
              
              

            return decryptedPasswords;
        } else {
            return [];
        }
    }
}

module.exports = Password;
