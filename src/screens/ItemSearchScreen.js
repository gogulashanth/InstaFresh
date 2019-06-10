import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Text } from 'react-native-elements';
import colors from 'res/colors';
import api from 'model/API';
import Autocomplete from 'react-native-autocomplete-input';

export default class ItemSearchScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Search for an item',
  });

  constructor(props) {
    super(props);
    this.state = { query: '', data: [] };
  }

  onDataArrival = ((docSnapshot) => {
    let dataArray = [];
    docSnapshot.forEach((value, index, array) => {
      dataArray.push(value.data());
    });
    this.setState({ data: dataArray });
  });

  render() {
    const { query, data } = this.state;
    if (query.length > 2) {
      api.getProductList(query, undefined, this.onDataArrival);
    }

    return (
      <View style={styles.container}>
        <Autocomplete
          data={data}
          defaultValue={query}
          onChangeText={text => this.setState({ data: [], query: text })}
          renderItem={({ item, i }) => (
            <TouchableOpacity onPress={() => this.setState({ query: item.name })}>
              <Text>{item.name}</Text>
            </TouchableOpacity>
          )}
        />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.darkerLogoBack,
  },
});
