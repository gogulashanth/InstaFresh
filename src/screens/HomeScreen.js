import React from 'react';
import {
  StyleSheet, View, Text, Image, FlatList,
} from 'react-native';
import colors from 'res/colors';
import ItemSummary from 'library/components/ItemSummary';
import InstaFreshHeader from 'library/components/InstaFreshHeader';
import { SearchBar } from 'react-native-elements';
import dataInstance from 'model/Data';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: colors.darkerLogoBack,
  },
});

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selected: (new Map(): Map<string, boolean>), search: '', data: [], filteredData: [] };
  }

  async componentWillMount() {
    await dataInstance.loadData();
    dataInstance.registerListener(this.onDataUpdate);
    const d = dataInstance.getItemsArray();
    this.setState({ data: d, filteredData: d});
  }

  onDataUpdate = (() => {
    const d = dataInstance.getItemsArray();
    this.setState({ data: d, filteredData: d });
  });

  keyExtractor = (item, index) => item.id;

  onPressItem = (id: string) => {
    // updater functions are preferred for transactional updates
    this.setState((state) => {
      // copy the map rather than modifying state.
      const selected = new Map(state.selected);
      selected.set(id, !selected.get(id)); // toggle
      return { selected };
    });
  };

  _listEmptyComponent = () => (
    <View>
      <Text>Hello</Text>
    </View>
  )

  updateSearch = ((search) => {
    this.setState({ search });
    this.filterItems(search);
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
      style = { color: 'red' };
    } else if (numDaysLeft <= 1) {
      expiryComp = 'Expires today!';
      style = { color: 'red' };
    } else if (numDaysLeft <= 2) {
      expiryComp = 'Expires in two days!';
      style = { color: 'red' };
    } else {
      expiryComp = `Expires in ${numDaysLeft} days`;
      style = null;
    }

    return (
      <ItemSummary
        id={dataItem.id}
        title={`${dataItem.name} - ${dataItem.quantity}`}
        imageURI={dataItem.imageURI}
        description1={expiryComp}
        description1Style={style}
        description2={dataInstance._data[dataItem.pantryID].name}
        description2Style={null}
        onPressItem={this.onPressItem}
        selected={!!selected.get(dataItem.id)}
      />
    );
  });

  render() {
    const { search, filteredData } = this.state;
    return (
      <InstaFreshHeader style={styles.container} screenName="home">
        <View style={{ flex: 0, height: '90%', width: '100%' }}>
          <SearchBar
            platform="default"
            round
            placeholder="Type Here..."
            onChangeText={this.updateSearch}
            value={search}
          />
          <FlatList
            style={{ flex: 1 }}
            contentContainerStyle={{ alignItems: 'center', marginTop: 10 }}
            data={filteredData}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderItem}
            ListEmptyComponent={this._listEmptyComponent}
          />
        </View>
      </InstaFreshHeader>
    );
  }
}
