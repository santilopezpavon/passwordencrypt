const SecretPassword = require("./src/SecretPassword");
const Menu = require("./src/Menu");

const secretPassword = new SecretPassword();
const menu = new Menu();

secretPassword.requestKeyPassword(function (secretKeyPlain) {
    menu.getMenu(secretKeyPlain);
});

