import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Text, Icon } from 'react-native-elements';
import colors from 'res/colors';
import api from 'model/API';
import Autocomplete from 'react-native-autocomplete-input';
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

export default class ItemSearchInput extends React.Component {
  constructor(props) {
    super(props);
    this.input = React.createRef();
    this.state = { query: '', data: [], loading: false };
    this.loading = false;
    this.pendingRequests = [];
  }

  componentWillMount() {
    this._listHeight = Dimensions.get('window').height - 530;
  }

  onItemSelect = (item) => {
    const { onSelect, onItemWillSelect } = this.props;
    onItemWillSelect();
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

    this.setState({ query: text });

    if (this.loading) {
      this.pendingRequests.push(text);
      return;
    } else {
      this.pendingRequests = [];
    }

    this.setState({ loading: true });
    this.loading = true;

    api.getProductList(query).then((data) => {
      this.setState({ data, loading: false });
      this.loading = false;
      if (this.pendingRequests.length > 0) {
        const nextQuery = this.pendingRequests.pop();
        this.pendingRequests = [];
        this.onChangeText(nextQuery);
      }
    });
  });

  render() {
    const {
      query, data, dropDownVisible, loading,
    } = this.state;
    const { inputTextStyle, onSelect } = this.props;

    return (
      <Autocomplete
        ref={this.input}
        renderTextInput={props => <LoadingTextInput {...props} loading={loading} />}
        style={inputTextStyle}
        hideResults={!dropDownVisible}
        containerStyle={styles.container}
        inputContainerStyle={styles.inputContainer}
        listStyle={{ ...styles.list, ...{ maxHeight: this._listHeight } }}
        data={data}
        onFocus={() => this.setState({ dropDownVisible: true })}
        onBlur={() => this.setState({ dropDownVisible: false })}
        placeholder="Enter the name of the item"
        value={query}
        keyExtractor={(item, index) => item.id}
        onChangeText={this.onChangeText}
        onEndEditing={() => this.onItemSelect(query)}
        renderItem={({ item, i }) => (
          <TouchableOpacity onPress={() => this.onItemSelect(item)}>
            <View style={styles.listItem}>
              <Icon
                name="ios-search"
                type="ionicon"
                color={colors.logoBack}
                size={15}
              />

              <Text h3 h3Style={{ ...inputTextStyle, ...styles.inputText }}>{item.get('name')}</Text>

            </View>
          </TouchableOpacity>
        )}
      />

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 5,
    paddingBottom: 5,
  },
  inputContainer: {
    borderWidth: 0,
  },
  list: {
    backgroundColor: colors.darkerText,
    borderRadius: 10,
    borderWidth: 0,
    marginTop: 7,
  },
  listItem: {
    padding: 2,
    flexDirection: 'row',
    paddingLeft: 5,
    opacity: 0.7,
    alignItems: 'center',
  },
  inputText: {
    paddingLeft: 10,
  },
});

class LoadingTextInput extends React.PureComponent {
  constructor(props) {
    super(props);
    this.input = React.createRef();
  }

  focus() {
    this.input.current.focus();
  }

  blur() {
    this.input.current.blur();
  }

  clear() {
    this.input.current.clear();
  }

  isFocused() {
    return this.input.current.isFocused();
  }

  setNativeProps(nativeProps) {
    this.input.current.setNativeProps(nativeProps);
  }

  render() {
    const { loading } = this.props;
    return (
      <View style={{
        flex: 1, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      }}
      >
        <View style={{ flex: 5 }}>
          <TextInput ref={this.input} {...this.props} />
        </View>
        {loading && <BallIndicator size={15} color={colors.logo} />}
      </View>
    );
  }
}
