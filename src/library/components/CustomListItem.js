import React from 'react';
import {
  StyleSheet, View, Platform, TouchableHighlight,TouchableOpacity, Dimensions,
} from 'react-native';
import {
  withTheme, Avatar, Text, Icon, Image,
} from 'react-native-elements';
import colors from 'res/colors';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  textContainer: {
    flex: 1,
    paddingLeft: 16,
    // height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    flex: 3,
    fontSize: 17,
    color: colors.text,
    textAlign: 'left',
  },
  subtitle: {
    flex: 1,
    fontSize: 12,
    opacity: 1,
    color: colors.text,
    textAlign: 'left',
  },
  subsubtitle: {
    flex: 1,
    fontSize: 12,
    opacity: 0.5,
    color: colors.text,
    textAlign: 'left',
  },
});

const chevronDefaultProps = {
  type: Platform.OS === 'ios' ? 'ionicon' : 'material',
  color: colors.text,
  name: Platform.OS === 'ios' ? 'ios-arrow-forward' : 'keyboard-arrow-right',
  size: 16,
};

const defaultShadowProps = {
  shadowOffset: { width: 10, height: 10 },
  shadowRadius: 10,
  shadowColor: '#000000',
  shadowOpacity: 0.6,
};


class CustomListItem extends React.Component {
  render() {
    const {
      containerStyle,
      textContainerStyle,
      titleStyle,
      subtitleStyle,
      subsubtitleStyle,
      imageURI,
      title,
      subtitle,
      subsubtitle,
      onPress,
      leftAvatar,
      swipeLeft,
    } = this.props;

    let textContainerSpecialStyle = null;
    let titleSpecialStyle = null;

    if (subtitle === undefined && subsubtitle === undefined) {
      textContainerSpecialStyle = {
        justifyContent: 'center',
      };
      titleSpecialStyle = {
        flex: 0,
      };
    }
    return (
      <TouchableOpacity activeOpacity={0.8} style={{ ...{ flex: 1 } }} onPress={onPress}>
        <View style={{ ...styles.containerStyle, ...containerStyle }}>
          {(leftAvatar !== undefined) && (
          <Avatar rounded {...leftAvatar} />
          )}
          <View style={{ ...styles.textContainer, ...textContainerStyle, ...textContainerSpecialStyle }}>
            <Text h3 numberOfLines={1} ellipsizeMode="tail" style={{ ...styles.title, ...titleStyle, ...titleSpecialStyle }}>
              {title}
            </Text>

            {(subtitle !== undefined) && (
              <Text h4 numberOfLines={1} ellipsizeMode="tail" h4Style={{ ...styles.subtitle, ...subtitleStyle }}>
                {subtitle}
              </Text>
            )}
            
            {(subsubtitle !== undefined) && (
              <Text h4 numberOfLines={1} ellipsizeMode="tail" h4Style={{ ...styles.subsubtitle, ...subsubtitleStyle }}>
                {subsubtitle}
              </Text>
            )}
          </View>

          <Icon {...chevronDefaultProps} />

        </View>
      </TouchableOpacity>
    );
  }
}

export default withTheme(CustomListItem, 'CustomListItem');
