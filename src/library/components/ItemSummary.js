import React from 'react';
import { StyleSheet, Platform, View, Text, Image } from 'react-native';
import PropTypes from 'prop-types';
import palette from 'res/palette';
import colors from 'res/colors';

export default class ItemSummary extends React.Component {
  render() {
    return (
      <View style = {[styles.background, this.props.style]}>
        <Image 
          source = {{uri: this.props.imageURI}} 
          style={styles.image}
        />
        <View style = {styles.content}>
          <Text style = {styles.heading}> {this.props.title} </Text>
          <Text style = {[styles.description,this.props.description1Style]}> {this.props.description1} </Text>   
          <Text style = {[styles.description,this.props.description2Style]}> {this.props.description2} </Text>   
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    resizeMode: 'cover',
    flex: 1,
  },
  background: {
    backgroundColor: colors.logoBack,
    borderRadius: 10,
    overflow: 'hidden',
    flex: 0,
    flexDirection: 'row',
    height: 90,
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
      paddingLeft: 5,
      paddingTop: 5.0,
    },
  },
  description: {
    ...palette.text,
    ...{
      flex: 1,
      paddingLeft: 5,
    },
  },
});
