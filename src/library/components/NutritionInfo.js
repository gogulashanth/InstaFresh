import React from 'react';
import {
  StyleSheet, Platform, View, Text, Image, Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import { Divider } from 'react-native-elements';

const widthConversion = Dimensions.get('window').width * 0.0018;

export default class NutritionInfo extends React.Component {
  constructor(props) {
    super(props);
    this.dividerColor = '#011023';
  }

  render() {
    return (
      <View style={[styles.background, this.props.style]}>
        <Text style={styles.heading}>Nutrition Facts</Text>
        <Divider style={{ backgroundColor: this.dividerColor, height: 1 }} />
        <NutritionItem name="Serving Size" percent="1 Apple" style={{ fontWeight: 'bold', fontSize: 13 * widthConversion }} />
        <Divider style={{ backgroundColor: this.dividerColor, height: 6 }} />
        <NutritionItem name="Calories" percent="60" style={{ fontWeight: 'bold', fontSize: 21 * widthConversion }} />
        <Divider style={{ backgroundColor: this.dividerColor, height: 3 }} />
        <NutritionItem percent="% Daily Value" style={{ fontWeight: 'bold', fontSize: 12 * widthConversion }} />
        <Divider style={{ backgroundColor: this.dividerColor, height: 0.25 }} />
        <NutritionItem name="Total Fat" value="1mg" percent="1%" style={{ fontWeight: 'bold' }} />
        <Divider style={{ backgroundColor: this.dividerColor, height: 0.5 }} />
        <NutritionItem name="Saturated fat" value="2mg" percent="2%" shift={10} />
        <Divider style={{ backgroundColor: this.dividerColor, height: 0.5 }} />
        <NutritionItem name="Trans fat" value="2mg" percent="2%" shift={10} />
        <Divider style={{ backgroundColor: this.dividerColor, height: 0.5 }} />
        <NutritionItem name="Cholesterol" value="0mg" percent="1%" style={{ fontWeight: 'bold' }} />
        <Divider style={{ backgroundColor: this.dividerColor, height: 0.5 }} />
        <NutritionItem name="Sodium" value="60mg" percent="3%" style={{ fontWeight: 'bold' }} />
        <Divider style={{ backgroundColor: this.dividerColor, height: 0.5 }} />
        <NutritionItem name="Total Carbohydrate" value="21g" percent="8%" style={{ fontWeight: 'bold' }} />
        <Divider style={{ backgroundColor: this.dividerColor, height: 0.5 }} />
        <NutritionItem name="Dietary Fibre" value="3g" percent="11%" shift={10} />
        <Divider style={{ backgroundColor: this.dividerColor, height: 0.5 }} />
        <NutritionItem name="Total Sugars" value="15g" percent="10%" shift={10} />
        <Divider style={{ backgroundColor: this.dividerColor, height: 0.5 }} />
        <NutritionItem name="Protein" value="3g" percent="3%" style={{ fontWeight: 'bold' }} />
        <Divider style={{ backgroundColor: this.dividerColor, height: 6 }} />
        <NutritionItem name="Vitamin A" value="3g" percent="3%" />
        <Divider style={{ backgroundColor: this.dividerColor, height: 0.5 }} />
        <NutritionItem name="Vitamin C" value="2g" percent="3%" />
        <Divider style={{ backgroundColor: this.dividerColor, height: 0.5 }} />
        <NutritionItem name="Calcium" value="3g" percent="3%" />
        <Divider style={{ backgroundColor: this.dividerColor, height: 0.5 }} />
        <NutritionItem name="Iron" value="3g" percent="3%" />
        <Divider style={{ backgroundColor: this.dividerColor, height: 0.5 }} />
        <NutritionItem style={{ fontSize: 13 * widthConversion }} name="The % Daily Value tells you how much a nutrient in a serving of food contributes to a daily diet. 2000 calories a day is used for general nutrition advice." />
      </View>
    );
  }
}

class NutritionItem extends React.Component {
  render() {
    return (
      <View style={styles.bothEnds}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={[styles.description, this.props.style, { paddingLeft: this.props.shift, paddingRight: 5 }]}>{this.props.name}</Text>
          <Text style={[styles.description]}>{this.props.value}</Text>
        </View>
        <Text style={[styles.description, this.props.style, { fontWeight: 'bold' }]}>{this.props.percent}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bothEnds: {
    flexDirection: 'row',
    flexBasis: 'auto',
    justifyContent: 'space-between',
    paddingBottom: 1,
  },
  background: {
    backgroundColor: '#fffeed',
    flexBasis: 'auto',
    borderColor: '#011023',
    borderWidth: 3,
    paddingLeft: 2,
    paddingRight: 2,
    maxWidth: 350* widthConversion,
  },
  heading: {
    fontFamily: 'Helvetica',
    fontSize: 36 * widthConversion,
    fontWeight: 'bold',
    color: '#011023',
    paddingTop: 4,
  },
  description: {
    fontFamily: 'Helvetica',
    fontSize: 13 * widthConversion,
    color: '#011023',
    padding: 2,
  },
});
