import Item from 'model/Item';
import { ID } from 'model/helper';

export default class Pantry {
  constructor(name, imageURI, items, id = ID()) {
    // this._name = name;
    // this._id = ID();
    // this._imageURI = imageURI;
    // this._items = {};
    this.type = 'pantry';
    this.name = name;
    this.id = id;
    this.imageURI = imageURI;
    this.items = items;
  }

  addItem(newItem) {
    this.items[newItem.id] = newItem;
  }

  deleteItem(id) {
    delete this.items[id];
  }

  deleteAllItems() {
    const keys = Object.keys(this.items);
    keys.forEach((key) => {
      delete this.items[key];
    });
  }

  editItem(id, item) {
    this.items[id] = item;
  }

  // get id() {
  //   return this._id;
  // }

  // get name() {
  //   return this._name;
  // }

  // set name(newName) {
  //   this._name = newName;
  // }

  // get imageURI() {
  //   return this._imageURI;
  // }

  // set imageURI(newImageURI) {
  //   this._imageURI = newImageURI;
  // }

  // get items() {
  //   return this._items;
  // }
}
