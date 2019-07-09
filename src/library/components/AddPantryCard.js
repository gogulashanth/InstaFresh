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
  Alert,
} from 'react-native';
import colors from 'res/colors';
import fonts from 'res/fonts';
import { Overlay, Input, Button } from 'react-native-elements';
import Pantry from 'model/Pantry';
import dataInstance from 'model/Data';
import ImagePicker from 'react-native-image-picker';
import PropTypes from 'prop-types';

// TODO: Create a defaults file with images and options
// TODO: Refactor class

export default class AddPantryCard extends React.Component {
  constructor(props) {
    super(props);
    this.windowHeight = Dimensions.get('window').height;
    this.windowWidth = Dimensions.get('window').width;

    this.options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
      },
    };

    const { visible } = this.props;

    this.state = {
      imageURI: Pantry.defaults.imageURI,
      name: Pantry.defaults.name,
      visibleOption: visible,
    };
  }

  handleDismiss = (() => {
    // Do nothing for now

  });

  handleCancelButtonPress = (() => {
    this.setState({ visibleOption: false });
  });

  handleSaveButtonPress = (() => {
    const {
      name, imageURI, id,
    } = this.state;

    const { onSave } = this.props;

    let pantry = null;
    if (id === Pantry.defaults.id) {
      pantry = new Pantry(name, imageURI);
    } else {
      pantry = new Pantry(name, imageURI, {}, id);
    }

    onSave(pantry);
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

  handleDeleteButtonPress = (() => {
    const { id } = this.state;
    const { navigation } = this.props;

    if (dataInstance.getPantriesArray().length <= 1) {
      // Cannot delete: notify user
      Alert.alert(
        'Cannot Delete Pantry',
        'There must be at least one pantry available at any time. Please create a new pantry before deleting this one.',
        [
          {
            text: 'OK',
            onPress: (() => {
              this.setState({ visibleOption: false });
              navigation.popToTop();
            }),
            style: 'ok',
          },
        ],
        { cancelable: false },
      );
    } else {
      dataInstance.deletePantry(id);
      this.setState({ visibleOption: false });
      navigation.popToTop();
    }
  });

  show(pantry = '') {
    let {
      name, imageURI, id,
    } = Pantry.defaults;

    if (pantry !== '') {
      ({
        name, imageURI, id,
      } = pantry);
    }

    this.setState({
      name,
      imageURI,
      id,
      visibleOption: true,
    });
  }

  render() {
    const { onBackdropPress, editMode } = this.props;
    const {
      name, imageURI, visibleOption,
    } = this.state;

    let deleteButton = null;

    if (editMode) {
      deleteButton = (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Button 
            title="Delete" 
            icon={{ name: 'ios-trash', type: 'ionicon', color: colors.text }}
            buttonStyle={{ ...styles.buttonStyle, width: this.windowWidth - 110, backgroundColor: colors.red }} 
            onPress={this.handleDeleteButtonPress} 
          />
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
            overlayStyle={{ padding: 0, overflow: 'hidden' }}
            windowBackgroundColor="rgba(0, 0, 0, .7)"
          >
            <KeyboardAvoidingView behavior="position">
              <ScrollView
                contentContainerStyle={{ flex: 0 }}
                ref={this.scrollView}
                scrollEnabled={false}
              >
                <View style={{ flex: 1, flexDirection: 'column' }}>

                  <TouchableHighlight onPress={this.handleImagePress}>
                    <Image
                      source={{ uri: imageURI }}
                      style={{ height: editMode ? this.windowHeight - 420 : this.windowHeight - 380 }}
                    />
                  </TouchableHighlight>

                  <View style={{ flex: 1, flexDirection: 'column', paddingTop: 10 }}>
                    <Input
                      label="Name"
                      placeholder="Enter the name of the item"
                      inputContainerStyle={inputStyle.container}
                      labelStyle={inputStyle.label}
                      inputStyle={inputStyle.input}
                      onChangeText={text => this.setState({ name: text })}
                      value={name}
                      selectTextOnFocus
                    />

                    <View style={{
                      flex: 1, padding: 10, height: 120, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
                    }}
                    >
                      <Button title="Cancel" buttonStyle={{ ...styles.buttonStyle, ...{ backgroundColor: colors.red } }} onPress={this.handleCancelButtonPress} />
                      <Button title="Save" buttonStyle={styles.buttonStyle} onPress={this.handleSaveButtonPress} />
                    </View>
                    {deleteButton}
                  </View>
                </View>

              </ScrollView>
            </KeyboardAvoidingView>
          </Overlay>

        </View>
      );
    }
  }
}

AddPantryCard.defaultProps = {
  onBackdropPress: () => {},
  editMode: false,
  navigation: null,
};

AddPantryCard.propTypes = {
  onBackdropPress: PropTypes.func,
  editMode: PropTypes.bool,
  visible: PropTypes.bool.isRequired,
  onSave: PropTypes.func.isRequired,
  navigation: PropTypes.object,
};

const inputStyle = {
  container: {
    borderColor: colors.logoBack,
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
