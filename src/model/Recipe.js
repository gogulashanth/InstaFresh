
export default class Recipe {
  constructor(name = '', recipeURL = '', imageURI = '', ingredients = []) {
    this.name = name;
    this.recipeURL = recipeURL;
    this.imageURI = imageURI;
    this.ingredients = ingredients;
  }
}
