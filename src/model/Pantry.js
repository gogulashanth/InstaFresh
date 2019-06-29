import { ID } from 'model/helper';
import defaultPantry from 'res/images/defaultPantry.json';

export default class Pantry {
  static defaults = {
    name: '',
    imageURI: defaultPantry.imageString,
    items: {},
    id: '',
  }

  constructor(name = Pantry.defaults.name,
    imageURI = Pantry.defaults.imageURI,
    items = Pantry.defaults.items,
    id = ID()) {
    this.type = 'pantry';
    this.name = name;
    this.id = id;
    this.imageURI = imageURI;
    this.items = items;
  }
}
