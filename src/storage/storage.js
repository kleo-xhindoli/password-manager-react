/*global chrome*/
class PW_Storage {
    constructor() {
        console.log('PW_storage initialized');
        
        this.createCollection('credentials');
        this.createCollection('passwords');
    }

    setSoft(key, value) {
        let promise = new Promise((resolve, reject) => {
            chrome.storage.local.get(key, (item) => {
                if (Object.keys(item).length) {
                    resolve('exists');
                }
                else {
                    let toSet = {};
                    toSet[key] = value;
                    chrome.storage.local.set(toSet, (res) => {
                        resolve('created');
                    });
                }
            });
        });
        return promise;
    }

    get(key) {
        let promise = new Promise((resolve, reject) => {
            chrome.storage.local.get(key, (item) => {
                resolve(item[key]);
            });
        });
        return promise;
    }

    set(key, value) {
        let promise = new Promise((resolve, reject) => {
            let toSet = {};
            toSet[key] = value;
            chrome.storage.local.set(toSet, (res) => {
                resolve(res);
            });
        });
        return promise;
    }

    remove(key) {
        let promise = new Promise((resolve, reject) => {
            chrome.storage.local.remove(key, (res) => resolve(res));
        })
        return promise;
    }

    clear() {
        let promise = new Promise((resolve, reject) => {
            chrome.storage.local.clear(() => resolve());
        });
        return promise;
    }

    createCollection(collection) {
        return this.setSoft(collection, []);
    }

    insert(collection, el) {
        return this.get(collection)
        .then((res) => {
            console.log ('collection: ' + collection)
            console.log ('res:')
            console.log(res)
            if (!el.id)
                el.id = this._generateId();
            if (!el.created_at) {
                const date = new Date();
                el.created_at = date.toISOString();
            }
            debugger;
            res.push(el);
            return this.set(collection, res);
        })
    }

    getById(collection, id) {
        return this.get(collection)
        .then((result) => {
            return result.find(e => e.id === id);
        });
    }

    removeById(collection, id) {
        return this.get(collection)
        .then((result) => {
            let index = result.findIndex(e => e.id === id);
            if (index > -1){
                result.splice(index);
                return this.set(collection, result);
            }
            else {
                return result
            }
        })
    }

    removeAll(collection) {
        return this.set(collection, []);
    }

    update(collection, id, newValue) {
        return this.removeById(collection, id)
        .then(() => {
            if (!newValue.id)
                newValue.id = id
            console.log('new value:')
            console.log(newValue);
            return this.insert(collection, newValue)
        })
    }

    filter(collection, filterObj) {
        return this.get(collection)
        .then((result) => {
            return result.filter((el) => {
                return Object.keys(filterObj).every((key) => {
                    return el[key] === filterObj[key];
                });
            });
        });
    }

    _generateId() {
        let s4 = () => {
            return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }


}

export default PW_Storage