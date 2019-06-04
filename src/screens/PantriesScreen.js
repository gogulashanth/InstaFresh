import React from 'react';
import {
 View, Text, StyleSheet, FlatList 
} from 'react-native';
import { MenuButton, PantryAddButton } from 'library/components/HeaderItems';
import colors from 'res/colors';
import PropTypes from 'prop-types';
import ItemSummary from 'library/components/ItemSummary';
import { SearchBar } from 'react-native-elements';
import palette from 'res/palette';
import dataInstance from 'model/Data';

export default class PantriesScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Pantries',
    headerRight: <PantryAddButton handleManualAddClick={navigation.getParam('handleManualAdd')} />,
    headerLeft: <MenuButton onPress={navigation.getParam('handleMenuButtonClick')} />,
  });

  constructor(props) {
    super(props);
    this.onPressItem = this.onPressItem.bind(this);
    this.state = {
      search: '', data: [], filteredData: [],
    };
  }

  async componentWillMount() {
    dataInstance.registerListener(this.onDataUpdate);
    const d = dataInstance.getPantriesArray();
    this.setState({ data: d, filteredData: d });
  }

  componentDidMount() {
    const { navigation } = this.props;

    navigation.setParams({
      handleManualAdd: this.handleManualAdd,
      handleMenuButtonClick: this.handleMenuButtonClick,
    });
  }

  componentWillUnmount() {
    dataInstance.unregisterListener(this.onDataUpdate);
  }

  onDataUpdate = (() => {
    const d = dataInstance.getPantriesArray();
    this.setState({ data: d, filteredData: d });
  });

  onPressItem(pantryID) {
    const { navigation } = this.props;
    navigation.navigate('PantryDetail', { pantryID, title: dataInstance.getPantry(pantryID).name });
  }

  handleMenuButtonClick = (() => {
    const { navigation } = this.props;
    navigation.toggleDrawer();
  });

  handleManualAdd = (() => {
  });

  updateSearch = ((search) => {
    this.setState({ search });
    this.filterItems(search);
  });

  keyExtractor = (pantry, index) => pantry.id;

  filterItems = ((text) => {
    const { data } = this.state;
    const newData = data.filter((pantry) => {
      const pantryData = `${pantry.name.toUpperCase()}`;
      return pantryData.indexOf(text.toUpperCase()) > -1;
    });
    this.setState({ filteredData: newData });
  });

  renderItem = ((item) => {
    const dataItem = item.item;
    const numItems = Object.keys(dataItem.items).length;
    let itemWord = 'item';
    if (numItems > 1) {
      itemWord = 'items';
    }

    return (
      <ItemSummary
        id={dataItem.id}
        title={`${dataItem.name}`}
        imageURI={dataItem.imageURI}
        description1={`${numItems} ${itemWord}`}
        onPressItem={this.onPressItem}
      />
    );
  });

  render() {
    const { search, filteredData } = this.state;
    return (
      <View style={styles.container}>
        <SearchBar
          platform="default"
          round
          placeholder="Search for an item or pantry..."
          onChangeText={this.updateSearch}
          value={search}
          containerStyle={{ backgroundColor: colors.lighterLogoBack }}
          inputContainerStyle={{ backgroundColor: colors.logoBack, height: 32 }}
          inputStyle={palette.text}
        />
        <FlatList
          style={{ flex: 1 }}
          contentContainerStyle={{ alignItems: 'center', marginTop: 10 }}
          data={filteredData}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}

PantriesScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkerLogoBack,
  },
});
