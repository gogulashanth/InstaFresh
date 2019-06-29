/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */

import AsyncStorage from '@react-native-community/async-storage';
import Item from 'model/Item';
import Pantry from 'model/Pantry';

const reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
const reMsAjax = /^\/Date\((d|-|.*)\)[\/|\\]$/;
const noop = () => {}; // do nothing.

// TODO: Future update: editable settings

// Duration for instascore history to persist (current: 30 days)
const INSTASCORE_MAX_PERSIST = 30 * 24 * 3600;

// Duration to store avg instascore (current: every week)
// const INSTASCORE_SAMPLING_FREQ = 7 * 24 * 3600;

// debug
const INSTASCORE_SAMPLING_FREQ = 2;

class Data {
  constructor() {
    //AsyncStorage.removeItem('@instaFreshData');
    //AsyncStorage.removeItem('@instaScoreData');

    this._data = {};

    this._instaScoreData = {};

    this.dataListener = [];
    this.itemsArray = [];
    this.itemsObject = {};
    this._helpData = [
      { id: 1, title: 'Can I sync?', content: { text: 'Not yet, but don’t worry, future updates will definitely incorporate syncing with your other devices.', video: '' } },
      { id: 2, title: 'What is InstaScore?', content: { text: 'InstaScore basically tells you how much you’ve consumed out of how much you initially had. So a score of 80 means you’ve consumed 80% of all the food you owned.', video: '' } },
      { id: 3, title: 'My barcode scanner is showing a different best before date from the best before date given in product. Why?', content: { text: 'First off we’re sorry for the inconvenience that it caused you. This, could be for two reasons: 1.The best before date displayed could be from InstaFresh’s existing database which could essentially skew the best before date. 2.Another reason could be due to positioning of the camera or not waiting until capture the barcode.*', video: '' } },
      { id: 4, title: 'How to give suggestions/ feature requests?', content: { text: 'You can always message us through our Facebook page (InstaFresh App) or even post a comment on App Store with your desired requests. Hopefully we will be able to account for those in the future updates.', video: '' } },
      { id: 5, title: 'How is InstaFresh different from other food waste apps?', content: { text: 'User satisfaction is key to us. We have built this app due to the fact that we haven’t come across any user friendly, easy to use app that has no hidden costs AND that doesn’t get stuck. We believe InstaFresh will help users track their food waste through the InstaScore platform and make sure you keep increasing your score. But hey look out for future updates!!', video: '' } },
      { id: 6, title: 'How do I add an item', content: { text: 'There are three ways you can add an item in the pantries; press the ‘+’ sign on the top right corner which will display a drop down menu. Then, select the preferred method of input. In manual add, you have to enter the item name and expiry date manually and a . If you wish to use barcode scan, just point the camera towards the barcode on the product and if its available in the database, it’ll automatically display the best before date and the name of the product. The auto scan also works in a similar way however you’ll need to take a picture of the item and let the app do its magic (only limited items will be recognized)!', video: '' } },
      { id: 7, title: '*Disclaimer', content: { text: 'InstaFresh is NOT responsible for the best before date it displays. Please make sure you double check the best before date before you click save. Therefore, what you enter is what we show.', video: '' } },
    ];
    this._dailyValues = {
      204: { value: 65, unit: 'g' },
      605: { value: 20, unit: 'g' },
      606: { value: 20, unit: 'g' },
      601: { value: 300, unit: 'mg' },
      307: { value: 2400, unit: 'mg' },
      205: { value: 300, unit: 'g' },
      291: { value: 25, unit: 'g' },
      401: { value: 60, unit: 'mg' },
      301: { value: 1100, unit: 'mg' },
      303: { value: 14, unit: 'mg' },
    };

    this._nutritionKey = {
      203: { unit: 'g', name: 'Protein' },
      204: { unit: 'g', name: 'Total lipid (fat)' },
      205: { unit: 'g', name: 'Carbohydrate, by difference' },
      207: { unit: 'g', name: 'Ash' },
      208: { unit: 'kcal', name: 'Energy' },
      209: { unit: 'g', name: 'Starch' },
      210: { unit: 'g', name: 'Sucrose' },
      211: { unit: 'g', name: 'Glucose (dextrose)' },
      212: { unit: 'g', name: 'Fructose' },
      213: { unit: 'g', name: 'Lactose' },
      214: { unit: 'g', name: 'Maltose' },
      221: { unit: 'g', name: 'Alcohol, ethyl' },
      255: { unit: 'g', name: 'Water' },
      262: { unit: 'mg', name: 'Caffeine' },
      263: { unit: 'mg', name: 'Theobromine' },
      268: { unit: 'kJ', name: 'Energy' },
      269: { unit: 'g', name: 'Sugars, total' },
      287: { unit: 'g', name: 'Galactose' },
      291: { unit: 'g', name: 'Fiber, total dietary' },
      301: { unit: 'mg', name: 'Calcium, Ca' },
      303: { unit: 'mg', name: 'Iron, Fe' },
      304: { unit: 'mg', name: 'Magnesium, Mg' },
      305: { unit: 'mg', name: 'Phosphorus, P' },
      306: { unit: 'mg', name: 'Potassium, K' },
      307: { unit: 'mg', name: 'Sodium, Na' },
      309: { unit: 'mg', name: 'Zinc, Zn' },
      312: { unit: 'mg', name: 'Copper, Cu' },
      313: { unit: 'g', name: 'Fluoride, F' },
      315: { unit: 'mg', name: 'Manganese, Mn' },
      317: { unit: 'g', name: 'Selenium, Se' },
      318: { unit: 'IU', name: 'Vitamin A, IU' },
      319: { unit: 'g', name: 'Retinol' },
      320: { unit: 'g', name: 'Vitamin A, RAE' },
      321: { unit: 'g', name: 'Carotene, beta' },
      322: { unit: 'g', name: 'Carotene, alpha' },
      323: { unit: 'mg', name: 'Vitamin E (alpha-tocopherol)' },
      324: { unit: 'IU', name: 'Vitamin D' },
      325: { unit: 'g', name: 'Vitamin D2 (ergocalciferol)' },
      326: { unit: 'g', name: 'Vitamin D3 (cholecalciferol)' },
      328: { unit: 'g', name: 'Vitamin D (D2 + D3)' },
      334: { unit: 'g', name: 'Cryptoxanthin, beta' },
      337: { unit: 'g', name: 'Lycopene' },
      338: { unit: 'g', name: 'Lutein + zeaxanthin' },
      341: { unit: 'mg', name: 'Tocopherol, beta' },
      342: { unit: 'mg', name: 'Tocopherol, gamma' },
      343: { unit: 'mg', name: 'Tocopherol, delta' },
      344: { unit: 'mg', name: 'Tocotrienol, alpha' },
      345: { unit: 'mg', name: 'Tocotrienol, beta' },
      346: { unit: 'mg', name: 'Tocotrienol, gamma' },
      347: { unit: 'mg', name: 'Tocotrienol, delta' },
      401: { unit: 'mg', name: 'Vitamin C, total ascorbic acid' },
      404: { unit: 'mg', name: 'Thiamin' },
      405: { unit: 'mg', name: 'Riboflavin' },
      406: { unit: 'mg', name: 'Niacin' },
      410: { unit: 'mg', name: 'Pantothenic acid' },
      415: { unit: 'mg', name: 'Vitamin B-6' },
      417: { unit: 'g', name: 'Folate, total' },
      418: { unit: 'g', name: 'Vitamin B-12' },
      421: { unit: 'mg', name: 'Choline, total' },
      428: { unit: 'g', name: 'Menaquinone-4' },
      429: { unit: 'g', name: 'Dihydrophylloquinone' },
      430: { unit: 'g', name: 'Vitamin K (phylloquinone)' },
      431: { unit: 'g', name: 'Folic acid' },
      432: { unit: 'g', name: 'Folate, food' },
      435: { unit: 'g', name: 'Folate, DFE' },
      454: { unit: 'mg', name: 'Betaine' },
      501: { unit: 'g', name: 'Tryptophan' },
      502: { unit: 'g', name: 'Threonine' },
      503: { unit: 'g', name: 'Isoleucine' },
      504: { unit: 'g', name: 'Leucine' },
      505: { unit: 'g', name: 'Lysine' },
      506: { unit: 'g', name: 'Methionine' },
      507: { unit: 'g', name: 'Cystine' },
      508: { unit: 'g', name: 'Phenylalanine' },
      509: { unit: 'g', name: 'Tyrosine' },
      510: { unit: 'g', name: 'Valine' },
      511: { unit: 'g', name: 'Arginine' },
      512: { unit: 'g', name: 'Histidine' },
      513: { unit: 'g', name: 'Alanine' },
      514: { unit: 'g', name: 'Aspartic acid' },
      515: { unit: 'g', name: 'Glutamic acid' },
      516: { unit: 'g', name: 'Glycine' },
      517: { unit: 'g', name: 'Proline' },
      518: { unit: 'g', name: 'Serine' },
      521: { unit: 'g', name: 'Hydroxyproline' },
      573: { unit: 'mg', name: 'Vitamin E, added' },
      578: { unit: 'g', name: 'Vitamin B-12, added' },
      601: { unit: 'mg', name: 'Cholesterol' },
      605: { unit: 'g', name: 'Fatty acids, total trans' },
      606: { unit: 'g', name: 'Fatty acids, total saturated' },
    };
  }

