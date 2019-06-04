import React from 'react';
import {
  StyleSheet, Platform, View, Text, Image, TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import palette from 'res/palette';
import colors from 'res/colors';

export default class ItemSummary extends React.Component {
  render() {
    const {
      id, title, imageURI, description1, description1Style, description2, description2Style, style, onPressItem,
    } = this.props;
    return (
      <TouchableOpacity style={[styles.background, style]} onPress={() => onPressItem(id)}>
        
        <View style={styles.content}>
          <Text style={styles.heading}>
            {title}
          </Text>
          <Text style={[styles.description, description1Style]}>
            {description1}
          </Text>
          <Text style={[styles.description, description2Style]}>
            {description2}
          </Text>
        </View>
        <Image
          source={{ uri: imageURI }}
          style={styles.image}
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    resizeMode: 'cover',
    flex: 0,
    margin: 8,
    width: 84,
    height: 84,
    borderRadius: 8,
  },
  background: {
    backgroundColor: colors.logoBack,
    borderRadius: 10,
    overflow: 'hidden',
    flex: 0,
    flexDirection: 'row',
    height: 100,
    margin: 10,
    width: '90%',
  },
  content: {
    flex: 2,
    flexDirection: 'column',
  },
  heading: {
    ...palette.heading,
    ...{
      flex: 1.3,
      paddingLeft: 10,
      paddingTop: 5.0,
    },
  },
  description: {
    ...palette.text,
    ...{
      flex: 1,
      paddingLeft: 10,
    },
  },
});
