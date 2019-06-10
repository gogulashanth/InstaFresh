import firebase from 'react-native-firebase';

class API {
  constructor() {
    this.ref = firebase.firestore().collection('product_data');
  }

  getProductList(query, numItems = 10, callback) {
    this.ref.where('name', '>=', query).orderBy('name').orderBy('preference', 'desc').limit(numItems).get().then((snapshot) => {
      callback(snapshot.docs);
    });
    // if(this.previousQuery == query) {
    //   return this.cachedResults;
    // }else if (query.startsWith(this.previousQuery)) {
    //   return this.cachedResults.filter();
    // }else {
    //   // Perform new api call
    //   this.ref.
    // }
  }
}

const api = new API();

export default api;