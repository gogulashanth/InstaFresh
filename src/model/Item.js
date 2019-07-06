/* eslint-disable no-underscore-dangle */
import { ID } from 'model/helper';
import defaultItem from 'res/images/default_item.json';

export default class Item {
  static defaults = {
    name: '',
    imageURI: defaultItem.imageString,
    nutrition: '',
    quantity: 0,
    pantryID: '',
  }

  constructor(name = '',
    expiryDate = new Date(),
    imageURI = Item.defaults.imageURI,
    nutrition = Item.defaults.nutrition,
    quantity = Item.defaults.quantity,
    pantryID = Item.defaults.pantryID,
    id = ID()) {
    this.id = id;
    this.type = 'item';
    this.name = name;
    this.expiryDate = expiryDate;
    this.imageURI = imageURI;
    this.nutrition = nutrition;
    this.quantity = quantity;
    this.pantryID = pantryID;
  }

  getNumDaysLeft = (() => {
    const currentDate = new Date();
    return Math.round((this.expiryDate - currentDate) / (1000 * 60 * 60 * 24));
  });
}
