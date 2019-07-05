/* eslint-disable react/no-multi-comp */
import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Image,
  TouchableHighlight,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
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

import fonts from '../../res/fonts';

import { Overlay, Input, Button } from 'react-native-elements';
import Item from 'model/Item';
import dataInstance from 'model/Data';
import DatePicker from 'library/components/DatePicker';
import CustomPicker from 'library/components/CustomPicker';
import ImagePicker from 'react-native-image-picker';
import PropTypes from 'prop-types';
import ItemSearchInput from 'library/components/ItemSearchInput';
import colors from '../../res/colors';

// TODO: Create a defaults file with images and options
// TODO: Refactor class

export default class AddItemCard extends React.Component {
  constructor(props) {
    super(props);
    this.datePicker = React.createRef();
    this.pantryPicker = React.createRef();
    this.windowHeight = Dimensions.get('window').height;
    this.windowWidth = Dimensions.get('window').width;

    this.options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: false,
        path: 'images',
      },
    };

    const { visible } = this.props;

    this.state = {
      imageURI: Item.defaults.imageURI,
      pantryID: Item.defaults.pantryID,
      name: Item.defaults.name,
      expiryDate: new Date(),
      quantity: Item.defaults.quantity,
      nutrition: Item.defaults.nutrition,
      visibleOption: visible,
      pantryPickerData: [],
      loading: false,
    };
  }

  onDateChange = ((newDate) => {
    this.setState({ expiryDate: newDate });
  });

  onPantryChange = ((newPantryID) => {
    this.setState({ pantryID: newPantryID });
  });

  handleDismiss = (() => {
    // Do nothing for now

  });

  handleCancelButtonPress = (() => {
    this.setState({ visibleOption: false });
    const { onCancel } = this.props;
    onCancel();
  });

  getItemObject = (() => {
    const {
      name, quantity, imageURI, pantryID, expiryDate, id, nutrition,
    } = this.state;
    const { editMode } = this.props;

    let item = null;
    if (!editMode) {
      item = new Item(name, expiryDate, imageURI, nutrition, quantity, pantryID);
    } else {
      item = new Item(name, expiryDate, imageURI, nutrition, quantity, pantryID, id);
    }
    return item;
  });

  handleSaveButtonPress = (() => {
    const { onSave } = this.props;
    const item = this.getItemObject();
    onSave(item);
    this.setState({ visibleOption: false });
  });

  handleImagePress = (() => {
    ImagePicker.showImagePicker(this.options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        this.setState({
          imageURI: response.uri,
        });
      }
    });
  });

  handleFocusChange = ((comp) => {
    if (this.datePicker.current != null) {
      if (comp === 'name') {
        this.datePicker.current.input.closePicker();
        this.pantryPicker.current.input.closePicker();
      } else if (comp === 'bestBefore') {
        this.pantryPicker.current.input.closePicker();
      } else if (comp === 'quantity') {
        this.datePicker.current.input.closePicker();
        this.pantryPicker.current.input.closePicker();
      } else if (comp === 'pantry') {
        this.datePicker.current.input.closePicker();
      }
    }
  });

  handleDeleteButtonPress = (() => {
    const { id } = this.state;
    const { navigation } = this.props;

    dataInstance.deleteItem(id);
    this.setState({ visibleOption: false });
    navigation.popToTop();
  });

  nameDropDownWillSelect = (() => {
    this.setState({ loading: true });
  });

  nameDropDownSelected = ((item) => {
    if (typeof item === 'object') {
      this.setState({
        name: item.name,
        imageURI: item.imageURI,
        expiryDate: item.expiryDate,
        nutrition: item.nutrition,
        loading: false,
      });
    } else if (typeof item === 'string') {
      this.setState({ name: item, loading: false });
    }
    // this.datePicker.current.input.focus();
  });

  show(item = '') {
    let {
      name, imageURI, quantity, pantryID, nutrition,
    } = Item.defaults;
    let id = '';
    let expiryDate = new Date();
    const { editMode } = this.props;

    if (item !== '') {
      ({
        name, imageURI, quantity, expiryDate, id, pantryID, nutrition,
      } = item);
    }

    const pantriesData = dataInstance.getPantriesArray();

    if (!editMode) {
      pantryID = pantriesData[0].id;
    }

    this.setState({
      name,
      imageURI,
      quantity,
      expiryDate,
      id,
      pantryID,
      nutrition,
      pantryPickerData: pantriesData,
      visibleOption: true,
    });
  }

  hide() {
    this.setState({ visibleOption: false });
  }


  render() {
    const { onBackdropPress, editMode, customButtons } = this.props;
    const {
      quantity, imageURI, visibleOption, pantryPickerData, pantryID, loading, expiryDate,
    } = this.state;

    let nameComponent = (
      <View style={{ flex: 1, zIndex: 1 }}>
        <Input
          label="Name"
          inputComponent={ItemSearchInput}
          inputContainerStyle={inputStyle.container}
          labelStyle={inputStyle.label}
          onFocus={() => this.handleFocusChange('name')}
          inputTextStyle={inputStyle.input}
          onSelect={item => this.nameDropDownSelected(item)}
          onItemWillSelect={() => this.nameDropDownWillSelect()}
        />
      </View>
    );

    let deleteButton = null;

    if (editMode) {
      nameComponent = null;
      deleteButton = (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Button title="Delete" icon={{ name: 'ios-trash', type: 'ionicon', color: colors.text }} buttonStyle={{ ...styles.buttonStyle, width: this.windowWidth - 110, backgroundColor: colors.red }} onPress={this.handleDeleteButtonPress} />
        </View>
      );
    }

    if (!visibleOption) {
      return null;
    } else {
      return (
        <View>
          <Overlay
            borderRadius={20}
            animationType="slide"
            isVisible={visibleOption}
            onBackdropPress={onBackdropPress}
            onDismiss={this.handleDismiss}
            height={this.windowHeight - 100}
            windowBackgroundColor="rgba(0, 0, 0, .6)"
            overlayStyle={{ padding: 0, overflow: 'hidden' }}
          >
            <View style={{ flex: 1 }}>
              {loading
              && (
                <View style={styles.activityIndicator}>
                  <DotIndicator color={colors.logo} />
                </View>
              )}

              <ScrollView
                contentContainerStyle={{ flex: 0 }}
                ref={this.scrollView}
                scrollEnabled={false}
                keyboardShouldPersistTaps="always"
              >
                <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={-90}>
                  <View style={{ flex: 1, flexDirection: 'column' }}>

                    <TouchableHighlight onPress={this.handleImagePress}>
                      <Image
                        source={{ uri: imageURI }}
                        style={{ height: this.windowHeight - 470 }}
                      />
                    </TouchableHighlight>

                    <View style={{ flex: 1, flexDirection: 'column', paddingTop: 10 }}>
                      {nameComponent}
                      <Input
                        label="Best Before"
                        inputComponent={DatePicker}
                        inputContainerStyle={inputStyle.container}
                        labelStyle={inputStyle.label}
                        pickerDate={expiryDate}
                        onDateChangeMethod={newDate => this.onDateChange(newDate)}
                        onFocus={() => this.handleFocusChange('bestBefore')}
                        ref={this.datePicker}
                      />
                      <Input
                        containerStyle={{ width: '100%' }}
                        ref={this.quantity}
                        label="Quantity"
                        placeholder="Enter the quantity of the item"
                        keyboardType="numeric"
                        returnKeyType="done"
                        inputContainerStyle={inputStyle.container}
                        labelStyle={inputStyle.label}
                        inputStyle={inputStyle.input}
                        onChangeText={text => this.setState({ quantity: Number(text) })}
                        value={quantity.toString()}
                        onBlur={() => {
                          // this.pantryPicker.current.input.focus();
                        }}
                        onFocus={() => this.handleFocusChange('quantity')}
                      />
                      <Input
                        label="Pantry"
                        inputComponent={CustomPicker}
                        inputContainerStyle={inputStyle.container}
                        labelStyle={inputStyle.label}
                        data={pantryPickerData}
                        onFocus={() => this.handleFocusChange('pantry')}
                        ref={this.pantryPicker}
                        chosenID={pantryID}
                        onPickerChange={this.onPantryChange}
                      />

                      <View style={{
                        flex: 1, padding: 10, height: 120, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
                      }}
                      >
                        {customButtons}
                        {!customButtons && [
                          <Button title="Cancel" buttonStyle={{ ...styles.buttonStyle, ...{ backgroundColor: colors.red } }} onPress={this.handleCancelButtonPress} />,
                          <Button title="Save" buttonStyle={styles.buttonStyle} onPress={this.handleSaveButtonPress} />,
                        ]}
                      </View>
                      {deleteButton}
                    </View>
                  </View>
                </KeyboardAvoidingView>
              </ScrollView>
            </View>
          </Overlay>
        </View>
      );
    }
  }
}

AddItemCard.defaultProps = {
  onBackdropPress: () => {},
  editMode: false,
  navigation: null,
  onSave: () => {},
  onCancel: () => {},
};

AddItemCard.propTypes = {
  onBackdropPress: PropTypes.func,
  editMode: PropTypes.bool,
  visible: PropTypes.bool.isRequired,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
  navigation: PropTypes.object,
};

const inputStyle = {
  container: {
    flex: 1,
    borderColor: colors.logoBack,
  },
  input: {
    color: colors.logoBack,
    fontFamily: fonts.text,
    fontSize: 18,
  },
  label: {
    color: colors.logo,
    fontFamily: fonts.text,
    fontSize: 18,
  },
};
const styles = StyleSheet.create({
  buttonStyle: {
    width: 100,
  },
  activityIndicator: {
    ...StyleSheet.absoluteFill,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1,
  },
});
