import React from 'react';
import {
  StyleSheet, View, Image, Dimensions,
} from 'react-native';
import {
  Text,
} from 'react-native-elements';
import colors from 'res/colors';
import fontSize from 'res/fontSize';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default class InfoBox extends React.PureComponent {
  render() {
    const { title, subtitle, imageSource, style = {} } = this.props;
    return (
      <View style={{...styles.container, ...style}}>
        <Image source={imageSource} style={styles.image} />
        <Text style={styles.title}>
          {title}
        </Text>
        <Text style={styles.subtitle}>
          {subtitle}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: windowHeight - 200,
    backgroundColor: colors.darkerLogoBack,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: 150,
    width: 150,
    tintColor: colors.logoBack,
  },
  title: {
    padding: 10,
    color: colors.text,
    fontSize: fontSize.h3,
    textAlign: 'center',
    width: windowWidth / 1.3,
  },
  subtitle: {
    padding: 10,
    color: colors.text,
    fontSize: fontSize.h4,
    opacity: 0.5,
    textAlign: 'center',
    width: windowWidth / 2,
  },
});
