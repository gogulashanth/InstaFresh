/* eslint-disable react/no-multi-comp */
import React from 'react';
import {
  StyleSheet, View, Dimensions, Text, Image, TouchableHighlight, ScrollView, KeyboardAvoidingView, Picker, TouchableOpacity,
} from 'react-native';
import colors from 'res/colors';
import { Overlay, Input, Button } from 'react-native-elements';
import Item from 'model/Item';
import dataInstance from 'model/Data';
import DatePicker from 'library/components/DatePicker';
import CustomPicker from 'library/components/CustomPicker';
import ImagePicker from 'react-native-image-picker';

// TODO: Create a defaults file with images and options

const defaultImg = 'https://cnet4.cbsistatic.com/img/Gu0ly_clVsc-EHnRAea7i0GUhRI=/1600x900/2019/03/14/2609b0eb-1263-43e2-9380-c1f8cbced873/gettyimages-1089101352.jpg';
const defaultPantry = '';

export default class AddItemCard extends React.Component {
  constructor(props) {
    super(props);
    this.datePicker = React.createRef();
    this.pantryPicker = React.createRef();
    const { height, width } = Dimensions.get('window');
    this.windowHeight = height;
    this.windowWidth = width;

    this.options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: false,
        path: 'images',
      },
    };

    this.state = {
      imageURI: defaultImg,
      pantry: defaultPantry,
      name: '',
      expiryDate: new Date(),
      quantity: '',
      visibleOption: this.props.visible,
      pantriesData: [],
      pantryPickerData: [],
    };
  }

  show() {
    this.handleShow();
    this.setState({ visibleOption: true });
  }

  onDateChange = ((newDate) => {
    this.setState({ expiryDate: newDate });
  });

  handleDismiss = (() => {
    // Reset all fields
    this.state.name = '';
    this.state.quantity = '';
    this.state.image = defaultImg;
  });

  handleCancelButtonPress = (() => {
    this.setState({ visibleOption: false });
  });

  handleSaveButtonPress = (() => {
    const pantries = dataInstance.getPantriesArray();
    this.state.pantry = pantries[0];

    const {
      name, quantity, imageURI, pantry, expiryDate,
    } = this.state;

    const item = new Item(name, expiryDate, imageURI, 'na', quantity, pantry.id);
    this.props.onSave(item);
    this.setState({ visibleOption: false });
  });

  handleShow = (() => {
    const initialInd = 0;
    const pantriesData = dataInstance.getPantriesArray();

    const data = [];
    for (let i = 0; i < pantriesData.length; i++) {
      data.push(pantriesData[i].name);
    }
    this.setState({ pantriesData, pantryPickerData: data, pantry: pantriesData[initialInd] });
  });

  handleImagePress = (() => {
    ImagePicker.showImagePicker(this.options, (response) => {
      console.log('Response = ', response);

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

  render() {
    const { visible, onBackdropPress } = this.props;
    const {
      quantity, name, imageURI, visibleOption, pantryPickerData,
    } = this.state;

    return (
      <View>
        <Overlay
          borderRadius={20}
          animationType="slide"
          isVisible={visibleOption}
          onBackdropPress={onBackdropPress}
          onDismiss={this.handleDismiss}
          height={this.windowHeight - 100}
          // onShow={this.handleShow}
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
                    style={{ height: this.windowHeight-470 }}
                  />
                </TouchableHighlight>

                <View style={{ flex: 1, flexDirection: 'column', paddingTop: 10 }}>
                  <Input
                    label="Name"
                    placeholder="Enter the name of the item"
                    inputContainerStyle={inputStyle.container}
                    labelStyle={inputStyle.input}
                    onChangeText={text => this.setState({ name: text })}
                    value={name}
                    onFocus={() => this.handleFocusChange('name')}
                    selectTextOnFocus
                  />
                  <Input
                    label="Best Before"
                    inputComponent={DatePicker}
                    inputContainerStyle={inputStyle.container}
                    labelStyle={inputStyle.input}
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
                    labelStyle={inputStyle.input}
                    onChangeText={text => this.setState({ quantity: text })}
                    value={quantity}
                    onFocus={() => this.handleFocusChange('quantity')}
                  />
                  <Input
                    label="Pantry"
                    inputComponent={CustomPicker}
                    inputContainerStyle={inputStyle.container}
                    labelStyle={inputStyle.input}
                    data={pantryPickerData}
                    onFocus={() => this.handleFocusChange('pantry')}
                    ref={this.pantryPicker}
                  />
                  <View style={{
                    flex: 1, padding: 10, height: 120,flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
                  }}
                  >
                    <Button title="Cancel" buttonStyle={styles.buttonStyle} onPress={this.handleCancelButtonPress} />
                    <Button title="Save" buttonStyle={styles.buttonStyle} onPress={this.handleSaveButtonPress} />
                  </View>
                </View>
              </View>

            </KeyboardAvoidingView>
          </ScrollView>

        </Overlay>

      </View>

    );
  }
}

// class customPicker extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { language: 'java' };
//   }

//   render() {
//     return (
//       <Picker
//         selectedValue={this.state.language}
//         style={{ width: 100, height: 40 }}
//         itemStyle={{ height: 40 }}
//         onValueChange={(itemValue, itemIndex) => this.setState({ language: itemValue })}
//       >
//         <Picker.Item label="Java" value="java" />
//         <Picker.Item label="JavaScript" value="js" />
//         <Picker.Item label="C++" value="c" />
//       </Picker>
//     );
//   }
// }

const inputStyle = {
  container: {
    borderColor: colors.lighterLogoBack,
  },
  input: {
    color: colors.logo,
  },
};
const styles = StyleSheet.create({
  buttonStyle: {
    width: 100,
    backgroundColor: colors.logo,
    borderRadius: 20,
  },
});