  // MARK: PRODUCT DATA METHODS---------------------------------------------------

  loadData = (async () => {
    try {
      const [value, instaScoreData] = await Promise.all([AsyncStorage.getItem('@instaFreshData'), AsyncStorage.getItem('@instaScoreData')]);

      if (value !== null && instaScoreData !== null) {
        // InstaFreshData parsing ---------------------------

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

        // InstaScore data parsing----------------

        this._instaScoreData = JSON.parse(instaScoreData, (key, val) => {
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
          }
          // important: you need to return any values you're not parsing, or they die...
          return val;
        });

        // Save data to disk after loading
        this._save();
      // eslint-disable-next-line no-else-return
      } else {
        // need to create a default pantry
        const dat = new Date();

        const img = 'https://images-prod.healthline.com/hlcmsresource/images/topic_centers/Do_Apples_Affect_Diabetes_and_Blood_Sugar_Levels-732x549-thumbnail.jpg';
        const pantry = new Pantry('Fridge');
        //const item = new Item('Apple', dat, img, undefined, 2, pantry.id);
        //pantry.items[item.id] = item;

        const startingData = { [pantry.id]: pantry };
        const stringifiedData = JSON.stringify(startingData);

        const initialInstaScoreData = { consumed: 0, wasted: 0, history: [{ time: new Date(), average: 100, numItems: 1 }] };

        try {
          await AsyncStorage.setItem('@instaFreshData', stringifiedData);
          await AsyncStorage.setItem('@instaScoreData', JSON.stringify(initialInstaScoreData));
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
    this.itemsUpdated = true;
  });

  deleteItem = ((itemID) => {
    const { pantryID } = this.getItem(itemID);
    delete this._data[pantryID].items[itemID];
    this._save();
    this.itemsUpdated = true;
  });

  editItem = ((itemID, itemData) => {
    const { pantryID } = this.getItem(itemID);
    this._data[pantryID].items[itemID] = itemData;
    this._save();
    this.itemsUpdated = true;
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

  getLowerCaseItemsNameArray = (() => {
    let itemsArray = this.getItemsArray();
    const itemNameArray = [];

    for (const item of itemsArray) {
      itemNameArray.push(item.name.toLowerCase());
    }

    return itemNameArray;
  });

  // MARK: GENERAL-------------------------------------------
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

  // NUTRITION-------------------------------------------

  getDailyValue(key) {
    return this._dailyValues[key].value;
  }

  getNutritionName(key) {
    return this._nutritionKey[key].name;
  }

  getNutritionUnit(key) {
    return this._nutritionKey[key].unit;
  }

  // HELP------------------------------------------------------

  getHelpData = (() => this._helpData);

  // INSTASCORE-----------------------------------------------

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

    this.instaScoreChanged(this.getInstaScore());
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

    this.instaScoreChanged(this.getInstaScore());
  });

  resetInstaScore = (() => {
    this._instaScoreData = { consumed: 0, wasted: 0, history: [{ time: new Date(), average: 100, numItems: 1 }] };
  });

  instaScoreChanged = ((newScore) => {
    const { history } = this._instaScoreData;
    const num = history.length;
    const latestDate = history[num - 1].time;
    // history data structure:
    // history = [{time:..., average:..., numItems:...}]
    if (num === 0) {
      // need to create a new record
      this._addNewInstaScoreHistory(newScore);
    } else if (latestDate.setTime(latestDate.getTime() + INSTASCORE_SAMPLING_FREQ * 1000) < new Date()) {
      // need to create a new time record
      this._addNewInstaScoreHistory(newScore);
    } else {
      // need to update the average
      const avg = this._instaScoreData.history[num - 1].average;
      const totalAvgItems = this._instaScoreData.history[num - 1].numItems;
      this._instaScoreData.history[num - 1].average = (avg + newScore / totalAvgItems) * totalAvgItems / (totalAvgItems + 1);
      this._instaScoreData.history[num - 1].numItems = totalAvgItems + 1;
    }

    this._saveInstaScore();
  });

  _emptyInstaScoreRecord = ((newScore = 0) => (
    { time: new Date(), average: newScore, numItems: 1 }
  ));

  _addNewInstaScoreHistory = ((newScore) => {
    const newRecord = this._emptyInstaScoreRecord(newScore);
    this._instaScoreData.history.push(newRecord);
    // cleanup history: remove data that's longer than MAX
    this._instaScoreData.history = this._cleanupHistory(this._instaScoreData.history);
  });

  _cleanupHistory = ((history) => {
    const num = history.length;
    if (num > 1) {
      if (history[num - 1].time.getTime() - history[0].time.getTime() > INSTASCORE_MAX_PERSIST * 1000) {
        // need to remove the first one
        return this._cleanupHistory(history.shift());
      } else {
        return history;
      }
    } else {
      return history;
    }
  });

  getWeeklyInstaScoreTrend = ((maxFreq = 3) => {
    const { history } = this._instaScoreData;
    let result = [];
    const newRecord = this._emptyInstaScoreRecord(this.getInstaScore());
    result.push(newRecord);

    for (let i = history.length - 1; i > 0; i--) {
      result = this._fillInDate(result, history[i].time, INSTASCORE_SAMPLING_FREQ, maxFreq);
      result.push(history[i]);
      if (result.length >= maxFreq) {
        break;
      }
    }

    return result;
  });

  _fillInDate = ((result, date, span, maxNum) => {
    const num = result.length;
    if (num < 1) {
      return result;
    }

    if (num >= maxNum) {
      return result;
    }

    if (result[num - 1].time.getTime() - date.getTime() > 2 * span * 1000) {
      const copyResult = this._emptyInstaScoreRecord(result[num - 1].average);
      copyResult.time.setTime(result[num - 1].time.getTime() - 2 * span * 1000);
      result.push(copyResult);
      return this._fillInDate(result, date, span, maxNum);
    }

    return result;
  });
}

const dataInstance = new Data();

export default dataInstance;
