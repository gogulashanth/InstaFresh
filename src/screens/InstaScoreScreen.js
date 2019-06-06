import React from 'react';
import {
  Image, View,
} from 'react-native';
import colors from 'res/colors';

import { MenuButton } from 'library/components/HeaderItems';

export default class InstaScoreScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'InstaScore',
    headerLeft: <MenuButton onPress={navigation.getParam('handleMenuButtonClick')} />,
  });

  componentWillMount() {
    const { navigation } = this.props;
    navigation.setParams({
      handleMenuButtonClick: this.handleMenuButtonClick,
    });
  }

  handleMenuButtonClick = (() => {
    const { navigation } = this.props;
    navigation.toggleDrawer();
  });

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: colors.darkerLogoBack, alignItems: 'center', justifyContent: 'center',padding: 20 }}>
        {/* <Image resizeMode="center" style={{ flex: 1 }} source={require('res/images/instafresh_about.png')} /> */}
      </View>
    );
  }
}
