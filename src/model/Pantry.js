import { ID } from 'model/helper';

export default class Pantry {
  constructor(name, imageURI, items, id = ID()) {
    this.type = 'pantry';
    this.name = name;
    this.id = id;
    this.imageURI = imageURI;
    this.items = items;
  }
}
