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
    this._data = {};
    this.dataListener = noop;
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

        this._data = parsedValue;
      // eslint-disable-next-line no-else-return
      } else {
        // need to create a default pantry
        // const img = 'https://brain-images-ssl.cdn.dixons.com/9/4/10164049/l_10164049_008.jpg';
        const dat = new Date();


        const img = 'https://brain-images-ssl.cdn.dixons.com/9/4/10164049/l_10164049_008.jpg';
        const pantry = new Pantry('Fridge', img, {});
        pantry.addItem(new Item('Apple', dat, img, 'na', 2, pantry.id));

        const startingData = { [pantry.id]: pantry };

        const stringifiedData = JSON.stringify(startingData);

        try {
          await AsyncStorage.setItem('@instaFreshData', stringifiedData);
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
    this.dataListener = callback;
  }

  _save = (async () => {
    this.dataListener();
    const dataToSave = JSON.stringify(this._data);
    try {
      await AsyncStorage.setItem('@instaFreshData', dataToSave);
    } catch (e) {
      // saving error
      console.log('Error encountered in _save in Data.js');
    }
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
    this._data[pantryID] = pantryData;
    this._save();
  });

  addItem = ((item, pantryID) => {
    this._data[pantryID].addItem(item);
    this._save();
  });

  deleteItem = ((itemID, pantryID) => {
    this._data[pantryID].deleteItem(itemID);
    this._save();
  });

  editItem = ((itemID, pantryID, itemData) => {
    this._data[pantryID].editItem(itemID, itemData);
    this._save();
  });

  getPantriesArray = (() => {
    const returnItem = Object.values(this._data);

    return returnItem;
  });

  getItemsArray = (() => {
    let returnItem = [];
    const keys = Object.keys(this._data);

    for (const key of keys) {
      const { items } = this._data[key];

      const itemKeys = Object.keys(items);
      for (const itemKey of itemKeys) {
        returnItem = returnItem.concat(items[itemKey]);
      }
    }

    return returnItem;
  });
}

const dataInstance = new Data();

export default dataInstance;
