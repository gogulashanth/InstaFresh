/* eslint-disable react/no-multi-comp */
/* eslint-disable react/prefer-stateless-function */
import {
 Menu, MenuOptions, MenuOption, MenuTrigger, renderers 
} from 'react-native-popup-menu';
import React from 'react';
import {
 StyleSheet, View, Text, Image, FlatList, TouchableOpacity
} from 'react-native';
import colors from 'res/colors';
import { Icon } from 'react-native-elements';


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
    const { handleManualAddClick } = this.props;
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
          <MenuOption onSelect={handleManualAddClick} value={1} text="Manual Add" />
          <MenuOption value={2} text="AutoScan" />
          <MenuOption value={2} text="Barcode Scan" />
        </MenuOptions>
      </Menu>
    );
  }
}

const triggerStyles = {
  triggerWrapper: {
    padding: 10,
  },
  TriggerTouchableComponent: TouchableOpacity,
};

const optionStyles = {
  optionsContainer: {
    backgroundColor: colors.lighterLogoBack,
    margin: 0,
    flex: 1,
    flexBasis: 'auto',
    width: 120,
    borderRadius: 10,
    alignItems: 'center',
  },
  optionWrapper: {
    marginTop: 1,
    marginBottom: 1,
    backgroundColor: colors.lighterLogoBack,
  },
  optionText: {
    color: colors.text,
  },
};

let styles = StyleSheet.create({
  anchorStyle: {
    backgroundColor: colors.lighterLogoBack,
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
