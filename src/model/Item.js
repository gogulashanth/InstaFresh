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

    // this._id = ID();
    // this._name = name;
    // this._expiryDate = expiryDate;
    // this._imageURI = imageURI;
    // this._nutrition = nutrition;
    // this._quantity = quantity;
    // this._pantry = pantry;
  }

  // ID = (() => `_${Math.random().toString(36).substr(2, 9)}`);

  // get id() {
  //   return this._id;
  // }

  // get name() {
  //   return this._name;
  // }

  // get expiryDate() {
  //   return this._expiryDate;
  // }

  // get imageURI() {
  //   return this._imageURI;
  // }

  // get nutrition() {
  //   return this._nutrition;
  // }

  // get quantity() {
  //   return this._quantity;
  // }

  // get pantry() {
  //   return this._pantry;
  // }

  // set name(newName) {
  //   this._name = newName;
  // }

  // set expiryDate(newExpiryDate) {
  //   this._expiryDate = newExpiryDate;
  // }

  // set image(newImage) {
  //   this._image = newImage;
  // }

  // set nutrition(newNutrition) {
  //   this._nutrition = newNutrition;
  // }

  // set quantity(newQuantity) {
  //   this._quantity = newQuantity;
  // }

  // set pantry(newPantry) {
  //   this._pantry = newPantry;
  // }
}
