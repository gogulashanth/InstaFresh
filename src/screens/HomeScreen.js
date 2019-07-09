/* eslint-disable react/prefer-stateless-function */
/* eslint-disable keyword-spacing */
/* eslint-disable react/no-multi-comp */
import React from 'react';
import {
  StyleSheet, View, Text,
} from 'react-native';
import ThemedFlatList from 'library/components/ThemedFlatList';
import colors from 'res/colors';
import AddItemCard from 'library/components/AddItemCard';
import { SearchBar } from 'react-native-elements';
import dataInstance from 'model/Data';
import { AddButton, MenuButton } from 'library/components/HeaderItems';
import CustomListItem from 'library/components/CustomListItem';
import InfoBox from 'library/components/InfoBox';

export default class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Home',
    headerRight: <AddButton
      onManualAddPress={navigation.getParam('handleManualAdd')}
      onBarcodeScanPress={navigation.getParam('onBarcodeScanPress')}
      onAutoScanPress={navigation.getParam('onAutoScanPress')}
    />,
    headerLeft: <MenuButton onPress={navigation.getParam('handleMenuButtonClick')} />,
  });

  constructor(props) {
    super(props);
    this.addItemCardRef = React.createRef();
    this.onPressItem = this.onPressItem.bind(this);
    this.state = {
      selected: (new Map(): Map<string, boolean>), search: '', data: [], filteredData: []
    };
  }

  async componentWillMount() {
    await dataInstance.loadData();
    dataInstance.registerListener(this.onDataUpdate);
    this.onDataUpdate();
  }

  componentDidMount() {
    const { navigation } = this.props;
    navigation.setParams({
      handleManualAdd: this.handleManualAddClick,
      handleMenuButtonClick: this.handleMenuButtonClick,
      onBarcodeScanPress: this.onBarcodeScanPress,
      onAutoScanPress: this.onAutoScanPress,
    });
  }

  componentWillUnmount() {
    dataInstance.unregisterListener(this.onDataUpdate);
  }

  onAutoScanPress =(() => {
    const { navigation } = this.props;
    navigation.navigate('AutoScan');
  });

  onBarcodeScanPress = (() => {
    const { navigation } = this.props;
    navigation.navigate('Barcode');
  });

  onDataUpdate = (() => {
    const d = dataInstance.getItemsArray();
    d.sort((a, b) => a.expiryDate.getTime() - b.expiryDate.getTime());
    this.setState({ data: d, filteredData: d });
  });

  onPressItem(id) {
    const { navigation } = this.props;
    // updater functions are preferred for transactional updates
    navigation.push('Item', { itemID: id, title: dataInstance.getItem(id).name });
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
    <InfoBox
      imageSource={require('res/images/ionicons_ios-archive.png')}
      title="You don't have any items stored in your pantries."
      subtitle="Add an item by pressing the add button"
    />
  )

  _listEmptySearchComponent = () => (
    <InfoBox
      imageSource={require('res/images/ionicons_ios-search.png')}
      title="No items/pantries found"
      subtitle="Check the spelling and try again."
    />
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
    const originalCount = data.length;
    const newData = data.filter((item) => {
      const itemData = `${item.name.toUpperCase()} ${dataInstance._data[item.pantryID].name.toUpperCase()}`;
      return itemData.indexOf(text.toUpperCase()) > -1;
    });
    this.setState({ filteredData: newData });
    // if(newData.length === 0 && newData.length !== originalCount) {
    //   this.setState({ filteredData: newData, emptySearch: true });
    // }else {
    //   this.setState({ filteredData: newData });
    // }
  });

  renderItem = ((item) => {
    const { selected } = this.state;

    const dataItem = item.item;
    const numDaysLeft = dataItem.getNumDaysLeft();
    
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
      <CustomListItem
        leftAvatar={{ source: { uri: dataItem.imageURI }, size: 'medium' }}
        title={`${dataItem.name} - ${Math.round(dataItem.quantity * 10) / 10}`}
        subtitle={expiryComp}
        subsubtitle={dataInstance._data[dataItem.pantryID].name}
        subsubtitleStyle={{ color: colors.text }}
        subtitleStyle={style}
        onPress={() => this.onPressItem(dataItem.id)}
      />
    );
  });

  render() {
    const { search, filteredData } = this.state;
    const { navigation } = this.props;
    const emptyItem = (filteredData.length === 0 && search !== '') ? this._listEmptySearchComponent : this._listEmptyComponent;
    return (
      <View style={styles.container}>
        <AddItemCard
          ref={this.addItemCardRef}
          visible={false}
          onSave={this.handleAddItem}
          navigation={navigation}
        />
        <SearchBar
          platform="default"
          round
          placeholder="Search for an item or pantry..."
          onChangeText={this.updateSearch}
          value={search}
        />
        <ThemedFlatList
          data={filteredData}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          ListEmptyComponent={emptyItem}
          style={{marginLeft: 5}}
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
