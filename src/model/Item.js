/* eslint-disable no-underscore-dangle */
import { ID } from 'model/helper';

export default class Item {
  static defaults = {
    name: '',
    imageURI: 'https://cnet4.cbsistatic.com/img/Gu0ly_clVsc-EHnRAea7i0GUhRI=/1600x900/2019/03/14/2609b0eb-1263-43e2-9380-c1f8cbced873/gettyimages-1089101352.jpg',
    nutrition: '',
    quantity: '',
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
}
