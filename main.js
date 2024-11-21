const SecretPassword = require("./src/SecretPassword.js");
const Menu = require("./src/Menu");
const path = require('path'); 
const fs = require('fs');

const secretPassword = new SecretPassword();
const menu = new Menu();

const parseCommandLineArgs = require('./src/Utils/ParserArgs');
const args = parseCommandLineArgs();

if(!args.hasOwnProperty("path")) {
    console.log("The path is mandatory");
    process.exit(0);
}

const urlFile = path.join(__dirname, args["path"]);
if (!fs.existsSync(urlFile)) {
    console.log("The directory not " + urlFile + " exists");
    process.exit(0);
}

process.env["folderPass"] = urlFile;

secretPassword.requestKeyPassword(function (secretKeyPlain) {
    menu.displayMenu(secretKeyPlain);
});
