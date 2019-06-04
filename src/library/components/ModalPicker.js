import React from 'react';
import {
  StyleSheet, View, Picker, Button,
} from 'react-native';
import colors from 'res/colors';

export default class ModalPicker extends React.Component {
  constructor(props) {
    super(props);
    const { data } = this.props;
    this.state = { visible: false, selectedValue: data[0] };
  }

  render() {
    const { onConfirm, onCancel, data, visible } = this.props;
    const { selectedValue } = this.state;
    return (
      <View style={styles.mainContainer}>
        <View style={styles.backDrop} />
        <View style={styles.subContainer}>
          <View style={styles.buttonContainer}>
            <Button onPress={onCancel} title="Cancel" color={colors.logo} />
            <Button onPress={onConfirm} title="Confirm" color={colors.logo} />
          </View>

          <Picker
            style={{ flex: 1 }}
            selectedValue={selectedValue}
            onValueChange={(itemValue, itemIndex) => {
              this.setState({ selectedValue: itemValue });
            }}
          >
            {data.map((item, index) => (
                <Picker.Item
                  label={item}
                  value={item}
                  key={index}
                />
              ))}
          </Picker>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'rgba(100,100,100,0.5)',
  },
  buttonContainer: {
    flex: 0,
    height: 40,
    backgroundColor: colors.logoBack,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backDrop: {
    backgroundColor: 'transparent',
    flex: 1.5,
  },
  subContainer: {
    flex: 1,
  },
});
