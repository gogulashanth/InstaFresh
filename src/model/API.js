import firebase from 'react-native-firebase';
import Item from 'model/Item';
import dataInstance from 'model/Data';
import Recipe from 'model/Recipe';
import LinkPreview from 'react-native-link-preview';
import { Image } from 'react-native';

const pexelsKey = '563492ad6f917000010000013c5f864ef37a45fca74670cc2533e863';
const edamamKeys = {
  appID: '72bcd401',
  appKey: '42efc71542c84f036dbfaef1b751c95b',
};

class API {
  static product_data_fields = {
    imageURI: 'imageURI',
    name: 'name',
    lower_case_name: 'lower_case_name',
    nutrition: 'nutrition',
  }

  constructor() {
    this.ref = firebase.firestore().collection('product_data_simplified');
    this.branded_data = firebase.firestore().collection('branded_product_data');
    this.previousQuery = '~!~';
  }


  async getItemData(id) {
    const doc = await this.ref.doc(id).get();
    let img = '';
    const imgField = API.product_data_fields.imageURI;
    if (!(imgField in doc.data())) {
      // get imageURI
      // TODO: set authorization as a var
      const response = await fetch(`https://api.pexels.com/v1/search?query=${doc.get('name')}&per_page=1&page=1`, {
        method: 'GET',
        headers: {
          Authorization: pexelsKey,
        },
      });
      const responseJson = await response.json();
      if (responseJson.total_results > 0) {
        img = responseJson.photos[0].src.medium;
      } else {
        // default img
        img = Item.defaults.imageURI;
      }
      // save the imgURI
      const dataToWrite = {};
      dataToWrite[imgField] = img;
      this.ref.doc(id).set(dataToWrite, { merge: true });
    } else {
      // Use the imageURI
      img = doc.data().imageURI;
    }
    // TODO: setup shelf life calculation
    return new Item(doc.get('name'), new Date(), img, doc.get('nutrition'));
  }

  getItemByUPC = async (upc) => {
    const docSnap = await this.branded_data.where('upc', '==', upc).get();
    if (!docSnap.empty) {
      const data = docSnap.docs[0];
      // TODO: Get expiry date
      return new Item(data.get('name'), undefined, undefined, data.get('nutrition'));
    } else {
      return null;
    }
  }


  getRecipesList = (async (settings) => {
    // TODO: Implement settings
    const itemsArray = dataInstance.getItemsArray();
    const MIN_RECIPES = 8;
    // sort array by expiry date
    let ingredients = '';
    itemsArray.sort((a, b) => a.expiryDate - b.expiryDate);
    for (let i = 0; i < itemsArray.length; i++) {
      if (i === 0) {
        ingredients = `${itemsArray[i].name}`;
      } else {
        ingredients = `${ingredients},${itemsArray[i].name}`;
      }
    }

    let pageIndex = 1;
    const recipesList = [];

    while (recipesList.length < MIN_RECIPES) {
      let recipes = [];

      try {
        const response = await fetch(`http://www.recipepuppy.com/api/?i=${ingredients}&p=${pageIndex}`, {
          method: 'GET',
        });
        const responseJson = await response.json();
        recipes = responseJson.results;
      } catch (error) {
        pageIndex += 1;
      }

      let imagesList = [];

      for (let i = 0; i < recipes.length; i++) {
        imagesList.push(this.getImageFromURL(recipes[i].href));
      }

      imagesList = await Promise.all(imagesList);

      for (let i = 0; i < recipes.length; i++) {
        if (imagesList[i] !== -1) {
          recipesList.push(new Recipe(recipes[i].title.replace(/[^a-zA-Z ]/g, ''), recipes[i].href, imagesList[i], recipes[i].ingredients.split(', ')));
        }
      }
      pageIndex += 1;
    }

    // const response = await fetch(`http://www.recipepuppy.com/api/?i=${ingredients}`, {
    //   method: 'GET',
    // });
    // const responseJson = await response.json();
    // const recipes = responseJson.results;
    // const recipesList = [];
    // let imagesList = [];

    // for (let i = 0; i < recipes.length; i++) {
    //   imagesList.push(this.getImageFromURL(recipes[i].href));
    // }

    // imagesList = await Promise.all(imagesList);

    // for (let i = 0; i < recipes.length; i++) {
    //   recipesList.push(new Recipe(recipes[i].title.replace(/[^a-zA-Z ]/g, ''), recipes[i].href, imagesList[i], recipes[i].ingredients.split(', ')));
    // }

    return recipesList;
  });

  getImageFromURL = (async (url) => {
    try {
      const data = await LinkPreview.getPreview(
        url,
        // {
        //   imagesPropertyType: 'og', // fetches only open-graph images
        // },
      );
      if (data.images.length !== 0) {
        const imgSize = await this.getImageSize(data.images[0]);
        if (imgSize.height > 300 || imgSize.width > 300) {
          return data.images[0];
        } else {
          return -1;
        }

        // return data.images[0];
      } else {
        // return 'http://ppc.tools/wp-content/themes/ppctools/img/no-thumbnail.jpg';
        return -1;
      }
    } catch (err) {
      console.log('error');
      return -1;
    }
  });

  getImageSize = uri => new Promise((resolve) => {
    Image.getSize(uri, (width, height) => resolve({ width, height }));
  })

  // TODO: Refactor func to use async
  getProductList(query, numItems = 10, callback) {
    if (query.length > 1) {
      if (query.startsWith(this.previousQuery)) {
        this.ref.where('lower_case_name', '>=', query.toLowerCase()).orderBy('lower_case_name', 'asc')
          .limit(numItems)
          .get({ source: 'cache' })
          .then((snapshot) => {
            if (this.previousQuery !== '~!~') {
              callback(snapshot.docs.slice(0, numItems - 1));
            }
          });
      } else {
        this.ref.where('lower_case_name', '>=', query.toLowerCase()).orderBy('lower_case_name', 'asc')
          .limit(numItems * 3)
          .get()
          .then((snapshot) => {
            if (this.previousQuery !== '~!~') {
              callback(snapshot.docs.slice(0, numItems - 1));
            }
          });
        this.previousQuery = query;
      }
    } else {
      // Return empty array if less than 2 characters
      callback([]);

      // necessary to make sure subsequent async requests do not send data to callback
      this.previousQuery = '~!~';
    }
  }
}

const api = new API();

export default api;
