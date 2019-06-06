/* eslint-disable react/no-multi-comp */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable no-use-before-define */
import React from 'react';
import {
  StyleSheet, View, TouchableHighlight, TouchableOpacity, Image, SafeAreaView,
} from 'react-native';
import colors from 'res/colors';
import fonts from 'res/fonts';
import fontSize from 'res/fontSize';
import { Icon, Text } from 'react-native-elements';
import { NavigationActions } from 'react-navigation';

export default class InstaMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = { currentScreen: props.navigation.state.routeName };
  }

  navigateToScreen = route => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route,
    });
    this.props.navigation.dispatch(navigateAction);
  }

  render() {
    const selectedIndex = this.props.navigation.state.index;
  
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.logoBack }}>
        <View style={[styles.menuContainer]}>
          <Image
            style={{
              height: 140, width: 200, alignSelf: 'center', marginBottom: 40,
            }}
            source={require('res/images/instafresh_logo_text_bottom.png')}
          />
          <MenuItem index={0} selectedIndex={selectedIndex} name="Home" iconName="ios-home" onPress={this.navigateToScreen('Home')} />
          <MenuItem index={1} selectedIndex={selectedIndex} name="Pantries" iconName="ios-archive" onPress={this.navigateToScreen('Pantries')} />
          <MenuItem index={2} selectedIndex={selectedIndex} name="Recipes" iconName="ios-book" onPress={this.navigateToScreen('Recipes')} />
          <MenuItem index={3} selectedIndex={selectedIndex} name="InstaScore" iconName="ios-stats" onPress={this.navigateToScreen('InstaScore')} />
          <MenuItem index={4} selectedIndex={selectedIndex} name="Settings" iconName="ios-cog" onPress={this.navigateToScreen('Settings')} />
          <View style={styles.bottomRow}>
            <MenuItemIcon index={5} selectedIndex={selectedIndex} iconName="ios-alert" onPress={this.navigateToScreen('Disclaimer')} />
            <MenuItemIcon index={6} selectedIndex={selectedIndex} iconName="ios-help-circle" onPress={this.navigateToScreen('Help')} />
            <MenuItemIcon index={7} selectedIndex={selectedIndex} iconName="ios-information-circle" onPress={this.navigateToScreen('About')} />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

class MenuItem extends React.Component {
  render() {
    const { onPress, iconName, name, index, selectedIndex } = this.props;
    let selectedTextStyle = {};
    let iconColor = colors.text;
    if (selectedIndex === index) {
      selectedTextStyle = { color: colors.logo };
      iconColor = colors.logo;
    }
    return (
      <TouchableHighlight onPress={onPress} style={{ flex: 0, height: 50 }} underlayColor={colors.darkerLogoBack}>
        <View style={styles.container}>
          <Icon
            name={iconName}
            type="ionicon"
            color={iconColor}
          />
          <Text style={{ ...styles.menuItemText, ...selectedTextStyle }}>{name}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

class MenuItemIcon extends React.Component {
  render() {
    const { onPress, iconName, index, selectedIndex } = this.props;
    
    let iconColor = colors.text;
    if (selectedIndex === index) {
      iconColor = colors.logo;
    }
    return (
      <TouchableOpacity onPress={onPress} style={{ flex: 1 }}>
        <Icon
          name={iconName}
          type="ionicon"
          color={iconColor}
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
