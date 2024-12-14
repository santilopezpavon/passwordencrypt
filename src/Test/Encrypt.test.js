const Encrypter = require('../Encrypter'); // Asegúrate de que la ruta sea correcta

describe('Enctrypter', () => {
    test('encrypt and decrypt', () => {
        const encrypter = new Encrypter();
        const secretKeyTest= '1234';
        const textEncrypt = 'Hello World';
        const textEncripted = encrypter.encrypt(textEncrypt, secretKeyTest);
        expect(textEncripted).not.toBe(textEncrypt);
        const decrypt = encrypter.decrypt(textEncripted, secretKeyTest);
        expect(decrypt).toBe(textEncrypt);
    });
  
});
