import Joi from 'joi-browser';

class AppStorage {

    constructor(storage) {
        this.storage = storage;
        this.schema = Joi.object().keys({
            id: Joi.string().optional(),
            domain: Joi.string().required(),
            created_at: Joi.date().iso().optional()
        });
        this.storage.createCollection('apps');
        console.log ('App Storage initialized');
    }

    getById(id) {
        return this.storage.getById('apps', id);
    }

    getAll() {
        return this.storage.get('apps');
    }

    insert(app) {
        const promise = new Promise((resolve, reject) => {
            const result = this.schema.validate(app);
            if (result.error) {
                reject('Invalid schema for App');
            }
            this.storage.insert('apps', app)
            .then((result) => resolve(result));
        });
        return promise;
    }

    update(id, app) {
        const promise = new Promise((resolve, reject) => {
            const result = this.schema.validate(app);
            if (result.error) reject('Invalid schema for App');
            console.log('my app')
            console.log(app)
            this.storage.update('apps', id, app)
            .then((result) => resolve(result));
        });
        return promise;
    }

    remove(id) {
        return this.storage.removeById('apps', id);
    }

    removeAll() {
        return this.storage.removeAll('apps');
    }

    filter(filterObj) {
        return this.storage.filter('apps', filterObj);
    }

}

export default AppStorage;
