let admin = require('firebase-admin');
let serviceAccount = require('/Users/Shanth/Documents/instaFresh_data/instafresh-92127-firebase-adminsdk-16qq7-8733768a70.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://instafresh-92127.firebaseio.com',
});

const collectionKey = 'product_data_simplified';

const firestore = admin.firestore();
const settings = { timestampsInSnapshots: true };
firestore.settings(settings);

if (data && (typeof data === 'object')) {
  // let dataKey = Object.keys(data);
  // for (i = 10000; i < 30000; i++) {
  //   docKey = dataKey[i];
  //   firestore.collection(collectionKey).doc(docKey).set(data[docKey]).then((res) => {
  //       console.log("Document " + docKey + " successfully written!");
  //   }).catch((error) => {
  //     console.error("Error writing document: ", error);
  //   });;
  // }
  Object.keys(data).forEach((docKey) => {
    firestore.collection(collectionKey).doc(docKey).set(data[docKey]).then((res) => {
      console.log('Document ' + docKey + ' successfully written!');
    })
.catch((error) => {
      console.error('Error writing document: ', error);
    });
  });
}
