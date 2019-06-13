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

export default class ItemSearchInput extends React.Component {
  constructor(props) {
    super(props);
    this.input = React.createRef();
    this.state = { query: '', data: [] };
  }

  onDataArrival = ((docSnapshot) => {
    this.setState({ data: docSnapshot });
  });

  onItemSelect = (item) => {
    const { onSelect } = this.props;

    if (typeof item === 'object') {
      this.setState({ query: item.get('name') });
      this.input.current.blur();
      api.getItemData(item.id).then(itemData => onSelect(itemData));
    } else if (typeof (item) === 'string') {
      onSelect(item);
    }
  }

  onChangeText = ((text) => {
    const { query } = this.state;
    // TODO: change data arrival to a promise
    api.getProductList(query, undefined, this.onDataArrival);
    this.setState({ query: text });
  });

  render() {
    const { query, data, dropDownVisible } = this.state;
    const { inputTextStyle, onSelect } = this.props;

    return (
      <Autocomplete
        ref={this.input}
        style={inputTextStyle}
        hideResults={!dropDownVisible}
        containerStyle={{ flex: 1, paddingTop: 5, paddingBottom: 5 }}
        inputContainerStyle={{ borderWidth: 0 }}
        listStyle={{ backgroundColor: 'white' }}
        data={data}
        onFocus={() => this.setState({ dropDownVisible: true })}
        onBlur={() => this.setState({ dropDownVisible: false })}
        placeholder="Enter the name of the item"
        value={query}
        selectTextOnFocus
        keyExtractor={(item, index) => item.id}
        onChangeText={this.onChangeText}
        onEndEditing={() => this.onItemSelect(query)}
        renderItem={({ item, i }) => (
          <TouchableOpacity onPress={() => this.onItemSelect(item)}>
            <Text style={inputTextStyle}>{item.get('name')}</Text>
          </TouchableOpacity>
        )}
      />

    );
  }
}
