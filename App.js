/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React from 'react';
import { MenuProvider } from 'react-native-popup-menu';
import HomeScreen from 'screens/HomeScreen';
import InstaMenu from 'library/components/InstaMenu';
import PantriesScreen from 'screens/PantriesScreen';
import PantryScreen from 'screens/PantryScreen';
import ItemScreen from 'screens/ItemScreen';
import { createDrawerNavigator, createAppContainer, createStackNavigator } from 'react-navigation';
import colors from 'res/colors';

const defaultStackNavigationOptions = {
  headerStyle: {
    backgroundColor: colors.logoBack,
    borderBottomColor: 'transparent',
  },
  headerTintColor: colors.logo,
};

const HomeStack = createStackNavigator({
  Home: HomeScreen,
  Item: ItemScreen,
}, {
  defaultNavigationOptions: defaultStackNavigationOptions,
});

const PantriesStack = createStackNavigator({
  Pantry: PantriesScreen,
  PantryDetail: PantryScreen,
}, {
  defaultNavigationOptions: defaultStackNavigationOptions,
});

const AppNavigator = createDrawerNavigator({
  Home: HomeStack,
  Pantries: PantriesStack,
}, {
  contentComponent: InstaMenu,
});

const AppCont = createAppContainer(AppNavigator);

class App extends React.PureComponent {
  render() {
    return (
      <MenuProvider>
        <AppCont />
      </MenuProvider>
    );
  }
}

export default App;
