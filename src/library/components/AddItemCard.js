/* eslint-disable react/no-multi-comp */
import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Image,
  TouchableHighlight,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import colors from 'res/colors';
import fonts from 'res/fonts';
import { Overlay, Input, Button } from 'react-native-elements';
import Item from 'model/Item';
import dataInstance from 'model/Data';
import DatePicker from 'library/components/DatePicker';
import CustomPicker from 'library/components/CustomPicker';
import ImagePicker from 'react-native-image-picker';
import PropTypes from 'prop-types';

// TODO: Create a defaults file with images and options
// TODO: Refactor class

export default class AddItemCard extends React.Component {
  static defaultValues = {
    imageURI: 'https://cnet4.cbsistatic.com/img/Gu0ly_clVsc-EHnRAea7i0GUhRI=/1600x900/2019/03/14/2609b0eb-1263-43e2-9380-c1f8cbced873/gettyimages-1089101352.jpg',
    pantryID: '',
    name: '',
    expiryDate: new Date(),
    quantity: '',
    id: '',
  }

  constructor(props) {
    super(props);
    this.datePicker = React.createRef();
    this.pantryPicker = React.createRef();
    this.windowHeight = Dimensions.get('window').height;

    this.options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: false,
        path: 'images',
      },
    };

    const { visible } = this.props;

    this.state = {
      imageURI: AddItemCard.defaultValues.imageURI,
      pantryID: AddItemCard.defaultValues.pantryID,
      name: AddItemCard.defaultValues.name,
      expiryDate: AddItemCard.defaultValues.expiryDate,
      quantity: AddItemCard.defaultValues.quantity,
      visibleOption: visible,
      pantryPickerData: [],
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
  });

  handleSaveButtonPress = (() => {
    const {
      name, quantity, imageURI, pantryID, expiryDate, id,
    } = this.state;
    const { onSave } = this.props;

    // TODO: Add nutrition item info
    let item = null;
    if (id === AddItemCard.defaultValues.id) {
      item = new Item(name, expiryDate, imageURI, 'na', quantity, pantryID);
    } else {
      item = new Item(name, expiryDate, imageURI, 'na', quantity, pantryID, id);
    }

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
    if (comp === 'name') {
      // close modal 
      this.setState({ visibleOption: false });
      // Go to search screen
      const { navigation } = this.props;
      navigation.navigate('ItemSearch');
    }
  });

  handleDeleteButtonPress = (() => {
    const { id } = this.state;
    const { navigation } = this.props;

    dataInstance.deleteItem(id);
    this.setState({ visibleOption: false });
    navigation.popToTop();
  });

  show(item = '') {
    let {
      name, imageURI, quantity, expiryDate, id, pantryID,
    } = AddItemCard.defaultValues;

    if (item !== '') {
      ({
        name, imageURI, quantity, expiryDate, id, pantryID,
      } = item);
    }

    const pantriesData = dataInstance.getPantriesArray();

    let pID = pantryID;
    if (pantryID === AddItemCard.defaultValues.pantryID) {
      pID = pantriesData[0].id;
    }

    this.setState({
      name,
      imageURI,
      quantity,
      expiryDate,
      id,
      pantryPickerData: pantriesData,
      pantryID: pID,
      visibleOption: true,
    });
  }

  render() {
    const { onBackdropPress, editMode } = this.props;
    const {
      quantity, name, imageURI, visibleOption, pantryPickerData, pantryID,
    } = this.state;

    let nameComponent = (
      <Input
        label="Name"
        placeholder="Enter the name of the item"
        inputContainerStyle={inputStyle.container}
        labelStyle={inputStyle.label}
        inputStyle={inputStyle.input}
        onChangeText={text => this.setState({ name: text })}
        value={name}
        onFocus={() => this.handleFocusChange('name')}
        selectTextOnFocus
      />
    );

    let deleteButton = null;

    if (editMode) {
      nameComponent = null;
      deleteButton = (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Button title="Delete" buttonStyle={{...styles.buttonStyle, backgroundColor: colors.red }} onPress={this.handleDeleteButtonPress} />
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
            overlayStyle={{ padding: 0, overflow: 'hidden' }}
          >
            <ScrollView
              contentContainerStyle={{ flex: 0 }}
              ref={this.scrollView}
              scrollEnabled={false}
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
                      onDateChangeMethod={this.onDateChange}
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
                      onChangeText={text => this.setState({ quantity: text })}
                      value={quantity}
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
                      <Button title="Cancel" buttonStyle={styles.buttonStyle} onPress={this.handleCancelButtonPress} />
                      <Button title="Save" buttonStyle={styles.buttonStyle} onPress={this.handleSaveButtonPress} />
                    </View>
                    {deleteButton}
                  </View>
                </View>

              </KeyboardAvoidingView>
            </ScrollView>

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
};

AddItemCard.propTypes = {
  onBackdropPress: PropTypes.func,
  editMode: PropTypes.bool,
  visible: PropTypes.bool.isRequired,
  onSave: PropTypes.func.isRequired,
  navigation: PropTypes.object,
};

const inputStyle = {
  container: {
    borderColor: colors.lighterLogoBack,
  },
  input: {
    color: colors.logoBack,
    fontFamily: fonts.text,
  },
  label: {
    color: colors.logo,
    fontFamily: fonts.text,
  },
};
const styles = StyleSheet.create({
  buttonStyle: {
    width: 100,
  },
});
