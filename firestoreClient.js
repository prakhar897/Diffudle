const Firestore = require('@google-cloud/firestore');
const path = require('path');

class FirestoreClient {
    constructor() {
        this.firestore = new Firestore({
            projectId: 'diffudle',
            keyFilename: (__dirname, './service-account.json')
        })
    }

    async save(collection,data) {
        const docRef = this.firestore.collection(collection).doc(data.Id);
        await docRef.set(data);
    }

    async saveSubCollections(rootCol,rootDocName, subCol, subColData) {
        const docRef = this.firestore.collection(rootCol).doc(rootDocName).collections(subCol).doc(subColData.colName);
        await docRef.set(subColData);
    }

    
}

module.exports = new FirestoreClient();