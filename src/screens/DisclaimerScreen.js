import {
  Image, View, Text, StyleSheet,
} from 'react-native';
import colors from 'res/colors';
import { HeaderLogo, MenuButton } from 'library/components/HeaderItems';
import React from 'react';
import Licenses from 'library/components/Licenses';

import Data from 'res/licenses';

function extractNameFromGithubUrl(url) {
  if (!url) {
    return null;
  }

  const reg = /((https?:\/\/)?(www\.)?github\.com\/)?(@|#!\/)?([A-Za-z0-9_]{1,15})(\/([-a-z]{1,20}))?/i;
  const components = reg.exec(url);

  if (components && components.length > 5) {
    return components[5];
  }
  return null;
}

function sortDataByKey(data, key) {
  data.sort((a, b) => (a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0));
  return data;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const licenses = Object.keys(Data).map((key) => {
  const { licenses, ...license } = Data[key];
  const splitSlash = key.split('/');
  const modKey = splitSlash.length > 1 ? splitSlash[1] : splitSlash[0];
  const [name, version] = modKey.split('@');

  const reg = /((https?:\/\/)?(www\.)?github\.com\/)?(@|#!\/)?([A-Za-z0-9_]{1,15})(\/([-a-z]{1,20}))?/i;
  let username = extractNameFromGithubUrl(license.repository)
    || extractNameFromGithubUrl(license.licenseUrl);

  let userUrl;
  let image;
  if (username) {
    username = capitalizeFirstLetter(username);
    image = `http://github.com/${username}.png`;
    userUrl = `http://github.com/${username}`;
  }

  return {
    key,
    name,
    image,
    userUrl,
    username,
    licenses: licenses.slice(0, 405),
    version,
    ...license,
  };
});

sortDataByKey(licenses, 'username');


export default class DisclaimerScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Licenses',
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
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <Licenses
          licenses={licenses}
          licenseClicked={item => navigation.push('LicenseDetail', { license: item })}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkerLogoBack,
    paddingTop: 2,
  },
});
