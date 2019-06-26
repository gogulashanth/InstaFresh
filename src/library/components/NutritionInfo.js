import React from 'react';
import {
  StyleSheet, Platform, View, Image, Dimensions
} from 'react-native';
import PropTypes from 'prop-types';
import { Divider, Text } from 'react-native-elements';

const widthConversion = Dimensions.get('window').width * 0.0018;

export default class NutritionInfo extends React.Component {
  constructor(props) {
    super(props);
    this.dividerColor = '#011023';
  }

  render() {
    const { nutrition } = this.props;
    if (nutrition !== '') {
      return (
        <View style={[styles.background, this.props.style]}>
          <Text style={styles.heading}>Nutrition Facts</Text>
          <Divider style={{ backgroundColor: this.dividerColor, height: 1 }} />
          <NutritionItem name="Serving Size" valueRight="1 Apple" style={{ fontWeight: 'bold', fontSize: 13 * widthConversion }} />
          <Divider style={{ backgroundColor: this.dividerColor, height: 6 }} />
          <NutritionItem name="Calories" valueRight="60" style={{ fontWeight: 'bold', fontSize: 21 * widthConversion }} />
          <Divider style={{ backgroundColor: this.dividerColor, height: 3 }} />
          <NutritionItem valueRight="% Daily Value" style={{ fontWeight: 'bold', fontSize: 12 * widthConversion }} />
          <Divider style={{ backgroundColor: this.dividerColor, height: 0.5 }} />
          <NutritionItem name="Total Fat" valueLeft="1mg" valueRight="1%" style={{ fontWeight: 'bold' }} />
          <Divider style={{ backgroundColor: this.dividerColor, height: 0.5 }} />
          <NutritionItem name="Saturated fat" valueLeft="2mg" valueRight="2%" shift={10} />
          <Divider style={{ backgroundColor: this.dividerColor, height: 0.5 }} />
          <NutritionItem name="Trans fat" valueLeft="2mg" valueRight="2%" shift={10} />
          <Divider style={{ backgroundColor: this.dividerColor, height: 0.5 }} />
          <NutritionItem name="Cholesterol" valueLeft="0mg" valueRight="1%" style={{ fontWeight: 'bold' }} />
          <Divider style={{ backgroundColor: this.dividerColor, height: 0.5 }} />
          <NutritionItem name="Sodium" valueLeft="60mg" valueRight="3%" style={{ fontWeight: 'bold' }} />
          <Divider style={{ backgroundColor: this.dividerColor, height: 0.5 }} />
          <NutritionItem name="Total Carbohydrate" valueLeft="21g" valueRight="8%" style={{ fontWeight: 'bold' }} />
          <Divider style={{ backgroundColor: this.dividerColor, height: 0.5 }} />
          <NutritionItem name="Dietary Fibre" valueLeft="3g" valueRight="11%" shift={10} />
          <Divider style={{ backgroundColor: this.dividerColor, height: 0.5 }} />
          <NutritionItem name="Total Sugars" valueLeft="15g" valueRight="10%" shift={10} />
          <Divider style={{ backgroundColor: this.dividerColor, height: 0.5 }} />
          <NutritionItem name="Protein" valueLeft="3g" valueRight="3%" style={{ fontWeight: 'bold' }} />
          <Divider style={{ backgroundColor: this.dividerColor, height: 6 }} />
          <NutritionItem name="Vitamin A" valueLeft="3g" valueRight="3%" />
          <Divider style={{ backgroundColor: this.dividerColor, height: 0.5 }} />
          <NutritionItem name="Vitamin C" valueLeft="2g" valueRight="3%" />
          <Divider style={{ backgroundColor: this.dividerColor, height: 0.5 }} />
          <NutritionItem name="Calcium" valueLeft="3g" valueRight="3%" />
          <Divider style={{ backgroundColor: this.dividerColor, height: 0.5 }} />
          <NutritionItem name="Iron" valueLeft="3g" valueRight="3%" />
          <Divider style={{ backgroundColor: this.dividerColor, height: 0.5 }} />
          <NutritionItem style={{ fontSize: 13 * widthConversion }} name="The % Daily Value tells you how much a nutrient in a serving of food contributes to a daily diet. 2000 calories a day is used for general nutrition advice." />
        </View>
      );
    } else {
      return (

        <View style={[styles.background, this.props.style]}>
          <View style={styles.nutritionOverlay}>
            <Text h4 style={styles.notAvailable}>Nutrition info not available for this item</Text>
          </View>
          <Text style={styles.heading}>Nutrition Facts</Text>
          <Divider style={{ backgroundColor: this.dividerColor, height: 1 }} />
          <NutritionItem name="Serving Size" valueRight="1 Apple" style={{ fontWeight: 'bold', fontSize: 13 * widthConversion }} />
          <Divider style={{ backgroundColor: this.dividerColor, height: 6 }} />
          <NutritionItem name="Calories" valueRight="60" style={{ fontWeight: 'bold', fontSize: 21 * widthConversion }} />
          <Divider style={{ backgroundColor: this.dividerColor, height: 3 }} />
          <NutritionItem valueRight="% Daily Value" style={{ fontWeight: 'bold', fontSize: 12 * widthConversion }} />
          <Divider style={{ backgroundColor: this.dividerColor, height: 0.5 }} />
          <NutritionItem name="Total Fat" valueLeft="1mg" valueRight="1%" style={{ fontWeight: 'bold' }} />
          <Divider style={{ backgroundColor: this.dividerColor, height: 0.5 }} />
          <NutritionItem name="Saturated fat" valueLeft="2mg" valueRight="2%" shift={10} />
          <Divider style={{ backgroundColor: this.dividerColor, height: 0.5 }} />
          <NutritionItem name="Trans fat" valueLeft="2mg" valueRight="2%" shift={10} />
          <Divider style={{ backgroundColor: this.dividerColor, height: 0.5 }} />
          <NutritionItem name="Cholesterol" valueLeft="0mg" valueRight="1%" style={{ fontWeight: 'bold' }} />
          <Divider style={{ backgroundColor: this.dividerColor, height: 0.5 }} />
          <NutritionItem name="Sodium" valueLeft="60mg" valueRight="3%" style={{ fontWeight: 'bold' }} />
          <Divider style={{ backgroundColor: this.dividerColor, height: 0.5 }} />
          <NutritionItem name="Total Carbohydrate" valueLeft="21g" valueRight="8%" style={{ fontWeight: 'bold' }} />
          <Divider style={{ backgroundColor: this.dividerColor, height: 0.5 }} />
          <NutritionItem name="Dietary Fibre" valueLeft="3g" valueRight="11%" shift={10} />
          <Divider style={{ backgroundColor: this.dividerColor, height: 0.5 }} />
          <NutritionItem name="Total Sugars" valueLeft="15g" valueRight="10%" shift={10} />
          <Divider style={{ backgroundColor: this.dividerColor, height: 0.5 }} />
          <NutritionItem name="Protein" valueLeft="3g" valueRight="3%" style={{ fontWeight: 'bold' }} />
          <Divider style={{ backgroundColor: this.dividerColor, height: 6 }} />
          <NutritionItem name="Vitamin A" valueLeft="3g" valueRight="3%" />
          <Divider style={{ backgroundColor: this.dividerColor, height: 0.5 }} />
          <NutritionItem name="Vitamin C" valueLeft="2g" valueRight="3%" />
          <Divider style={{ backgroundColor: this.dividerColor, height: 0.5 }} />
          <NutritionItem name="Calcium" valueLeft="3g" valueRight="3%" />
          <Divider style={{ backgroundColor: this.dividerColor, height: 0.5 }} />
          <NutritionItem name="Iron" valueLeft="3g" valueRight="3%" />
          <Divider style={{ backgroundColor: this.dividerColor, height: 0.5 }} />
          <NutritionItem style={{ fontSize: 13 * widthConversion }} name="The % Daily Value tells you how much a nutrient in a serving of food contributes to a daily diet. 2000 calories a day is used for general nutrition advice." />
        </View>
      );
    }
  }
}

class NutritionItem extends React.Component {
  render() {
    return (
      <View style={styles.bothEnds}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={[styles.description, this.props.style, { paddingLeft: this.props.shift, paddingRight: 5 }]}>{this.props.name}</Text>
          <Text style={[styles.description]}>{this.props.valueLeft}</Text>
        </View>
        <Text style={[styles.description, this.props.style, { fontWeight: 'bold' }]}>{this.props.valueRight}</Text>
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
    paddingLeft: 2,
    paddingRight: 2,
    maxWidth: 350 * widthConversion,
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
  nutritionOverlay: {
    ...StyleSheet.absoluteFill,
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    zIndex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    borderWidth: 0,
  },
  notAvailable: {
    padding: 30,
    textAlign: 'center',
  },
});
