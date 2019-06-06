/* eslint-disable react/prefer-stateless-function */
/* eslint-disable keyword-spacing */
/* eslint-disable react/no-multi-comp */
import React from 'react';
import {
  StyleSheet, View, Text, FlatList,
} from 'react-native';
import colors from 'res/colors';
import ItemSummary from 'library/components/ItemSummary';
import AddItemCard from 'library/components/AddItemCard';
import { SearchBar, ListItem, ThemeProvider } from 'react-native-elements';
import dataInstance from 'model/Data';
import { AddButton, HeaderLogo, MenuButton } from 'library/components/HeaderItems';
import palette from 'res/palette';
import themes from 'res/themes';

export default class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Home',
    headerRight: <AddButton handleManualAddClick={navigation.getParam('handleManualAdd')} />,
    headerLeft: <MenuButton onPress={navigation.getParam('handleMenuButtonClick')} />,
  });

  constructor(props) {
    super(props);
    this.addItemCardRef = React.createRef();
    this.onPressItem = this.onPressItem.bind(this);
    this.state = {
      selected: (new Map(): Map<string, boolean>), search: '', data: [], filteredData: [],
    };
  }

  async componentWillMount() {
    await dataInstance.loadData();
    dataInstance.registerListener(this.onDataUpdate);
    const d = dataInstance.getItemsArray();
    this.setState({ data: d, filteredData: d });
  }

  componentDidMount() {
    const { navigation } = this.props;
    navigation.setParams({
      handleManualAdd: this.handleManualAddClick,
      handleMenuButtonClick: this.handleMenuButtonClick,
    });
  }

  componentWillUnmount() {
    dataInstance.unregisterListener(this.onDataUpdate);
  }

  onDataUpdate = (() => {
    const d = dataInstance.getItemsArray();
    this.setState({ data: d, filteredData: d });
  });

  onPressItem(id) {
    const { navigation } = this.props;
    // updater functions are preferred for transactional updates
    navigation.navigate('Item', { itemID: id, title: dataInstance.getItem(id).name });
  }

  keyExtractor = ((item, index) => item.id);

  handleManualAddClick = (() => {
    this.addItemCardRef.current.show();
  });

  handleMenuButtonClick = (() => {
    const { navigation } = this.props;
    navigation.toggleDrawer();
  });

  _listEmptyComponent = () => (
    // TODO: create empty comp.
    <View>
      <Text>Hello</Text>
    </View>
  )

  updateSearch = ((search) => {
    this.setState({ search });
    this.filterItems(search);
  });

  handleAddItem = ((item) => {
    dataInstance.addItem(item);
  });

  filterItems = ((text) => {
    const { data } = this.state;
    const newData = data.filter((item) => {
      const itemData = `${item.name.toUpperCase()} ${dataInstance._data[item.pantryID].name.toUpperCase()}`;
      return itemData.indexOf(text.toUpperCase()) > -1;
    });
    this.setState({ filteredData: newData });
  });

  renderItem = ((item) => {
    const { selected } = this.state;

    const dataItem = item.item;

    const currentDate = new Date();
    const numDaysLeft = Math.round((dataItem.expiryDate - currentDate) / (1000 * 60 * 60 * 24));
    let style = null;
    let expiryComp = null;

    if (numDaysLeft < 0) {
      expiryComp = 'Expired!';
      style = { color: colors.red };
    } else if (numDaysLeft <= 1) {
      expiryComp = 'Expires today!';
      style = { color: colors.red };
    } else if (numDaysLeft <= 2) {
      expiryComp = 'Expires in two days!';
      style = { color: colors.red };
    } else {
      expiryComp = `Expires in ${numDaysLeft} days`;
      style = {};
    }

    return (
      <ListItem
        leftAvatar={{ source: { uri: dataItem.imageURI }, size: 'medium' }}
        title={`${dataItem.name} - ${dataItem.quantity}`}
        subtitle={expiryComp}
        subsubTitle={dataInstance._data[dataItem.pantryID].name}
        subsubStyle={{ color: colors.text }}
        chevron
        containerStyle={{ marginTop: 5 }}
        subtitleStyle={style}
        onPress={() => this.onPressItem(dataItem.id)}
      />
    );
  });

  render() {
    const { search, filteredData } = this.state;
    return (
      <View style={styles.container}>
        <AddItemCard
          ref={this.addItemCardRef}
          visible={false}
          onSave={this.handleAddItem}
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
          ListEmptyComponent={this._listEmptyComponent}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkerLogoBack,
  },
});
