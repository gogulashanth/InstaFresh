import React from 'react';
import {
  StyleSheet, View,
} from 'react-native';
import { Button, Icon, Text } from 'react-native-elements';
import PropTypes from 'prop-types';
import { RNCamera } from 'react-native-camera';
import colors from 'res/colors';
import Tflite from 'tflite-react-native';

const styles = StyleSheet.create({
  preview: {
    flex: 1,
  },
  container: {
    backgroundColor: colors.darkerLogoBack,
    alignItems: 'center',
    justifyContent: 'center',
    ...StyleSheet.absoluteFillObject,
  },
  finder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  topLeftEdge: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  topRightEdge: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  bottomLeftEdge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  bottomRightEdge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  maskOuter: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  maskInner: {
    backgroundColor: 'transparent',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  maskFrame: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    flex: 1,
  },
  maskRow: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  maskCenter: {
    display: 'flex',
    flexDirection: 'row',
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
  headingText: {
    padding: 20,
    textAlign: 'center',
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
      maskCenterViewHeight: 0,
      loading: false,
    };
  }

  _onMaskCenterViewLayoutUpdated = ({ nativeEvent }) => {
    this.setState({
      maskCenterViewHeight: nativeEvent.layout.height,
    });
  };

  _applyMaskFrameTransparency = () => {
    let transparency = 0.6;
    if (
      this.props.transparency
      && Number(this.props.transparency)
      && (this.props.transparency >= 0 || this.props.transparency <= 1)
    ) {
      transparency = this.props.transparency;
    }
    return { backgroundColor: `rgba(0,0,0,${transparency})` };
  };

  _renderEdge = (edgePosition) => {
    const defaultStyle = {
      width: this.props.edgeWidth,
      height: this.props.edgeHeight,
      borderColor: this.props.edgeColor,
    };
    const edgeBorderStyle = {
      topRight: {
        borderRightWidth: this.props.edgeBorderWidth,
        borderTopWidth: this.props.edgeBorderWidth,
      },
      topLeft: {
        borderLeftWidth: this.props.edgeBorderWidth,
        borderTopWidth: this.props.edgeBorderWidth,
      },
      bottomRight: {
        borderRightWidth: this.props.edgeBorderWidth,
        borderBottomWidth: this.props.edgeBorderWidth,
      },
      bottomLeft: {
        borderLeftWidth: this.props.edgeBorderWidth,
        borderBottomWidth: this.props.edgeBorderWidth,
      },
    };
    return <View style={[defaultStyle, styles[`${edgePosition}Edge`], edgeBorderStyle[edgePosition]]} />;
  };

  onCancelButtonPress = (() => {
    const { navigation } = this.props;
    navigation.pop();
  });

  _takeSnap = async () => {
    if (this.camera) {
      const options = { pauseAfterCapture: true };
      const data = await this.camera.takePictureAsync(options);
      const img = data.uri;
      // run ml model
    }
  };

  render() {
    return (
      <RNCamera ref={this.camera} style={styles.preview}>
        <View style={[styles.container]}>

          <View style={styles.maskOuter}>
            <View style={[styles.maskRow, styles.maskFrame, this._applyMaskFrameTransparency()]}>
              <Text style={styles.headingText} h3>Take a picture of the item/s you would like to add</Text>
            </View>
            <View
              style={[{ height: this.props.height }, styles.maskCenter]}
              onLayout={this._onMaskCenterViewLayoutUpdated}
            >
              <View style={[styles.maskFrame, this._applyMaskFrameTransparency()]} />
              <View
                style={[
                  styles.maskInner,
                  {
                    width: this.props.width,
                    height: this.props.height,
                  },
                ]}
              >
                <Icon
                  name="ios-radio-button-on"
                  size={76}
                  type="ionicon"
                  color={colors.text}
                  underlayColor="transparent"
                  onPress={() => this._takeSnap()}
                />
              </View>
              <View style={[styles.maskFrame, this._applyMaskFrameTransparency()]} />
            </View>
            <View style={[styles.maskRow, styles.maskFrame, this._applyMaskFrameTransparency()]}>
              <Button buttonStyle={{ backgroundColor: colors.red, width: 100 }} title="Cancel" onPress={this.onCancelButtonPress} />
            </View>
          </View>
        </View>
      </RNCamera>
    );
  }
}

const propTypes: PropTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  edgeWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  edgeHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  edgeColor: PropTypes.string,
  edgeBorderWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  transparency: PropTypes.number,
};

const defaultProps = {
  width: 280,
  height: 400,
  edgeWidth: 20,
  edgeHeight: 20,
  edgeColor: colors.logo,
  edgeBorderWidth: 4,
  transparency: 0.8,
};

AutoScanScreen.propTypes = propTypes;
AutoScanScreen.defaultProps = defaultProps;
