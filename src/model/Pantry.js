import { ID } from 'model/helper';

export default class Pantry {
  static defaults = {
    name: '',
    imageURI: 'defaultPantry.png',
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
