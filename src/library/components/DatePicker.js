import React from 'react';
import {
  StyleSheet, Animated, View, Text, DatePickerIOS, TouchableOpacity,
} from 'react-native';
import colors from 'res/colors';
import { Icon } from 'react-native-elements';

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

  focus = (() => {
    this.openPicker();
  });

  openPicker = (() => {
    const {
      height, opacity,
    } = this.state;

    this.setState({ expanded: true });
    Animated.sequence([
      Animated.timing(height, {
        toValue: 220,
        duration: 200,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 1,
      }),
    ]).start();
  });

  closePicker = (() => {
    const {
      height, opacity,
    } = this.state;
    this.setState({ expanded: false });
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 1,
      }),
      Animated.timing(height, {
        toValue: this.closedHeight,
        duration: 200,
      }),
    ]).start();
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
          <View style={styles.header}>
            <Text style={styles.text}>
              {chosenDate.toLocaleDateString('en-US', this.dateFormat)}
            </Text>
            {!expanded
                && (
                <Icon
                  name="ios-arrow-dropdown-circle"
                  type="ionicon"
                  color={colors.logo}
                  size={18}
                />
                )
              }
            {expanded
                && (
                <Icon
                  name="ios-arrow-dropup-circle"
                  type="ionicon"
                  color={colors.logo}
                  size={18}
                />
                )
              }
          </View>
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
    color: colors.logoBack,
    marginTop: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 0,
  },
});
