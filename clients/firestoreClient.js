const Firestore = require('@google-cloud/firestore');
const path = require('path');

class FirestoreClient {
    constructor() {
        this.firestore = new Firestore({
            projectId: 'diffudle',
            keyFilename: (__dirname, '../KeysManager/Diffudle/service-account.json')
        })
    }

    async save(collection,docId,data) {
        const docRef = this.firestore.collection(collection).doc(docId);
        await docRef.set(JSON.parse(JSON.stringify(data)));
    }

    async saveSubCollections(rootCol,rootDocName, subCol, subColData) {
        const docRef = this.firestore.collection(rootCol).doc(rootDocName).collections(subCol).doc(subColData.colName);
        await docRef.set(subColData);
    }

    async getCollection(collection, docId){
        const doc = await this.firestore.collection(collection).doc(docId).get();
        return doc.data();
    }

    
}

module.exports = new FirestoreClient();