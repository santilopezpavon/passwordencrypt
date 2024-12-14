class Password {

    _encriptedFields = ["_userName", "_password"];

    constructor(label = '', user = '', pass = '') {
        this._label = label;
        this._userName = user;
        this._password = pass;
    }

    setAllProperties(properties) {
        for (const key in properties) {
            const keyObject = '_' + key;
            if(this.hasOwnProperty(keyObject)) {
                this[keyObject] = properties[key];
            }
        }
    }

    isEncryptedField(nameField) {
        const keyObject = '_' + nameField;
        if (this._encriptedFields.includes(keyObject)){
            return true;
        }
        return false;
    }
    
    // Getters
    get label() {
        return this._label;
    }
    get userName() {
        return this._userName;
    }
    get password() {
        return this._password;
    }
    
    // Setters

    
    set label(newLabel) {
        this._label = newLabel;
    }
    set userName(newUserName) {
        this._userName = newUserName;
    }
    set password(newPassword) {
        this._password = newPassword;
    }

    // Método para devolver todos los datos
    getAllData() {
        return {
            label: this._label,
            userName: this._userName,
            password: this._password
        };
    }
}

module.exports = Password;
