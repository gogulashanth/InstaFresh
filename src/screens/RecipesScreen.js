import React from 'react';
import {
  Image, View, FlatList,
} from 'react-native';
import colors from 'res/colors';
import RecipeListItem from 'library/components/RecipeListItem';
import Item from 'model/Item';
import { MenuButton } from 'library/components/HeaderItems';
import api from 'model/API';

export default class RecipesScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Recipes',
    headerLeft: <MenuButton onPress={navigation.getParam('handleMenuButtonClick')} />,
  });

  constructor(props) {
    super(props);
    this.state = { data: [] };
  }

  componentWillMount() {
    const { navigation } = this.props;
    navigation.setParams({
      handleMenuButtonClick: this.handleMenuButtonClick,
    });

    this.subs = [navigation.addListener('willFocus', this.screenWillFocus)];

    api.getRecipesList().then((recipeList) => {
      this.setState({ data: recipeList });
    });
  }

  componentWillUnmount() {
    this.subs.forEach(sub => sub.remove());
  }

  screenWillFocus = (() => {
    api.getRecipesList().then((recipeList) => {
      this.setState({ data: recipeList });
    });
  });

  handleMenuButtonClick = (() => {
    const { navigation } = this.props;
    navigation.toggleDrawer();
  });

  handleRecipeClick = ((recipeItem) => {
    const { navigation } = this.props;
    navigation.push('RecipeDetail', { recipeItem });
  });

  renderItem = ((recipeItem) => {
    const recipe = recipeItem.item;
    return (
      <RecipeListItem
        imageURI={recipe.imageURI}
        title={recipe.name}
        subtitle="300 calories per serving"
        subsubtitle="vegetarian-friendly"
        onPress={() => this.handleRecipeClick(recipe)}
        containerStyle={{ margin: 15 }}
      />
    );
  });

  render() {
    const { data } = this.state;
    return (
      <View style={{
        flex: 1, backgroundColor: colors.darkerLogoBack, flexDirection: 'column', paddingTop: 30,
      }}
      >
        <FlatList
          columnWrapperStyle={{ alignItems: 'center', justifyContent: 'space-between' }}
          numColumns={2}
          data={data}
          keyExtractor={(item, i) => i}
          renderItem={this.renderItem}
          ListEmptyComponent={this._listEmptyComponent}
        />
        <Image
          resizeMode="contain"
          source={require('res/images/edamam_logo.png')}
          style={{
            width: 100, height: 20, alignSelf: 'flex-end', margin: 5,
          }}
        />
      </View>
    );
  }
}
