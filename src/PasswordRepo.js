const fs = require('fs');
const path = require('path'); 
const Encrypter = require("./Encrypter");
const Password = require("./Model/Password");

class PasswordRepo {
    
    PASSWORD_FILE = 'PASSWORD_DB.json';

    encrypter;

    constructor() {
        this.encrypter = new Encrypter();
    }

    #getFileHashPath() {
        //console.log(process.env);
        return path.join(process.env.folderPass, this.PASSWORD_FILE);
    }

    #create(label, userName, password, secretKey) {
        const passwordFile = this.#getFileHashPath();
        const encryptedUserName = this.encrypter.encrypt(userName, secretKey);
        const encryptedPassword = this.encrypter.encrypt(password, secretKey);     

        const pass = new Password(label, encryptedUserName, encryptedPassword);

        let passwordDB = [];
        if (fs.existsSync(passwordFile)) {
            const fileContent = fs.readFileSync(passwordFile, 'utf8');
            passwordDB = JSON.parse(fileContent);
        }
        const passwordData = pass.getAllData();
        passwordDB.push(passwordData);
        fs.writeFileSync(passwordFile, JSON.stringify(passwordDB, null, 2));
        console.log('Contraseña agregada con éxito.');
    }

    #update(id, propertiesToUpdate, secretKey) {
        const passwordFile = this.#getFileHashPath();
        const currentPass = this.getPassword(id);

        let passwordData = new Password();
        passwordData.setAllProperties(currentPass);

        for (const key in propertiesToUpdate) {
            if(passwordData.isEncryptedField(key)) {
                passwordData[key] = this.encrypter.encrypt(propertiesToUpdate[key], secretKey);
            } else {
                passwordData[key] = propertiesToUpdate[key];
            }
        }

        let passwordDB = [];
        if (fs.existsSync(passwordFile)) {
            const fileContent = fs.readFileSync(passwordFile, 'utf8');
            passwordDB = JSON.parse(fileContent);
        }

        if(typeof passwordDB[id] !== 'undefined')  {
            const dataToSave = passwordData.getAllData();
            passwordDB[id] = dataToSave;
        } 
        
        fs.writeFileSync(passwordFile, JSON.stringify(passwordDB, null, 2));
        console.log('Contraseña agregada con éxito.');
    }
    
    addOrUpdatePassword(secretKey, label= '', userName = '', password = '', id = null) {
        if(id === null) {
            this.#create(label, userName, password, secretKey);
            return;
        } else {            
            let passwordData = {
                ...(label && {label}),
                ...(userName && {userName}),
                ...(password && {password}),
            };
            this.#update(id, passwordData, secretKey);
            return;
        }
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

        if (!fs.existsSync(passwordFile)) { 
            return {};
        }

        const fileContent = fs.readFileSync(passwordFile, 'utf8');
        const passwordDB = JSON.parse(fileContent);
        const userData = passwordDB[id];
        if (!userData) {
            return {};
        }

        let password = new Password();
        password.setAllProperties(userData);
        let dataPassword = password.getAllData();

        if(secretKey === null) {
            return dataPassword;
        } else {
            for (const key in dataPassword) {
                if(password.isEncryptedField(key)) {
                    dataPassword[key] = this.encrypter.decrypt(dataPassword[key], secretKey);
                }
            }
            return dataPassword;
        }
    }

    getPasswords() {
        const passwordFile = this.#getFileHashPath();
        if (fs.existsSync(passwordFile)) {
            const fileContent = fs.readFileSync(passwordFile, 'utf8');
            const passwordDB = JSON.parse(fileContent);

           const decryptedPasswords = passwordDB.map((entry, index) => {
                  return {
                    id: index,
                    label: entry.label,
                  };
              
              });
              
              

            return decryptedPasswords;
        } else {
            return [];
        }
    }
}

module.exports = PasswordRepo;
