/* eslint-disable react/prefer-stateless-function */
/* eslint-disable keyword-spacing */
/* eslint-disable react/no-multi-comp */
import React from 'react';
import {
  StyleSheet, View, Animated, Easing,
} from 'react-native';
import colors from 'res/colors';
import ThemedFlatList from 'library/components/ThemedFlatList';
import { MenuButton } from 'library/components/HeaderItems';
import CustomListItem from 'library/components/CustomListItem';


export default class AboutScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Info',
    headerLeft: <MenuButton onPress={navigation.getParam('handleMenuButtonClick')} />,

  });

  constructor(props) {
    super(props);
    this.data = [
      { key: '1', title: 'About App' },
      { key: '2', title: 'Privacy Policy' },
      { key: '3', title: 'Licenses' },
    ];
  }

  componentWillMount() {
    const { navigation } = this.props;
    navigation.setParams({
      handleMenuButtonClick: this._handleMenuButtonClick,
    });
  }

  componentWillUnmount() {
  }

  _handleMenuButtonClick = (() => {
    const { navigation } = this.props;
    navigation.toggleDrawer();
  });

  _handleItemClick = ((item) => {
    const { navigation } = this.props;

    switch (item.title) {
      case 'About App':
        navigation.navigate('About');
        break;

      case 'Privacy Policy':
        navigation.push('UrlView', { title: 'Privacy Policy', url: 'https://instafresh.flycricket.io/privacy.html' });
        break;

      case 'Licenses':
        navigation.navigate('License');
        break;

      default:
        break;
    }
  });

  _renderItem = ((data) => {
    const { item } = data;

    let iconName = null;

    switch (item.title) {
      case 'About App':
        iconName = 'ios-help';
        break;

      case 'Privacy Policy':
        iconName = 'ios-paper';
        break;

      case 'Licenses':
        iconName = 'ios-filing';
        break;

      default:
        iconName = 'ios-home';
        break;
    }
    return (
      <CustomListItem
        title={item.title}
        leftAvatar={{ avatarStyle: { backgroundColor: colors.logo }, icon: { name: iconName, type: 'ionicon' } }}
        onPress={() => this._handleItemClick(item)}
      />
    );
  });

  render() {
    return (
      <View style={styles.container}>
        <ThemedFlatList
          data={this.data}
          renderItem={this._renderItem}
          style={{ marginLeft: 5 }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkerLogoBack,
    padding: 10,
  },
});
