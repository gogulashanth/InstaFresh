import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import colors from 'res/colors';
import fonts from 'res/fonts';
import fontSize from 'res/fontSize';
import {Icon} from 'react-native-elements';


export default class InstaMenu extends React.Component {
    render() {
        return(
            <View style={[styles.menuContainer]}>
                <MenuItem name='Home' iconName='ios-home'/>
                <MenuItem name='Pantries' iconName='ios-archive'/>
                <MenuItem name='Recipes' iconName='ios-book'/>
                <MenuItem name='InstaScore' iconName='ios-stats'/>
                <MenuItem name='Settings' iconName='ios-cog'/>
                <View style={styles.bottomRow}>
                    <MenuItemIcon iconName='ios-alert'/>
                    <MenuItemIcon iconName='ios-help-circle'/>
                    <MenuItemIcon iconName='ios-information-circle'/>
                </View>

            </View>
        );
    }
}

class MenuItem extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Icon name={this.props.iconName}
                type='ionicon' 
                color= {colors.text}
                />
                <Text style={styles.menuItemText}>{this.props.name}</Text>
            </View>
        )
    }
}

class MenuItemIcon extends React.Component {
    render() {
        return (
            <View style={{flex:1}}>
                <Icon name={this.props.iconName}
                type='ionicon' 
                color= {colors.text}
                />
            </View>
        )
    }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    flexBasis: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
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
    justifyContent: 'flex-start',
    paddingTop: 50,
  },
  bottomRow: {
    flex: 10,
    width: '100%',
    flexDirection: 'row',
    flexBasis: 'auto',
    alignItems: 'center',
    alignSelf: 'center',
    alignContent: 'space-around',
  },
});
