/* eslint-disable no-underscore-dangle */
import { ID } from 'model/helper';

export default class Item {
  static defaults = {
    name: '',
    imageURI: 'defaultItem.png',
    nutrition: '',
    quantity: 0,
    pantryID: '',
    upc: '',
  }

  constructor(
    name = '',
    expiryDate = new Date(),
    imageURI = Item.defaults.imageURI,
    nutrition = Item.defaults.nutrition,
    quantity = Item.defaults.quantity,
    pantryID = Item.defaults.pantryID,
    id = ID(),
    upc = Item.defaults.upc,
  ) {
    this.id = id;
    this.type = 'item';
    this.name = name;
    this.expiryDate = expiryDate;
    this.imageURI = imageURI;
    this.nutrition = nutrition;
    this.quantity = Math.round(Number(quantity) * 100) / 100;
    this.pantryID = pantryID;
    this.upc = upc;
  }

  getNumDaysLeft = (() => {
    const currentDate = new Date();
    return Math.round((this.expiryDate - currentDate) / (1000 * 60 * 60 * 24));
  });

  getCopy = (() => new Item(
    this.name,
    this.expiryDate,
    this.imageURI,
    this.nutrition,
    this.quantity,
    this.pantryID,
    this.id,
    this.upc,
  ));

  static getExpiryDateFromShelfLife = ((shelfLife) => {
    const todayDate = new Date();
    if (typeof shelfLife === 'number') {
      todayDate.setDate(todayDate.getDate() + Math.round(shelfLife));
    }
    return todayDate;
  });
}
