const Password = require("./Password");
const readlineSync = require('readline-sync');

/**
 * Class representing the menu for password management.
 */
class Menu {
    
    passwordService;
    
    /**
     * Create a Menu.
     */
    constructor() {
        this.passwordService = new Password();
    }

    /**
     * Display the menu options and process the selected option.
     * @param {string} secretKeyPlain - The plain secret key for encryption.
     */
    displayMenu(secretKeyPlain) {
        const optionsMenu = [
            "Get Password List",
            "Get Password by ID",
            "Create new Password",
            "Update Password",
            "Remove Password"
        ];
        const option = readlineSync.keyInSelect(optionsMenu, 'Please Choose An Option:');
        this.processOptionMenu(option, secretKeyPlain);
    }

    /**
     * Process the selected menu option.
     * @param {number} option - The selected menu option.
     * @param {string} secretKeyPlain - The plain secret key for encryption.
     */
    processOptionMenu(option, secretKeyPlain) {
        switch (option) {
            case 0:
                this.getPasswordList(secretKeyPlain);
                break;
            case 1:
                this.getPasswordById(secretKeyPlain);
                break;
            case 2:
                this.createPassword(secretKeyPlain);
                break;
            case 3:
                this.updatePassword(secretKeyPlain);
                break;
            case 4:
                this.removePassword(secretKeyPlain);
                break;
            default:
                console.log('Exiting...');
                break;
        }
    }

    /**
     * Retrieve and display the list of passwords.
     * @param {string} secretKeyPlain - The plain secret key for encryption.
     */
    getPasswordList(secretKeyPlain) {
        try {
            const passwords = this.passwordService.getPasswords(secretKeyPlain);
            console.table(passwords);
        } catch (error) {
            console.error('Error retrieving password list:', error.message);
        }
        this.displayMenu(secretKeyPlain);
    }

    /**
     * Retrieve and display a password by its ID.
     * @param {string} secretKeyPlain - The plain secret key for encryption.
     */
    getPasswordById(secretKeyPlain) {
        const id = readlineSync.question('Please Choose An ID: ');
        try {
            const password = this.passwordService.getPassword(id, secretKeyPlain);
            console.table(password);
        } catch (error) {
            console.error(`Error retrieving password with ID ${id}:`, error.message);
        }
        this.displayMenu(secretKeyPlain);
    }

    /**
     * Create a new password entry.
     * @param {string} secretKeyPlain - The plain secret key for encryption.
     */
    createPassword(secretKeyPlain) {
        const label = readlineSync.question('Label: ');
        const userName = readlineSync.question('User name: ');
        const pass = readlineSync.question('Password: ', { hideEchoBack: true });
        try {
            this.passwordService.addOrUpdatePassword(secretKeyPlain, label, userName, pass);
            console.log('Password created successfully.');
        } catch (error) {
            console.error('Error creating password:', error.message);
        }
        this.displayMenu(secretKeyPlain);
    }

    /**
     * Update an existing password entry.
     * @param {string} secretKeyPlain - The plain secret key for encryption.
     */
    updatePassword(secretKeyPlain) {
        const id = readlineSync.question('Id: ');
        const label = readlineSync.question('Label: ');
        const userName = readlineSync.question('User name: ');
        const pass = readlineSync.question('Password: ', { hideEchoBack: true });
        try {
            this.passwordService.addOrUpdatePassword(secretKeyPlain, label, userName, pass, id);
            console.log('Password updated successfully.');
        } catch (error) {
            console.error('Error updating password:', error.message);
        }
        this.displayMenu(secretKeyPlain);
    }

    /**
     * Remove a password entry by its ID.
     * @param {string} secretKeyPlain - The plain secret key for encryption.
     */
    removePassword(secretKeyPlain) {
        const id = readlineSync.question('Id: ');
        try {
            this.passwordService.removePassword(id);
            console.log('Password removed successfully.');
        } catch (error) {
            console.error(`Error removing password with ID ${id}:`, error.message);
        }
        this.displayMenu(secretKeyPlain);
    }
}

module.exports = Menu;
