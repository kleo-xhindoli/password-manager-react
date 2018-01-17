import CryptoJS from 'crypto-js';

class PasswordManager {
    hash(string, salt) {
        if (!salt) salt = this._generateSalt(false);
        let i = 0;
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
}

export default PasswordManager
