import React from 'react';
import {
  StyleSheet, Animated, View, Text, DatePickerIOS, TouchableOpacity,
} from 'react-native';

export default class DatePicker extends React.Component {
  constructor(props) {
    super(props);
    this.minDate = new Date();
    this.closedHeight = 40;
    this.state = {
      chosenDate: this.minDate, height: new Animated.Value(this.closedHeight), opacity: new Animated.Value(0), expanded: false,
    };
    this.setDate = this.setDate.bind(this);
    this.dateFormat = { year: 'numeric', month: 'long', day: 'numeric' };
  }

  setDate(newDate) {
    this.setState({ chosenDate: newDate });
    this.props.onDateChangeMethod(newDate);
  }

  openPicker = (() => {
    const {
      height, opacity,
    } = this.state;

    this.setState({ expanded: true });
    Animated.parallel([
      Animated.timing(height, {
        toValue: 220,
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

  handleTextBlur = (() => {
    console.log('hello');
    
  });

  render() {
    const { reference, style, onFocus } = this.props;
    const {
      height, opacity, chosenDate, expanded,
    } = this.state;

    return (
      <Animated.View style={{ flex: 1, height }}>
        <TouchableOpacity 
          onPress={() => {
            if (expanded) {
              this.closePicker();
            } else {
              onFocus();
              this.openPicker();
            }
          }}
          onFocus={this.handleTextBlur}
          onBlur={this.handleTextBlur}
        >
          <Text style={styles.text}>
            {chosenDate.toLocaleDateString('en-US', this.dateFormat)}
          </Text>
        </TouchableOpacity>

        <Animated.View style={{ opacity }}>
          <DatePickerIOS
            ref={reference}
            style={{ flex: 1 }}
            date={chosenDate}
            onDateChange={this.setDate}
            mode="date"
            minimumDate={this.minDate}
          />
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