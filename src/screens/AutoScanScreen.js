import React from 'react';
import {
  StyleSheet, View, TouchableOpacity,
} from 'react-native';
import { Button, Icon, Text } from 'react-native-elements';
import PropTypes from 'prop-types';
import { RNCamera } from 'react-native-camera';
import colors from 'res/colors';
import Tflite from 'tflite-react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  preview: {
    flex: 1,
  },
  bottomRow: {
    padding: 10,
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexBasis: 'auto',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  buttonStyle: {
    backgroundColor: 'transparent',
  },
  topRow: {
    padding: 20,
    flexDirection: 'row',
    width: '100%',
    flex: 0,
    flexBasis: 'auto',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topText: {
    textAlign: 'center',
    padding: 10,
    alignSelf: 'center',
  },
  snap: {
    flexDirection: 'column',
    flex: 0,
    height: 120,
    flexBasis: 'auto',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  snapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    flex: 1,
  },
});

export default class AutoScanScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Home',
    header: null,
    gesturesEnabled: false,
  });

  constructor(props) {
    super(props);
    this.camera = React.createRef();
    this.state = {
      loading: false,
      tookPicture: false,
    };
  }

  onCancelButtonPress = (() => {
    const { navigation } = this.props;
    navigation.pop();
  });

  _takeSnap = async () => {
    if (this.camera) {
      const options = { pauseAfterCapture: true };
      const data = await this.camera.current.takePictureAsync(options);
      const img = data.uri;
      this.setState({ tookPicture: true });
      // run ml model
    }
  };

  render() {
    const { tookPicture } = this.state;
    return (
      <RNCamera ref={this.camera} style={styles.preview}>
        <View style={styles.container}>


          {!tookPicture && (
            <View style={styles.snap}>
              <Text h4 h4Style={styles.topText}>Take a picture of the item you'd like to scan</Text>
              <View style={{ ...styles.snapRow, ...{ } }}>
                <View style={{ flex: 1 }}>
                  <Button
                    type="clear"
                    title="Cancel"
                    buttonStyle={styles.buttonStyle}
                    containerStyle={{width: 80}}
                    onPress={this.onCancelButtonPress}
                  />
                </View>
                <Icon
                  name="ios-radio-button-on"
                  size={76}
                  type="ionicon"
                  color={colors.text}
                  containerStyle={{ flex: 1 }}
                  underlayColor="transparent"
                  Component={TouchableOpacity}
                  onPress={() => this._takeSnap()}
                />
                <View style={{ flex: 1 }} />
              </View>

            </View>

          )}

          {tookPicture && (
            <View style={styles.bottomRow}>
              <Button
                type="clear"
                title="Retake"
                buttonStyle={styles.buttonStyle}
                onPress={() => {
                  this.camera.current.resumePreview();
                  this.setState({ tookPicture: false });
                }}
              />

              <Button
                type="clear"
                title="Use Picture"
                buttonStyle={styles.buttonStyle}
                onPress={() => {}}
              />
            </View>
          )}

        </View>
      </RNCamera>

    );
  }
}
