import React from 'react';
import {
  StyleSheet, Animated, View, Text, Picker, TouchableOpacity,
} from 'react-native';
import { Icon } from 'react-native-elements';
import colors from 'res/colors';

export default class CustomPicker extends React.Component {
  static defaultProps = {
    chosenIndex: 0,
  }

  constructor(props) {
    super(props);
    const { data, chosenID } = this.props;
    this.closedHeight = 35;

    const initialInd = data.map((e) => { return e.id; }).indexOf(chosenID);

    this.state = {
      chosenIndex: initialInd, height: new Animated.Value(this.closedHeight), opacity: new Animated.Value(0), expanded: false,
    };
  }

  handlePickerValueChange = ((itemValue, itemIndex) => {
    const { data } = this.props;
    const { onPickerChange } = this.props;

    this.setState({ chosenIndex: itemIndex });
    onPickerChange(data[itemIndex].id);
  });

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
        toValue: 140,
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
    const {
      height, opacity, chosenIndex, expanded,
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
          <View style={styles.header}>
            <Text style={styles.text}>
              {data[chosenIndex].name}
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

        <Animated.View style={{ opacity, flex:1 }}>
          <Picker
            style={{ flex: 1, height: 120 }}
            itemStyle={{height:120}}
            selectedValue={data[chosenIndex].id}
            onValueChange={this.handlePickerValueChange}
          >
            {data.map(((currentValue, index) => {
              return (
                <Picker.Item label={currentValue.name} value={currentValue.id} key={currentValue.id} />
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
