import React from 'react';
import {
  StyleSheet, Animated, View, Text, Picker, TouchableOpacity,
} from 'react-native';

export default class CustomPicker extends React.Component {
  constructor(props) {
    super(props);
    const { data } = this.props;
    this.closedHeight = 35;
    this.state = {
      chosenVal: data[0], height: new Animated.Value(this.closedHeight), opacity: new Animated.Value(0), expanded: false,
    };
  }

  handlePickerValueChange = ((itemValue, itemIndex) => {
    this.setState({ chosenVal: itemValue });
  });

  openPicker = (() => {
    const {
      height, opacity,
    } = this.state;

    this.setState({ expanded: true });
    Animated.parallel([
      Animated.timing(height, {
        toValue: 140,
        duration: 400,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
      }),
    ]).start();
  });

  closePicker = (() => {
    const {
      height, opacity,
    } = this.state;
    this.setState({ expanded: false });
    Animated.parallel([
      Animated.timing(height, {
        toValue: this.closedHeight,
        duration: 400,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 400,
      }),
    ]).start();
  });

  render() {
    const {
      height, opacity, chosenVal, expanded,
    } = this.state;

    const { data, onFocus } = this.props;
    return (
      <Animated.View style={{ flex: 1, height, flexDirection: 'column' }}>
        <TouchableOpacity onPress={() => {
          if (expanded) {
            this.closePicker();
          } else {
            onFocus();
            this.openPicker();
          }
        }}
        >
          <Text style={styles.text}>
            {chosenVal}
          </Text>
        </TouchableOpacity>

        <Animated.View style={{ opacity, flex:1 }}>
          <Picker
            style={{ flex: 1, height: 120 }}
            itemStyle={{height:120}}
            selectedValue={chosenVal}
            onValueChange={this.handlePickerValueChange}
          >
            {data.map(((currentValue, index) => {
              return (
                <Picker.Item label={currentValue} value={currentValue} key={index} />
              );
            }))}
          </Picker>
        </Animated.View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    alignSelf: 'flex-start',
    fontSize: 18,
    color: 'black',
    marginTop: 5,
  },
});
