import firebase from 'react-native-firebase';
import Item from 'model/Item';
import dataInstance from 'model/Data';
import Recipe from 'model/Recipe';
import LinkPreview from 'react-native-link-preview';
import { Image } from 'react-native';

class API {
  static productDataFields = {
    imageURI: 'imageURI',
    name: 'name',
    lower_case_name: 'lower_case_name',
    nutrition: 'nutrition',
  }

  constructor() {
    this.ref = firebase.firestore().collection('product_data_simplified');
    this.branded_data = firebase.firestore().collection('branded_product_data');
    this.user_data = firebase.firestore().collection('user_product_data');
    this.previousQuery = '~!~';
    this._loadingProductList = false;

    firebase.firestore().collection('admin').doc('api_keys').get()
      .then((snapshot) => {
        this.apiKeys = snapshot.data();
      });
  }


  async getItemData(id) {
    const doc = await this.ref.doc(id).get();
    let img = '';
    const imgField = API.productDataFields.imageURI;
    if (!(imgField in doc.data())) {
      // get imageURI
      // TODO: set authorization as a var
      const response = await fetch(`https://api.pexels.com/v1/search?query=${doc.get('name')}&per_page=1&page=1`, {
        method: 'GET',
        headers: {
          Authorization: this.apiKeys.pexels,
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
    const brandedData = await this.getDataFromBrandedDB(upc);
    if (brandedData !== null) {
      return new Item(
        brandedData.get('name'),
        undefined,
        undefined,
        brandedData.get('nutrition'),
        undefined,
        undefined,
        undefined,
        upc,
      );
    } else {
      const data = await this.getDataFromUserDB(upc);
      if (data !== null) {
        // const customDate = new Date();
        const shelfLife = data.get('shelf_life');
        const todayDate = new Date();
        todayDate.setDate(todayDate.getDate() + Math.round(shelfLife));

        return new Item(
          data.get('name'),
          todayDate,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          upc,
        );
      }
    }

    return new Item(undefined, undefined, undefined, undefined, undefined, undefined, undefined, upc);
  }

  getDataFromUserDB = async (upc) => {
    const userDataDoc = await this.user_data.doc(upc).get();
    if (userDataDoc.exists) {
      return userDataDoc;
    } else {
      return null;
    }
  }

  getDataFromBrandedDB = async (upc) => {
    const docSnap = await this.branded_data.where('upc', '==', upc).get();
    if (!docSnap.empty) {
      const data = docSnap.docs[0];
      return data;
    } else {
      return null;
    }
  }

  calculateOptimumShelfLife = (prevShelfLife, newShelfLife, numShelfLife) => {
    if (Math.abs(prevShelfLife - newShelfLife) > 10 && numShelfLife > 5) {
      // ignore new shelf life (possibly a mistake)
      return prevShelfLife;
    } else {
      // return accumulative average
      return ((numShelfLife - 1) * prevShelfLife + newShelfLife) / numShelfLife;
    }
  }

  // updates user item db. If not, adds it to db
  saveToUserItemDB = async (item) => {
    const itemInDB = await this.getDataFromUserDB(item.upc);
    if (itemInDB !== null) {
      // need to update shelf life
      const shelfLife = this.calculateOptimumShelfLife(
        itemInDB.get('shelf_life'),
        item.getNumDaysLeft(),
        itemInDB.get('num_shelf_life'),
      );

      await this.updateUserItemDB(item.upc, {
        shelf_life: shelfLife,
        num_shelf_life: itemInDB.get('num_shelf_life') + 1,
        name: item.name,
      });
    } else {
      // need to add to db
      const shelfLife = (item.expiryDate.getTime() - (new Date()).getTime()) / (1000 * 60 * 60 * 24);
      
      await this.addToUserItemDB(item.upc, {
        name: item.name,
        shelf_life: shelfLife,
        num_shelf_life: 1,
      });
    }
  }

  updateUserItemDB = async (upc, data) => {
    await this.user_data.doc(upc).set(
      data,
      { merge: true },
    );
  }

  addToUserItemDB = async (upc, data) => {
    await this.user_data.doc(upc).set(data);
  }


  _getRecipesListFromRecipePuppy = (async (ingredientsArray) => {
    const MIN_RECIPES = 8;

    let pageIndex = 1;
    const recipesList = [];

    let ingredients = '';

    for (let i = 0; i < ingredientsArray.length; i++) {
      if (i === 0) {
        ingredients = `${ingredientsArray[i]}`;
      } else {
        ingredients = `${ingredients},${ingredientsArray[i]}`;
      }
    }

    while (recipesList.length <= MIN_RECIPES) {
      if (pageIndex >= 5) {
        break;
      }

      let recipes = [];
      console.log('Fetching data');

      try {
        const response = await fetch(`http://www.recipepuppy.com/api/?i=${ingredients}&p=${pageIndex}`, {
          method: 'GET',
        });
        const responseJson = await response.json();
        recipes = responseJson.results;
      } catch (error) {
        pageIndex += 1;
        continue;
      }

      let imagesList = [];

      for (let i = 0; i < recipes.length; i++) {
        imagesList.push(this._promiseTimeout(2000, this.getImageFromURL(recipes[i].href)));
      }
      imagesList = await Promise.all(imagesList);

      for (let i = 0; i < recipes.length; i++) {
        if (imagesList[i] !== -1) {
          recipesList.push(new Recipe(recipes[i].title.replace(/[^a-zA-Z ]/g, ''), recipes[i].href, imagesList[i], recipes[i].ingredients.split(', ')));
        }
      }

      pageIndex += 1;
    }
    return recipesList;
  });

  _getRecipesListFromEdamam = (async (ingredients) => {
    let recipes = [];
    const randomNum = Math.round(Math.random() * (ingredients.length - 1));
    const randomIng = ingredients[randomNum];

    try {
      const response = await fetch(`https://api.edamam.com/search?q=${randomIng}&to=10&app_id=${this.apiKeys.edamam.app_id}&app_key=${this.apiKeys.edamam.app_key}`, {
        method: 'GET',
      });
      const responseJson = await response.json();
      recipes = responseJson.hits;
    } catch (error) {
      console.log(error);
      return [];
    }

    const recipesList = [];
    for (let i = 0; i < recipes.length; i++) {
      const ing = recipes[i].recipe.ingredients.map(item => item.text);

      recipesList.push(
        new Recipe(recipes[i].recipe.label.replace(/[^a-zA-Z ]/g, ''),
          recipes[i].recipe.url,
          recipes[i].recipe.image,
          ing,
          recipes[i].recipe.calories,
          recipes[i].recipe.healthLabels),
      );
    }

    return recipesList;
  });


  getRecipesList = (async (settings) => {
    // TODO: Implement settings
    const itemsArray = dataInstance.getItemsArray();
    const ingredientsArray = [];

    // sort array by expiry date
    itemsArray.sort((a, b) => a.expiryDate - b.expiryDate);

    for (let i = 0; i < itemsArray.length; i++) {
      ingredientsArray.push(itemsArray[i].name);
    }

    return this._getRecipesListFromEdamam(ingredientsArray);
  });

  _promiseTimeout = ((ms, promise) => {
    // Create a promise that rejects in <ms> milliseconds
    const timeout = new Promise((resolve, reject) => {
      const id = setTimeout(() => {
        clearTimeout(id);
        resolve(-1);
      }, ms);
    });

    // Returns a race between our timeout and the passed in promise
    return Promise.race([
      promise,
      timeout,
    ]);
  });

  getImageFromURL = (async (url) => {
    try {
      const data = await LinkPreview.getPreview(url);

      if (data.images.length !== 0) {
        const imgSize = await this.getImageSize(data.images[0]);
        if (imgSize.height > 300 || imgSize.width > 300) {
          return data.images[0];
        } else {
          // return 'http://ppc.tools/wp-content/themes/ppctools/img/no-thumbnail.jpg';
          return -1;
        }
      } else {
        // return 'http://ppc.tools/wp-content/themes/ppctools/img/no-thumbnail.jpg';
        return -1;
      }
    } catch (err) {
      // Probably network request failure
      console.log(err);
      return -1;
    }
  });

  getImageSize = uri => new Promise((resolve) => {
    Image.getSize(uri, (width, height) => resolve({ width, height }));
  })

  async getProductList(query, numItems = 10) {
    if (query.length > 1) {
      const samePrefix = query.startsWith(this.previousQuery);

      let sourceOptions = {};
      // Use local cache if query starts with same prefix
      if (samePrefix) {
        sourceOptions = { source: 'cache' };
      }

      if (!samePrefix) {
        this.previousQuery = query;
      }

      const snapshot = await this.ref.where('lower_case_name', '>=', query.toLowerCase().trim()).orderBy('lower_case_name', 'asc')
        .limit(numItems)
        .get(sourceOptions);

      if (this.previousQuery !== '~!~') {
        return snapshot.docs.slice(0, numItems - 1);
      }
    } else {
      // necessary to make sure subsequent async requests do not send data to callback
      this.previousQuery = '~!~';
    }

    // Return empty array if less than 2 characters
    return [];
  }
}

const api = new API();

export default api;
