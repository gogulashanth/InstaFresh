/* eslint-disable react/no-multi-comp */
/* eslint-disable react/prefer-stateless-function */
import {
  Menu, MenuOptions, MenuOption, MenuTrigger, renderers,
} from 'react-native-popup-menu';
import React from 'react';
import {
  StyleSheet, View, Image, FlatList, TouchableOpacity,
} from 'react-native';
import colors from 'res/colors';
import { Icon, Text } from 'react-native-elements';


export class HeaderLogo extends React.Component {
  render() {
    return (
      <Image
        style={{ width: 200, height: 30 }}
        source={require('res/images/instafresh_logo_text_horiz.png')}
        resizeMode="contain"
      />
    );
  }
}

export class MenuButton extends React.Component {
  render() {
    const { onPress } = this.props;
    return (
      <TouchableOpacity onPress={onPress}>
        <Icon
          name="ios-menu"
          type="ionicon"
          color={colors.logo}
          iconStyle={styles.iconStyleLeft}
        />
      </TouchableOpacity>
    );
  }
}

export class PantryAddButton extends React.Component {
  render() {
    const { onPress } = this.props;
    return (
      <TouchableOpacity onPress={onPress}>
        <Icon
          name="ios-add"
          type="ionicon"
          color={colors.logo}
          iconStyle={styles.iconStyleRight}
        />
      </TouchableOpacity>
    );
  }
}

export class AddButton extends React.Component {
  render() {
    const { onManualAddPress, onAutoScanPress, onBarcodeScanPress } = this.props;
    return (
      <Menu renderer={renderers.Popover} rendererProps={{ placement: 'bottom', anchorStyle: styles.anchorStyle }}>
        <MenuTrigger customStyles={triggerStyles}>
          <Icon
            name="ios-add"
            type="ionicon"
            color={colors.logo}
          />
        </MenuTrigger>
        <MenuOptions customStyles={optionStyles}>
          <MenuOption onSelect={onManualAddPress} value={1}>
            <MenuOptionWithIcon text="Manual Add" iconName="ios-add-circle-outline" />
          </MenuOption>
          <MenuOption onSelect={onBarcodeScanPress} value={2}>
            <MenuOptionWithIcon text="Barcode Scan" iconName="ios-barcode" />
          </MenuOption>
          <MenuOption onSelect={onAutoScanPress} value={3}>
            <MenuOptionWithIcon text="AutoScan" iconName="ios-qr-scanner" />
          </MenuOption>
          
        </MenuOptions>
      </Menu>
    );
  }
}

class MenuOptionWithIcon extends React.PureComponent {
  render() {
    return (
      <View style={menuOptionStyles.container}>
        <Icon
          name={this.props.iconName}
          type="ionicon"
          color={colors.logo}
        />
        <Text style={menuOptionStyles.text}>{this.props.text}</Text>
      </View>
    );
  }
}

const menuOptionStyles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  text: {
    paddingLeft: 10,
  },
});
const triggerStyles = {
  triggerWrapper: {
    padding: 10,
  },
  TriggerTouchableComponent: TouchableOpacity,
};

const optionStyles = {
  optionsContainer: {
    backgroundColor: colors.darkerLogoBack,
    margin: 0,
    flex: 1,
    borderRadius: 10,
    alignItems: 'center',
    // borderColor: colors.logo,
    // borderWidth: 2,
  },
  optionWrapper: {
    marginTop: 1,
    marginBottom: 1,
    borderRadius: 10,
    backgroundColor: colors.darkerLogoBack,
  },
};

let styles = StyleSheet.create({
  anchorStyle: {
    backgroundColor: colors.darkerLogoBack,
    left: '40%',
  },
  iconStyleLeft: {
    paddingRight: 40,
    paddingLeft: 5,
    paddingTop: 5,
    paddingBottom: 5,
  },
  iconStyleRight: {
    paddingRight: 5,
    paddingLeft: 40,
    paddingTop: 5,
    paddingBottom: 5,
  },
});
