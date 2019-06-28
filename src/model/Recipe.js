import dataInstance from 'model/Data';

export default class Recipe {
  constructor(name = '', recipeURL = '', imageURI = '', ingredients = [], calories = '', healthLabels = []) {
    this.name = name;
    this.recipeURL = recipeURL;
    this.imageURI = imageURI;
    this.ingredients = ingredients;
    this.calories = typeof (calories) === 'number' ? Math.round(calories) : calories;
    this.healthLabels = healthLabels;
  }

  getNumCommonIngredients = (() => {
    const pantryItems = dataInstance.getLowerCaseItemsNameArray();
    let matches = 0;
    for (let i = 0; i < this.ingredients.length; i++) {
      if (pantryItems.indexOf(this.ingredients[i].toLowerCase()) !== -1) {
        matches += 1;
      }
    }
    return matches;
  });
}
