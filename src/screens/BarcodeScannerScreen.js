import React from 'react';
import {
  Animated, StyleSheet, View, ActivityIndicator,
} from 'react-native';
import { Button } from 'react-native-elements';
import PropTypes from 'prop-types';
import { RNCamera } from 'react-native-camera';
import colors from 'res/colors';
import api from 'model/API';
import AddItemCard from 'library/components/AddItemCard';
import dataInstance from 'model/Data';

const styles = StyleSheet.create({
  preview: {
    flex: 1,
  },
  container: {
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
  animatedLine: {
    position: 'absolute',
    elevation: 4,
    zIndex: 0,
    width: '85%',
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

export default class BarcodeScannerScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Home',
    header: null,
    gesturesEnabled: false,
  });

  constructor(props) {
    super(props);
    this.addItemCardRef = React.createRef();
    this.state = {
      top: new Animated.Value(10),
      maskCenterViewHeight: 0,
      loading: false,
    };
  }

  componentDidMount() {
    this._startLineAnimation();
  }

  componentWillUnmount() {
    if (this.animation) {
      this.animation.stop();
    }
  }

  _startLineAnimation = () => {
    const intervalId = setInterval(() => {
      if (this.state.maskCenterViewHeight > 0) {
        this._animateLoop();
        clearInterval(this.state.intervalId);
      }
    }, 500);
    this.setState({
      intervalId,
    });
  };

  _animateLoop = () => {
    this.animation = Animated.loop(
      Animated.sequence([
        Animated.timing(this.state.top, {
          toValue: this.state.maskCenterViewHeight - 10,
          duration: this.props.lineAnimationDuration,
        }),
        Animated.timing(this.state.top, {
          toValue: 10,
          duration: this.props.lineAnimationDuration,
        }),
      ]),
    );
    this.animation.start();
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

  handleBarcodeRead = ((result) => {
    if (this.animation) {
      this.animation.stop();
    }
    // show loading screen
    this.setState({ loading: true });

    api.getItemByUPC(result.data).then((item) => {
      if (item) {
        this.setState({ loading: false });
        this.addItemCardRef.current.show(item);
      } else {
        this.setState({ loading: false });
        this.addItemCardRef.current.show();
        // this._animateLoop();
        // Display a message showing item not found
      }
    });
  });

  handleSaveItem = ((item) => {
    const { navigation } = this.props;
    dataInstance.addItem(item);
    navigation.pop();
  });

  onCancelButtonPress = (() => {
    const { navigation } = this.props;
    navigation.pop();
  });

  render() {
    const { loading } = this.state;
    return (
      <RNCamera style={styles.preview} onBarCodeRead={this.handleBarcodeRead}>
        <AddItemCard ref={this.addItemCardRef} visible={false} onSave={this.handleSaveItem} onCancel={this._animateLoop} />
        <View style={[styles.container]}>
          <View
            style={[
              styles.finder,
              {
                width: this.props.width,
                height: this.props.height,
              },
            ]}
          >
            {this._renderEdge('topLeft')}
            {this._renderEdge('topRight')}
            {this._renderEdge('bottomLeft')}
            {this._renderEdge('bottomRight')}

            {this.props.showAnimatedLine && !loading && (
              <Animated.View
                style={[
                  styles.animatedLine,
                  {
                    backgroundColor: this.props.animatedLineColor,
                    height: this.props.animatedLineHeight,
                    top: this.state.top,
                  },
                ]}
              />
            )}
          </View>

          <View style={styles.maskOuter}>
            <View style={[styles.maskRow, styles.maskFrame, this._applyMaskFrameTransparency()]} />
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
              />

              <View style={[styles.maskFrame, this._applyMaskFrameTransparency()]} />
            </View>
            <View style={[styles.maskRow, styles.maskFrame, this._applyMaskFrameTransparency()]}>
              <Button buttonStyle={{ backgroundColor: colors.red, width: 100 }} title="Cancel" onPress={this.onCancelButtonPress} />
            </View>
          </View>

        </View>
        {loading && (
          <View style={styles.activityOverlay}>
            <ActivityIndicator animating={loading} color={colors.logo} size="large" />
          </View>
        )}
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
  showAnimatedLine: PropTypes.bool,
  animatedLineColor: PropTypes.string,
  animatedLineHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  lineAnimationDuration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

const defaultProps = {
  width: 280,
  height: 230,
  edgeWidth: 20,
  edgeHeight: 20,
  edgeColor: colors.logo,
  edgeBorderWidth: 4,
  transparency: 0.6,
  showAnimatedLine: true,
  animatedLineColor: colors.logo,
  animatedLineHeight: 2,
  lineAnimationDuration: 1500,
};

BarcodeScannerScreen.propTypes = propTypes;
BarcodeScannerScreen.defaultProps = defaultProps;
