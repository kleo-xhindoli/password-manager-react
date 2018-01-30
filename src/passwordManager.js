import CryptoJS from 'crypto-js';

class PasswordManager {
    hash(string, salt) {
        if (!salt) salt = this._generateSalt(false);
        let str = `${salt}${string}${salt}`;
        let hash = CryptoJS.SHA256(str);
        let hashStr = hash.toString(CryptoJS.enc.Hex);
        return {
            hash: hashStr,
            salt: salt
        };
    }

    _generateSalt(toWordArray) {
        let words = CryptoJS.lib.WordArray.random(128/8);
        if (toWordArray) return words;
        return CryptoJS.enc.Base64.stringify(words);
    }

    generateKeyFromPassword(password, salt) {
        let key = CryptoJS.PBKDF2("Secret Passphrase", salt, { keySize: 512/32, iterations: 1000 });
        return key.toString(CryptoJS.enc.Hex)
    }

    generateStrongPassword() {
        const length = 12;
        let password = '', character; 
        while (length > password.length) {
            if (password.indexOf(character = String.fromCharCode(Math.floor(Math.random() * 94) + 33), Math.floor(password.length / 94) * 94) < 0) {
                password += character;
            }
        }
        return password;
    }

    encrypt(string, key) {
        const ciphertext = CryptoJS.AES.encrypt(string, key);
        return ciphertext.toString();
    }

    decrypt(string, key) {
        const bytes  = CryptoJS.AES.decrypt(string, key);
        return bytes.toString(CryptoJS.enc.Utf8);
    }
}

export default PasswordManager
