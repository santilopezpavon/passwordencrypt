const Password = require('../Model/Password'); // Asegúrate de que la ruta sea correcta

describe('Password class', () => {

    test('should get and set label correctly', () => {
        const password = new Password();
        password.label = 'Label1';
        expect(password.label).toBe('Label1');
        password.label = 'NewLabel';
        expect(password.label).toBe('NewLabel');
    });

    test('should get and set entity correctly', () => {
        const password = new Password();
        password.label = "My Label"; 
        password.userName = "MyUserName"; 
        password.password = "MyPassword";
        expect(password.label).toBe('My Label');
        expect(password.userName).toBe('MyUserName');
        expect(password.password).toBe('MyPassword');
    })

    test('should set all properties entity correctly', () => {
        const password = new Password();

        password.setAllProperties({
            "label": "My Label",
            "userName": "MyUserName",
            "password": "MyPassword",
            "falseProp": "False prop"
        });

        expect(password.label).toBe('My Label');
        expect(password.userName).toBe('MyUserName');
        expect(password.password).toBe('MyPassword');
        expect(password.falseProp).toBeUndefined();
    })

 

});
