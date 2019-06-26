/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */

import AsyncStorage from '@react-native-community/async-storage';
import Item from 'model/Item';
import Pantry from 'model/Pantry';

const reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
const reMsAjax = /^\/Date\((d|-|.*)\)[\/|\\]$/;
const noop = () => {}; // do nothing.

class Data {
  constructor() {
    AsyncStorage.removeItem('@instaFreshData');
    AsyncStorage.removeItem('@instaScoreData');
    this._data = {};
    this._instaScoreData = {};
    this.dataListener = [];
    this.itemsArray = [];
    this.itemsObject = {};
  }

  loadData = (async () => {
    try {
      const value = await AsyncStorage.getItem('@instaFreshData');
      if (value !== null) {
        // value previously stored
        const parsedValue = JSON.parse(value, (key, val) => {
        // first, just make sure the property is a string:
          if (typeof val === 'string') {
            // then, use regex to see if it's an ISO-formatted string
            let a = reISO.exec(val);
            if (a) {
              // if so, Date() can parse it:
              return new Date(val);
            }
            // otherwise, see if it's a wacky Microsoft-format string:
            a = reMsAjax.exec(val);
            if (a) {
              // and perform some jujitsu to make use of it:
              const b = a[1].split(/[-+,.]/);
              return new Date(b[0] ? +b[0] : 0 - +b[1]);
            }
            // here, you could insert any additional tests and parse instructions you like, for other date syntaxes...
          }
          // important: you need to return any values you're not parsing, or they die...
          return val;
        });

        const pantries = Object.keys(parsedValue);
        for (let i = 0; i < pantries.length; i++) {
          const itemsObj = {};

          const pantry = parsedValue[pantries[i]];
          const items = Object.keys(pantry.items);

          for (let j = 0; j < items.length; j++) {
            const item = pantry.items[items[j]];
            itemsObj[items[j]] = new Item(item.name, item.expiryDate, item.imageURI, item.nutrition, item.quantity, item.pantryID, item.id);
          }
          pantry.items = itemsObj;
          parsedValue[pantries[i]] = new Pantry(pantry.name, pantry.imageURI, pantry.items, pantry.id);
        }
        this._instaScoreData = JSON.parse(await AsyncStorage.getItem('@instaScoreData'));
        this._data = parsedValue;
        await this._save();
      // eslint-disable-next-line no-else-return
      } else {
        // need to create a default pantry
        // const img = 'https://brain-images-ssl.cdn.dixons.com/9/4/10164049/l_10164049_008.jpg';
        const dat = new Date();


        const img = 'https://images-prod.healthline.com/hlcmsresource/images/topic_centers/Do_Apples_Affect_Diabetes_and_Blood_Sugar_Levels-732x549-thumbnail.jpg';
        const pantry = new Pantry('Fridge', img, {});
        const item = new Item('Apple', dat, img, undefined, '2', pantry.id);
        pantry.items[item.id] = item;

        const startingData = { [pantry.id]: pantry };
        const stringifiedData = JSON.stringify(startingData);

        const instaScoreData = { consumed: 0, wasted: 0 };

        try {
          await AsyncStorage.setItem('@instaFreshData', stringifiedData);
          await AsyncStorage.setItem('@instaScoreData', JSON.stringify(instaScoreData));
          await this.loadData();
        } catch (e) {
          // saving error
          console.log('Error encountered in loadData in Data.js');
        }
      }
    } catch (e) {
      // error reading value
    }
  });

  registerListener(callback) {
    this.dataListener.push(callback);
  }

  unregisterListener(callback) {
    this.dataListener = this.dataListener.filter(subscriber => subscriber !== callback);
  }

  _save = (async () => {
    const saves = [];

    saves.push(this._saveInstaFreshData());
    saves.push(this._saveInstaScore());

    await Promise.all(saves);

    for (let i = 0; i < this.dataListener.length; i++) {
      this.dataListener[i]();
    }
  });

  _saveInstaFreshData = (async () => {
    const dataToSave = JSON.stringify(this._data);
    try {
      await AsyncStorage.setItem('@instaFreshData', dataToSave);
    } catch (e) {
      // saving error
      console.log('Error encountered in _save in Data.js');
    }
  });

  _saveInstaScore = (async () => {
    const instaScoreDataToSave = JSON.stringify(this._instaScoreData);
    try {
      await AsyncStorage.setItem('@instaScoreData', instaScoreDataToSave);
    } catch (error) {
      console.log('Error encountered in _saveInstaScore in Data.js');
    }
  });

  getInstaScore = (() => {
    const { consumed } = this._instaScoreData;
    const { wasted } = this._instaScoreData;

    if (consumed + wasted === 0) {
      return 100;
    } else {
      return Math.round(consumed / (wasted + consumed) * 100);
    }
  });

  addConsumed = ((id, amount) => {
    // TODO: normalize amount
    this._instaScoreData.consumed = this._instaScoreData.consumed + amount;

    const item = this.getItem(id);

    const {
      name,
      expiryDate,
      imageURI,
      nutrition,
      quantity,
      pantryID,
    } = item;

    const editedItem = new Item(name, expiryDate, imageURI, nutrition, quantity - amount, pantryID, id);
    this.editItem(id, editedItem);
  });

  addWasted = ((id, amount) => {
    // TODO: normalize amount
    this._instaScoreData.wasted = this._instaScoreData.wasted + amount;
    const item = this.getItem(id);

    const {
      name,
      expiryDate,
      imageURI,
      nutrition,
      quantity,
      pantryID,
    } = item;

    const editedItem = new Item(name, expiryDate, imageURI, nutrition, quantity - amount, pantryID, id);
    this.editItem(id, editedItem);
  });

  resetInstaScore = (() => {
    this._instaScoreData = { consumed: 0, wasted: 0 };
  });

  addPantry = ((pantry) => {
    this._data[pantry.id] = pantry;
    this._save();
  });

  deletePantry = ((id) => {
    delete this._data[id];
    this._save();
  });

  editPantry = ((pantryID, pantryData) => {
    this._data[pantryID].name = pantryData.name;
    this._data[pantryID].imageURI = pantryData.imageURI;
    this._save();
  });

  addItem = ((item) => {
    this._data[item.pantryID].items[item.id] = item;
    this._save();
  });

  deleteItem = ((itemID) => {
    const { pantryID } = this.getItem(itemID);
    delete this._data[pantryID].items[itemID];
    this._save();
  });

  editItem = ((itemID, itemData) => {
    const { pantryID } = this.getItem(itemID);
    this._data[pantryID].items[itemID] = itemData;
    this._save();
  });

  getPantriesArray = (() => {
    const returnItem = Object.values(this._data);

    return returnItem;
  });

  getPantry = (pantryID => this._data[pantryID])

  getItem = ((itemID) => {
    const items = this.getItemsObject();
    return items[itemID];
  });

  getItemsObject = (() => {
    let itemsObject = {};
    const keys = Object.keys(this._data);

    for (const key of keys) {
      const { items } = this._data[key];
      itemsObject = { ...itemsObject, ...items };
    }

    return itemsObject;
  });

  getItemsArray = (() => {
    let itemsArray = [];
    const itemsObject = this.getItemsObject();

    const itemKeys = Object.keys(itemsObject);
    for (const itemKey of itemKeys) {
      itemsArray = itemsArray.concat(itemsObject[itemKey]);
    }

    return itemsArray;
  });
}

const dataInstance = new Data();

export default dataInstance;
