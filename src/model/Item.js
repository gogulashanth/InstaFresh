/* eslint-disable no-underscore-dangle */
import { ID } from 'model/helper';

export default class Item {
  constructor(name,
    expiryDate,
    imageURI,
    nutrition,
    quantity,
    pantryID,
    id = ID()) {
    // Custom constructor for initializing from a plain object
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
