/* eslint-disable react/no-multi-comp */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable no-use-before-define */
import React from 'react';
import {
  StyleSheet, View, Text, TouchableHighlight, TouchableOpacity, Image, SafeAreaView,
} from 'react-native';
import colors from 'res/colors';
import fonts from 'res/fonts';
import fontSize from 'res/fontSize';
import { Icon } from 'react-native-elements';
import { NavigationActions } from 'react-navigation';

export default class InstaMenu extends React.Component {
  navigateToScreen = route => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route,
    });
    this.props.navigation.dispatch(navigateAction);
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.logoBack }}>
        <View style={[styles.menuContainer]}>
          <Image
style={{
 height: 140, width: 200, alignSelf: 'center', marginBottom: 40 
}}
source={require('res/images/instafresh_logo_text_bottom.png')}
          />
          <MenuItem name="Home" iconName="ios-home" onPress={this.navigateToScreen('Home')} />
          <MenuItem name="Pantries" iconName="ios-archive" onPress={this.navigateToScreen('Pantries')} />
          <MenuItem name="Recipes" iconName="ios-book" onPress={this.navigateToScreen('Recipes')} />
          <MenuItem name="InstaScore" iconName="ios-stats" onPress={this.navigateToScreen('InstaScore')} />
          <MenuItem name="Settings" iconName="ios-cog" onPress={this.navigateToScreen('Settings')} />
          <View style={styles.bottomRow}>
            <MenuItemIcon iconName="ios-alert" onPress={this.navigateToScreen('Disclaimer')} />
            <MenuItemIcon iconName="ios-help-circle" onPress={this.navigateToScreen('Help')} />
            <MenuItemIcon iconName="ios-information-circle" onPress={this.navigateToScreen('About')} />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

class MenuItem extends React.Component {
  render() {
    const { onPress } = this.props;
    return (
      <TouchableHighlight onPress={onPress} style={{ flex: 0, height: 50 }} underlayColor={colors.darkerLogoBack}>
        <View style={styles.container}>
          <Icon
            name={this.props.iconName}
            type="ionicon"
            color={colors.text}
          />
          <Text style={styles.menuItemText}>{this.props.name}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

class MenuItemIcon extends React.Component {
  render() {
    const { onPress } = this.props;
    return (
      <TouchableOpacity onPress={onPress} style={{ flex: 1 }}>
        <Icon
          name={this.props.iconName}
          type="ionicon"
          color={colors.text}
        />
      </TouchableOpacity>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 0,
    paddingLeft: 20,
  },
  menuItemText: {
    fontFamily: fonts.heading,
    fontSize: fontSize.menu,
    color: colors.text,
    textAlign: 'left',
    paddingLeft: 20,
    flex: 1,
  },
  menuContainer: {
    backgroundColor: colors.logoBack,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingTop: 50,
  },
  bottomRow: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-around',
    alignContent: 'space-around',
  },
});
