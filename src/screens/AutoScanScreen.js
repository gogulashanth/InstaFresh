import React from 'react';
import {
  StyleSheet, View, TouchableOpacity, ActivityIndicator, Dimensions,
} from 'react-native';
import { getImageSize, cropImage } from 'library/utils/helper';
import { Button, Icon, Text } from 'react-native-elements';
import AddItemCard from 'library/components/AddItemCard';
import PropTypes from 'prop-types';
import { RNCamera } from 'react-native-camera';
import colors from 'res/colors';
import Tflite from 'tflite-react-native';
import Item from 'model/Item';
import dataInstance from 'model/Data';

const tflite = new Tflite();

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
  objectMask: {
    backgroundColor: 'transparent',
    borderColor: colors.logo,
    borderWidth: 2,
    borderRadius: 10,
    position: 'absolute',
    zIndex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  buttonStyle: {
    backgroundColor: 'transparent',
  },
  addItemButtonStyle: {
    width: 100,
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
  activityOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
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
    this.width = Dimensions.get('window').width;
    this.height = Dimensions.get('window').height;

    this.camera = React.createRef();
    this.state = {
      loading: false,
      tookPicture: false,
      result: [],
      imageData: {},
      items: [],
      currentIndex: 0,
    };
    this.addItemCardRef = React.createRef();
  }


  componentWillMount() {
    tflite.loadModel({
      model: 'detect.tflite', // required
      labels: 'labelmap.txt', // required
      numThreads: 2, // defaults to 1
    },
    (err, res) => {
      if (err) {
        console.log(err);
      } else {
        console.log(res);
      }
    });
  }

  componentWillUnmount() {
    tflite.close();
  }

  goBack = (() => {
    const { navigation } = this.props;
    navigation.pop();
  });

  onCancelButtonPress = (() => {
    this.goBack();
  });

  _handlePictureSelected = (async (imageData) => {
    // run ml model
    const { result } = this.state;

    if (result.length === 0) {
      // need to show empty
      console.log('Empty result');
    } else {
      const { uri, width, height } = imageData;
      const data = {};
      const croppedImgsPromise = [];

      for (let i = 0; i < result.length; i++) {
        const item = result[i];
        const { rect } = item;
        const PADDING = 20;
        const cropData = {
          offset: { x: rect.x * width - PADDING, y: rect.y * height - PADDING },
          size: { width: rect.w * width + PADDING * 2, height: rect.h * height + PADDING * 2},
        };
        croppedImgsPromise.push(cropImage(uri, cropData));
      }

      const croppedImgs = await Promise.all(croppedImgsPromise);

      for (let i = 0; i < croppedImgs.length; i++) {
        const item = result[i];
        if (item.detectedClass in data) {
          data[item.detectedClass].quantity += 1;
        } else {
          data[item.detectedClass] = { quantity: 1, image: croppedImgs[i] };
        }
      }

      this._showItemCardsWithData(data);
    }
  });

  _takeSnap = async () => {
    if (this.camera) {
      const options = { pauseAfterCapture: true, width: this.width, base64: true };
      this.setState({ loading: true });
      const data = await this.camera.current.takePictureAsync(options);
      const { uri } = data;
      const result = await new Promise((resolve, reject) => {
        tflite.detectObjectOnImage({
          path: uri,
          model: 'SSDMobileNet',
          imageMean: 128,
          imageStd: 128,
          threshold: 0.3,
          numResultsPerClass: 10,
        },
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        });
      });

      this.setState({
        loading: false, result, tookPicture: true, imageData: data,
      });
    }
  };

  _showItemCardsWithData = ((data) => {
    const items = [];
    const dataKeys = Object.keys(data);
    for (let i = 0; i < dataKeys.length; i++) {
      items.push(new Item(dataKeys[i], undefined, data[dataKeys[i]].image, undefined, data[dataKeys[i]].quantity));
    }
    this.setState({ items, currentIndex: 0 });
    this.addItemCardRef.current.show(items[0]);
  });

  _onSkipPress = (() => {
    this.addItemCardRef.current.hide();
    const { currentIndex, items } = this.state;
    if (currentIndex < items.length - 1) {
      this.addItemCardRef.current.show(items[currentIndex + 1]);
      this.setState({ currentIndex: currentIndex + 1 });
    } else {
      // done with adding items
      this.setState({
        loading: false,
        tookPicture: false,
        result: [],
        imageData: {},
        items: [],
        currentIndex: 0,
      });
      this.goBack();
    }
  });

  _onNextPress = (() => {
    const item = this.addItemCardRef.current.getItemObject();
    dataInstance.addItem(item);

    this.addItemCardRef.current.hide();
    const { currentIndex, items } = this.state;
    if (currentIndex < items.length - 1) {
      this.addItemCardRef.current.show(items[currentIndex + 1]);
      this.setState({ currentIndex: currentIndex + 1 });
    } else {
      // done with adding items
      this.goBack();
    }
  });

  render() {
    const {
      tookPicture, loading, result, imageData,
    } = this.state;
    const skipNextButtons = ([
      <Button
        title="Skip"
        buttonStyle={{ ...styles.addItemButtonStyle, ...{ backgroundColor: colors.red } }}
        onPress={() => this._onSkipPress()}
      />,
      <Button
        title="Save"
        buttonStyle={styles.addItemButtonStyle}
        onPress={() => this._onNextPress()}
      />,
    ]);

    const { width, height } = imageData;

    const mask = result.map((item, index) => {
      const { rect } = item;

      return (
        <View
          key={index}
          style={{
            ...styles.objectMask,
            ...{
              top: rect.y * height,
              left: rect.x * width,
              width: rect.w * width,
              height: rect.h * height,
            },
          }}
        >
          <Text h3>{item.detectedClass}</Text>
        </View>
      );
    });

    return (
      <RNCamera ref={this.camera} style={styles.preview}>
        <View style={styles.container}>
          {mask}
          {loading && (
            <View style={styles.activityOverlay}>
              <ActivityIndicator animating={loading} color={colors.logo} size="large" />
            </View>
          )}
          <AddItemCard
            ref={this.addItemCardRef}
            visible={false}
            customButtons={skipNextButtons}
          />

          {!tookPicture && (
            <View style={styles.snap}>
              <Text h4 h4Style={styles.topText}>Take a picture of the item you'd like to scan</Text>
              <View style={{ ...styles.snapRow, ...{ } }}>
                <View style={{ flex: 1 }}>
                  <Button
                    type="clear"
                    title="Cancel"
                    buttonStyle={styles.buttonStyle}
                    containerStyle={{ width: 80 }}
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
                  this.setState({ tookPicture: false, result: [] });
                }}
              />

              <Button
                type="clear"
                title="Use Picture"
                buttonStyle={styles.buttonStyle}
                onPress={() => { this._handlePictureSelected(imageData); }}
              />
            </View>
          )}

        </View>
      </RNCamera>

    );
  }
}
