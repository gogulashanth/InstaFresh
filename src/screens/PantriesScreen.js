import React from 'react';
import {
 View, StyleSheet, FlatList 
} from 'react-native';
import { MenuButton, PantryAddButton } from 'library/components/HeaderItems';
import colors from 'res/colors';
import PropTypes from 'prop-types';
import { SearchBar, ListItem, Text } from 'react-native-elements';
import palette from 'res/palette';
import dataInstance from 'model/Data';
import AddPantryCard from 'library/components/AddPantryCard';
import CustomListItem from 'library/components/CustomListItem';

export default class PantriesScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Pantries',
    headerRight: <PantryAddButton onPress={navigation.getParam('handleManualAdd')} />,
    headerLeft: <MenuButton onPress={navigation.getParam('handleMenuButtonClick')} />,
  });

  constructor(props) {
    super(props);
    this.onPressItem = this.onPressItem.bind(this);
    this.state = {
      search: '', data: [], filteredData: [],
    };
    this.addPantryCardRef = React.createRef();
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

  handleAddPantry = ((pantry) => {
    dataInstance.addPantry(pantry);
  });

  handleMenuButtonClick = (() => {
    const { navigation } = this.props;
    navigation.toggleDrawer();
  });

  handleManualAdd = (() => {
    this.addPantryCardRef.current.show();
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
      <CustomListItem
        leftAvatar={{ source: { uri: dataItem.imageURI }, size: 'medium' }}
        title={`${dataItem.name}`}
        subtitle={`${numItems} ${itemWord}`}
        containerStyle={{marginTop: 5}}
        onPress={() => this.onPressItem(dataItem.id)}
      />
    );
  });

  render() {
    const { search, filteredData } = this.state;
    return (
      <View style={styles.container}>
        
        <AddPantryCard
          ref={this.addPantryCardRef}
          visible={false}
          onSave={this.handleAddPantry}
        />
        <SearchBar
          platform="default"
          round
          placeholder="Search for an item or pantry..."
          onChangeText={this.updateSearch}
          value={search}
        />
        <FlatList
          contentContainerStyle={{ marginTop: 10 }}
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
