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
import { ThemeProvider } from 'react-native-elements';
import themes from 'res/themes';
import AboutScreen from 'screens/AboutScreen';
import HelpScreen from 'screens/HelpScreen';
import DisclaimerScreen from 'screens/DisclaimerScreen';
import RecipesScreen from 'screens/RecipesScreen';
import SettingsScreen from 'screens/SettingsScreen';
import InstaScoreScreen from 'screens/InstaScoreScreen';

const defaultStackNavigationOptions = {
  headerStyle: {
    backgroundColor: colors.logoBack,
    borderBottomColor: 'transparent',
  },
  headerTintColor: colors.logo,
  headerTitleStyle: {color: colors.text},
};

const HomeStack = createStackNavigator({
  Home: HomeScreen,
  Item: ItemScreen,
}, {
  defaultNavigationOptions: defaultStackNavigationOptions,
});

const AboutStack = createStackNavigator({
  About: AboutScreen,
}, {
  defaultNavigationOptions: defaultStackNavigationOptions,
});

const HelpStack = createStackNavigator({
  Help: HelpScreen,
}, {
  defaultNavigationOptions: defaultStackNavigationOptions,
});

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
}, {
  defaultNavigationOptions: defaultStackNavigationOptions,
});

const InstaScoreStack = createStackNavigator({
  InstaScore: InstaScoreScreen,
}, {
  defaultNavigationOptions: defaultStackNavigationOptions,
});

const RecipesStack = createStackNavigator({
  Recipes: RecipesScreen,
}, {
  defaultNavigationOptions: defaultStackNavigationOptions,
});

const DisclaimerStack = createStackNavigator({
  Disclaimer: DisclaimerScreen,
}, {
  defaultNavigationOptions: defaultStackNavigationOptions,
});

const PantriesStack = createStackNavigator({
  Pantry: PantriesScreen,
  PantryDetail: PantryScreen,
  Item: ItemScreen,
}, {
  defaultNavigationOptions: defaultStackNavigationOptions,
});

HomeStack.navigationOptions = ({ navigation }) => {
  let drawerLockMode = 'unlocked';
  if (navigation.state.index > 0) {
    drawerLockMode = 'locked-closed';
  }

  return {
    drawerLockMode,
  };
};

PantriesStack.navigationOptions = ({ navigation }) => {
  let drawerLockMode = 'unlocked';
  if (navigation.state.index > 0) {
    drawerLockMode = 'locked-closed';
  }

  return {
    drawerLockMode,
  };
};

const AppNavigator = createDrawerNavigator({
  Home: HomeStack,
  Pantries: PantriesStack,
  Recipes: RecipesStack,
  InstaScore: InstaScoreStack,
  Settings: SettingsStack,
  Disclaimer: DisclaimerStack,
  Help: HelpStack,
  About: AboutStack,
}, {
  contentComponent: InstaMenu,
});

const AppCont = createAppContainer(AppNavigator);

class App extends React.PureComponent {
  render() {
    return (
      <ThemeProvider theme={themes.dark}>
        <MenuProvider>
          <AppCont />
        </MenuProvider>
      </ThemeProvider>
    );
  }
}

export default App;
