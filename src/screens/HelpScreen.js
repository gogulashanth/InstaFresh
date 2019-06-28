import React from 'react';
import {
  Image, View, StyleSheet, FlatList,
} from 'react-native';
import { Text, Icon } from 'react-native-elements';
import colors from 'res/colors';
import dataInstance from 'model/Data';
import Accordion from 'react-native-collapsible/Accordion';

import { HeaderLogo, MenuButton } from 'library/components/HeaderItems';

export default class HelpScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Help',
    headerLeft: <MenuButton onPress={navigation.getParam('handleMenuButtonClick')} />,
  });

  constructor(props) {
    super(props);
    this._data = dataInstance.getHelpData();
    this.state = { activeSection: [] };
  }

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

  _renderHeader = ((section, index, isActive) => (
    <View style={styles.helpTitle}>
      <Text h4 h4Style={{ fontWeight: 'bold' }}>{section.title}</Text>
      {!isActive
        && (
        <Icon
          name="ios-arrow-dropdown-circle"
          type="ionicon"
          color={colors.text}
          size={18}
        />
        )
      }
      {isActive
        && (
        <Icon
          name="ios-arrow-dropup-circle"
          type="ionicon"
          color={colors.text}
          size={18}
        />
        )
      }

    </View>
  ));

  _renderContent = (section => (
    <View style={styles.helpContent}>
      <Text h4>{section.content.text}</Text>
    </View>
  ));

  render() {
    const { activeSection } = this.state;
    return (
      <View style={styles.container}>
        <Accordion
          sections={this._data}
          activeSections={activeSection}
          renderHeader={this._renderHeader}
          renderContent={this._renderContent}
          onChange={section => this.setState({ activeSection: section })}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkerLogoBack,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
  },
  helpContent: {
    padding: 20,
    backgroundColor: colors.logoBack,
  },
  helpTitle: {
    borderTopWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: colors.logoBack,
    padding: 20,
    backgroundColor: colors.darkerLogoBack,
  },
});
