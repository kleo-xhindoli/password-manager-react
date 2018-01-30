import Joi from 'joi-browser';

class PasswordStorage {

    constructor(storage) {
        this.storage = storage;
        this.schema = Joi.object().keys({
            id: Joi.string().optional(),
            app_id: Joi.string().required(),
            passwords: Joi.array().items(Joi.object().keys({
                id: Joi.string().optional(),
                created_at: Joi.date().iso().optional(),
                value: Joi.string().required(),
                active: Joi.boolean()
            })).required(),
            created_at: Joi.date().iso().optional()
        });
        this.storage.createCollection('passwords');
        console.log ('Password Storage initialized');
    }

    getById(id) {
        return this.storage.getById('passwords', id);
    }

    getAll() {
        return this.storage.get('passwords');
    }

    insert(password) {
        const promise = new Promise((resolve, reject) => {
            const result = this.schema.validate(password);
            if (result.error) {
                reject('Invalid schema for password');
            }
            this.storage.insert('passwords', password)
            .then((result) => resolve(result));
        });
        return promise;
    }

    update(id, password) {
        const promise = new Promise((resolve, reject) => {
            const result = this.schema.validate(password);
            if (result.error) reject('Invalid schema for password');
            this.storage.update('passwords', id, password)
            .then((result) => resolve(result));
        });
        return promise;
    }

    remove(id) {
        return this.storage.removeById('passwords', id);
    }

    removeAll() {
        return this.storage.removeAll('passwords');
    }

    filter(filterObj) {
        return this.storage.filter('passwords', filterObj);
    }

    getByAppId(appId) {
        return this.filter({app_id: appId});
    }

    createNewPassword(appId, password) {
        const pwObject = {
            app_id: appId,
            passwords: []
        }
        const date = new Date();
        pwObject.passwords.push({
            id: this.storage.generateId(),
            value: password,
            created_at: date.toISOString(),
            active: true
        });
        return this.insert(pwObject);
    }

    pushPasswordToId(id, value) {
        const date = new Date();
        const password = {
            id: this.storage.generateId(),
            created_at: date.toISOString(),
            value
        }
        return new Promise((resolve, reject) => {
            this.getById(id)
            .then((object) => {
                if (object) {
                    object.passwords.push(password);
                    this.update(id, object).then(resolve);
                }
                else {
                    reject('No password found with id: ' + id);
                }
            });
        });
    }

    getPasswordsForId(id) {
        return this.getById(id)
        .then((password) => {
            if (password && password.passwords && password.passwords.length) {
                return password.passwords;
            }
            return [];
        });
    }

    getActivePasswordForId(id) {
        return this.getPasswordsForId(id)
        .then((passwords) => {
            if (passwords) {
                return passwords.find(p => p.active === true)
            }
            return [];
        })
    }

    //useful in instances where you just created a new password entity and have a reference to the newly created entity. is sync
    findActivePasswordInObject(object, returnValue = true) {
        const pw = object.passwords.find(p => p.active === true);
        if (returnValue) {
            return pw.value;
        }
        return pw;
    }


}

export default PasswordStorage;
