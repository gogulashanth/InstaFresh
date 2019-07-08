import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';
import { Text, Button, Overlay } from 'react-native-elements';
import colors from 'res/colors';
import fonts from 'res/fonts';
import CustomSlider from 'library/components/CustomSlider';

const windowHeight = Dimensions.get('window').height;

export default class ItemUseCard extends React.Component {
  static defaultProps = {
    title: '',
    subtitle: '',
    onBackdropPress: () => {},
    minValue: 0,
    maxValue: 100,
  }

  constructor(props) {
    super(props);
    this.state = { visible: false, amount: 0 };
  }

  show() {
    this.setState({ visible: true, amount: 0 });
  }

  hide() {
    this.setState({ visible: false });
  }

  render() {
    const {
      title,
      subtitle,
      containerStyle,
      titleStyle,
      subtitleStyle,
      onBackdropPress,
      minValue,
      maxValue,
      onSave,
    } = this.props;

    const {
      amount,
      visible,
    } = this.state;


    return (
      <Overlay
        borderRadius={20}
        animationType="slide"
        isVisible={visible}
        onBackdropPress={() => this.setState({ visible: false })}
        height={windowHeight - 100}
        overlayStyle={styles.overlayStyle}
        windowBackgroundColor="rgba(0, 0, 0, .7)"
      >
        <View style={{ ...styles.container, ...containerStyle }}>
          <Text h3 style={{ ...styles.title, ...titleStyle }}>
            {title}
          </Text>
          <Text h4 style={{ ...styles.subtitle, ...subtitleStyle }}>
            {subtitle}
          </Text>
          <Text h2 style={{ ...styles.subtitle }}>
            {amount.toString()}
          </Text>

          <CustomSlider
            style={{ flex: 9 }}
            value={0}
            minimumValue={minValue}
            maximumValue={maxValue}
            onValueChange={nextValue => this.setState({ amount: Math.round(nextValue * 10) / 10 })}
            trackStyle={{ backgroundColor: colors.logo }}
          />

          <View style={styles.buttonContainer}>
            <Button title="Cancel" buttonStyle={{ ...styles.buttonStyle, ...{ backgroundColor: colors.red } }} onPress={() => this.setState({ visible: false })} />
            <Button
              title="Save"
              buttonStyle={{ ...styles.buttonStyle }}
              onPress={() => {
                this.setState({ visible: false });
                onSave(amount);
              }}
            />
          </View>
        </View>
      </Overlay>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.darkerLogoBack,
    borderWidth: 2,
    borderColor: colors.logo,
    overflow: 'hidden',
    borderRadius: 20,
  },
  overlayStyle: {
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  title: {
    flex: 1,
  },
  subtitle: {
    flex: 1,
  },
  buttonStyle: {
    width: 100,
  },
  buttonContainer: {
    flex: 3,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
