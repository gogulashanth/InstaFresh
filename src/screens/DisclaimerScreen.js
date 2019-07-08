/* eslint-disable react/prefer-stateless-function */
/* eslint-disable keyword-spacing */
/* eslint-disable react/no-multi-comp */
import React from 'react';
import {
  StyleSheet, View,
} from 'react-native';
import { Text } from 'react-native-elements';
import colors from 'res/colors';
import { MenuButton } from 'library/components/HeaderItems';


export default class DisclaimerScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Disclaimer',
    headerLeft: <MenuButton onPress={navigation.getParam('handleMenuButtonClick')} />,

  });


  componentWillMount() {
    const { navigation } = this.props;
    navigation.setParams({
      handleMenuButtonClick: this._handleMenuButtonClick,
    });
  }

  _handleMenuButtonClick = (() => {
    const { navigation } = this.props;
    navigation.toggleDrawer();
  });


  render() {
    return (
      <View style={styles.container}>
        <Text h3>
          THIS APP MAY PROVIDE INFORMATION RELATED TO NUTRITION,
          DIETS AND EXPIRY DATES AND IS INTENDED FOR YOUR PERSONAL USE
          AND INFORMATIONAL PURPOSES ONLY. UNDER NO CIRCUMSTANCES SHALL
          COMPANY OR ITS AFFILIATES, PARTNERS, SUPPLIERS OR LICENSORS
          BE LIABLE FOR ANY INDIRECT OR CONSEQUENTIAL DAMAGES ARISING
          OUT OF OR IN CONNECTION WITH YOUR USE OF THIS APPLICATION.
          YOUR USE OF THIS APP IS SOLELY AT YOUR OWN RISK.
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkerLogoBack,
    padding: 20,
  },
});
