import React from 'react';
import {
  StyleSheet, View, Platform, TouchableHighlight,TouchableOpacity, Dimensions,
} from 'react-native';
import { CachedImage } from 'react-native-cached-image';
import {
  withTheme, Avatar, Text, Icon, Image,
} from 'react-native-elements';
import colors from 'res/colors';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  containerStyle: {
    width: (width - 60) / 2,
    // overflow: 'hidden',
    height: 200,
    borderRadius: 10,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: colors.logoBack,
  },
  textContainer: {
    flex: 1,
    padding: 5,
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    flex: 3,
    color: colors.text,
    textAlign: 'center',
    alignSelf: 'center',
  },
  subtitle: {
    flex: 1,
    opacity: 0.5,
    color: colors.text,
    textAlign: 'left',
  },
  subsubtitle: {
    flex: 1,
    opacity: 0.5,
    color: colors.text,
    textAlign: 'left',
  },
  image: {
    flex: 1.3,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
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


class RecipeListItem extends React.Component {
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
    } = this.props;

    return (
      <TouchableOpacity activeOpacity={0.8} style={{ ...{ flex: 1 } }} onPress={onPress}>
        <View style={{ ...styles.containerStyle, ...defaultShadowProps, ...containerStyle }}>
          <CachedImage
            source={{ uri: imageURI }}
            style={styles.image}
          />
          <View style={{ ...styles.textContainer, ...textContainerStyle }}>
            <Text h3 numberOfLines={2} ellipsizeMode="tail" h3Style={{ ...styles.title, ...titleStyle }}>
              {title}
            </Text>
            <Text h4 numberOfLines={1} ellipsizeMode="tail" h4Style={{ ...styles.subtitle, ...subsubtitleStyle }}>
              {subtitle}
            </Text>
            {(subsubtitle !== undefined) && (
              <Text h4 numberOfLines={1} ellipsizeMode="tail" h4Style={{ ...styles.subsubtitle, ...subsubtitleStyle }}>
                {subsubtitle}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

export default withTheme(RecipeListItem, 'RecipeListItem');
