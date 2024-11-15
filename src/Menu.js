const Password = require("./Password");
const SecretPassword = require("./SecretPassword");
const readlineSync = require('readline-sync');


class Menu {
    
    passwordService;
    
    constructor() {
        this.passwordService = new Password();
    }

    getMenu(secretKeyPlain) {
        console.log(`
            === Options ===
            1. Get Password List
            2. Get Password by ID
            3. Create new Password
            4. Update password
            5. Remove password
        `);
        const option = readlineSync.question('Please Chose An Option: ');
        this.proccessOptionMenu(option, secretKeyPlain);
    }

    proccessOptionMenu(option, secretKeyPlain) {
        let label, userName, id, pass, password, passwords;
        switch (option) {
            case "1":
                passwords = this.passwordService.getPasswords();
                console.log(passwords);
                this.getMenu(secretKeyPlain);
                break;
            case "2":
                id = readlineSync.question('Please Chose An ID: ');
                password = this.passwordService.getPassword(id, secretKeyPlain);
                console.log(password);
                this.getMenu(secretKeyPlain);
                break;
            case '3':
                label = readlineSync.question('Label: ');
                userName = readlineSync.question('name: ');
                pass = readlineSync.question('password: ', {
                    mask: "*",
                    hideEchoBack: true,

                });
                this.passwordService.addOrUpdateNewPassword(label, userName, pass, secretKeyPlain);
                this.getMenu(secretKeyPlain);
                break;
            case '4':
                id = readlineSync.question('Id: ');
                label = readlineSync.question('Label: ');
                userName = readlineSync.question('name: ');
                pass = readlineSync.question('password: ', {
                     mask: "*",
                     hideEchoBack: true,

                });
                this.passwordService.addOrUpdateNewPassword(label, userName, pass, secretKeyPlain, id);
                this.getMenu(secretKeyPlain);

                break;
            case '5':
                id = readlineSync.question('Id: ');              
                this.passwordService.removePassword(id);
                this.getMenu(secretKeyPlain);

                break;
            default:
                break;
        }
    }


}

module.exports = Menu;
