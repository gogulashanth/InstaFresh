import React from 'react';
import {
  Image, View, FlatList, StyleSheet,
} from 'react-native';
import { Text } from 'react-native-elements';
import colors from 'res/colors';
import RecipeListItem from 'library/components/RecipeListItem';
import Item from 'model/Item';
import { MenuButton } from 'library/components/HeaderItems';
import api from 'model/API';
import {
  BallIndicator,
  BarIndicator,
  DotIndicator,
  MaterialIndicator,
  PacmanIndicator,
  PulseIndicator,
  SkypeIndicator,
  UIActivityIndicator,
  WaveIndicator,
} from 'react-native-indicators';

export default class RecipesScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Recipes',
    headerLeft: <MenuButton onPress={navigation.getParam('handleMenuButtonClick')} />,
  });

  constructor(props) {
    super(props);
    this.state = { data: [], loading: false };
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
    this.setState({ loading: true });
    api.getRecipesList().then((recipeList) => {
      this.setState({ data: recipeList, loading: false });
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
    const { data, loading } = this.state;
    return (
      <View style={{
        flex: 1, backgroundColor: colors.darkerLogoBack, flexDirection: 'column', paddingTop: 30,
      }}
      >
        {loading && (
        <View style={styles.loadingContainer}>
          <DotIndicator color={colors.logo} size={10} />
          <Text h4 style={{ padding: 20 }}>Loading new recipes...</Text>
        </View>
        )}
        <FlatList
          style={{ topPadding: 40 }}
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

const styles = StyleSheet.create({
  loadingContainer: {
    padding: 0,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});
