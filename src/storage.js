/*global chrome*/
class PW_Storage {
    constructor() {
        console.log('PW_storage initialized')
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
                        resolve('created')
                    })
                }
            })
        })
        return promise
    }

    get(key) {
        let promise = new Promise((resolve, reject) => {
            chrome.storage.local.get(key, (item) => {
                resolve(item[key])
            })
        })
        return promise
    }

    set(key, value) {
        let promise = new Promise((resolve, reject) => {
            let toSet = {}
            toSet[key] = value
            chrome.storage.local.set(toSet, (res) => {
                resolve(res)
            })
        })
        return promise
    }

    clear() {
        let promise = new Promise((resolve, reject) => {
            chrome.storage.local.clear(() => resolve())
        })
        return promise;
    }

    createCollection(collection) {
        return this.setSoft(collection, [])
    }




}

export default PW_Storage