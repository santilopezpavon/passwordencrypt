const fs = require('fs');
const path = require('path'); 
const crypto = require('crypto');
const readlineSync = require('readline-sync');
const parseCommandLineArgs = require('./Utils/ParserArgs');

class SecretPassword {
    
    HASH_FILE = 'hash_secret_key.txt';

    ALGORITHM = 'sha512';

    #getFileHashPath() {
        return path.join(process.env.folderPass, this.HASH_FILE);
    }

    #ensureDirectoryExistence(filePath) { 
        const dir = path.dirname(filePath); 
        if (!fs.existsSync(dir)) { 
            fs.mkdirSync(dir, { recursive: true }); 
        } 
    }

    generateSecretKey(secretKeyPlain) {
        try {
            const hashPathFile = this.#getFileHashPath(); 
            this.#ensureDirectoryExistence(hashPathFile);
            const hash = crypto.createHash(this.ALGORITHM).update(secretKeyPlain).digest('hex');
            fs.writeFileSync(hashPathFile, hash);
            return true;
        } catch (error) {
            console.error(error);
            return null; 
        }        
    }

    checkSecretKey(secretKeyPlain) {
        const hashPathFile = this.#getFileHashPath(); 
        const hash = crypto.createHash(this.ALGORITHM).update(secretKeyPlain).digest('hex');
        const storedHash = fs.readFileSync(hashPathFile, 'utf8').trim();       
        if(storedHash == hash) {
            return true;
        } else {
            return false;
        }
    }

    checkKeyPasswordExists() {
        const hashPathFile = this.#getFileHashPath(); 
        return fs.existsSync(hashPathFile);
    }

    requestKeyPassword(callback, question = 'Insert the secret key') {
        if(this.checkKeyPasswordExists()) {
            
            const claveSecreta = readlineSync.question(question + ': ', {
                hideEchoBack: true,
                mask: "*"
            }); 
    
            if(claveSecreta == '0') {
                return;
            }
    
            if(this.checkSecretKey(claveSecreta)) {
                callback(claveSecreta);
            } else {
                this.requestKeyPassword(callback, "The secret key is wrong, please insert the correct secret key");
            }
        } else {
            const claveSecreta = readlineSync.question("Please insert a new secret key" + ': ', {
                hideEchoBack: true,
                mask: "*"
            }); 
    
            if(claveSecreta == '0') {
                return;
            }
    
            const claveSecretaAgain = readlineSync.question("Please insert again the secret key" + ': ', {
                hideEchoBack: true,
                mask: "*"
            }); 
    
            if(claveSecreta != claveSecretaAgain) {
                this.requestKeyPassword(callback, "The secret key not match");
            } else {
                this.generateSecretKey(claveSecreta);
                callback(claveSecreta);
            }
        }
    }

}

module.exports = SecretPassword;
