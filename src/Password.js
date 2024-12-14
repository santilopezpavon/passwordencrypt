const fs = require('fs');
const path = require('path'); 
const Encrypter = require("./Encrypter");

class Password {
    
    PASSWORD_FILE = 'PASSWORD_DB.json';

    encrypter;

    constructor() {
        this.encrypter = new Encrypter();
    }

    #getFileHashPath() {
        //console.log(process.env);
        return path.join(process.env.folderPass, this.PASSWORD_FILE);
    }
   
    addOrUpdatePassword(secretKey, label= '', userName = '', password = '', id = null) {
        const passwordFile = this.#getFileHashPath();
        // Create
        const encryptedUserName = this.encrypter.encrypt(userName, secretKey);
        const encryptedPassword = this.encrypter.encrypt(password, secretKey);     
       let passwordData = {};

        if(id == null) {
            passwordData = {
                "label": label,
                "userName": encryptedUserName,
                "password": encryptedPassword,
            };
        }
        
        // Update 
        if(id !== null) {
            const currentPass = this.getPassword(id);
            passwordData = currentPass;
            if(label != '') {
                passwordData["label"] = label;
            }
            if(userName != '') {
                passwordData["userName"] = encryptedUserName;
            }
            if(password != '') {
                passwordData["password"] = encryptedPassword;
            }


        }

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

    getPassword(id, secretKey = null) {
        const passwordFile = this.#getFileHashPath();
        if (fs.existsSync(passwordFile)) {
            const fileContent = fs.readFileSync(passwordFile, 'utf8');
            const passwordDB = JSON.parse(fileContent);

            if(passwordDB[id]) {
                if(secretKey === null) {
                    return {
                        label: passwordDB[id].label,
                        userName: passwordDB[id].userName,
                        password: passwordDB[id].password,
                    }
                } else {
                    return {
                        label: passwordDB[id].label,
                        userName: this.encrypter.decrypt(passwordDB[id].userName, secretKey),
                        password: this.encrypter.decrypt(passwordDB[id].password, secretKey),
                    }
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
                  return {
                    pos: index,
                    label: entry.label,
                  };
              
              });
              
              

            return decryptedPasswords;
        } else {
            return [];
        }
    }
}

module.exports = Password;
