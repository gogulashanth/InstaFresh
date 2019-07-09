import React from 'react';
import {
  StyleSheet, Platform, View, Image, Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import { Divider, Text } from 'react-native-elements';
import dataInstance from 'model/Data';

const widthConversion = Dimensions.get('window').width * 0.0018;

export default class NutritionInfo extends React.Component {
  constructor(props) {
    super(props);
    this.dividerColor = '#011023';
  }

  _calcDaily(key) {
    const { nutrition } = this.props;
    return `${Math.round(nutrition[key] / dataInstance.getDailyValue(key) * 100 * 10) / 10}%`;
  }

  _calcNutr(key) {
    const { nutrition } = this.props;
    return `${Math.round(nutrition[key] * 100) / 10}${dataInstance.getNutritionUnit(key)}`;
  }

  _getServingSize() {
    const { nutrition } = this.props;
    const servingSizeKey = 'serving_size';
    const servingUnitKey = 'serving_size_UOM';

    if (servingSizeKey in nutrition) {
      const servingUnit = nutrition[servingUnitKey].replace(/ *\([^)]*\) */g, '');
      return `${nutrition[servingSizeKey]} ${servingUnit}`;
    } else {
      return 'per 100g';
    }
  }

  render() {
    const { nutrition } = this.props;
    if (nutrition !== '') {
      return (
        <View style={[styles.background, this.props.style]}>
          <Text style={styles.heading}>Nutrition Facts</Text>
          <Divider style={{ backgroundColor: this.dividerColor, height: 1 }} />
          <NutritionItem name="Serving Size" valueRight={this._getServingSize()} style={{ fontWeight: 'bold', fontSize: 13 * widthConversion }} />

          {nutrition['208'] !== undefined && ([
            <Divider key={1} style={{ backgroundColor: this.dividerColor, height: 6 }} />,
            <NutritionItem key={2} name="Calories" valueRight={nutrition['208']} style={{ fontWeight: 'bold', fontSize: 21 * widthConversion }} />,
          ])}

          <Divider style={{ backgroundColor: this.dividerColor, height: 3 }} />
          <NutritionItem valueRight="% Daily Value" style={{ fontWeight: 'bold', fontSize: 12 * widthConversion }} />

          {nutrition['204'] !== undefined && ([
            <Divider key={1} style={{ backgroundColor: this.dividerColor, height: 0.5 }} />,
            <NutritionItem key={2} name="Total Fat" valueLeft={this._calcNutr('204')} valueRight={this._calcDaily('204')} style={{ fontWeight: 'bold' }} />,
          ])}

          {nutrition['606'] !== undefined && ([
            <Divider key={1} style={{ backgroundColor: this.dividerColor, height: 0.5 }} />,
            <NutritionItem key={2} name="Saturated fat" valueLeft={this._calcNutr('606')} valueRight={this._calcDaily('606')} shift={10} />,
          ])}

          {nutrition['605'] !== undefined && ([
            <Divider key={1} style={{ backgroundColor: this.dividerColor, height: 0.5 }} />,
            <NutritionItem key={2} name="Trans fat" valueLeft={this._calcNutr('605')} valueRight={this._calcDaily('605')} shift={10} />,
          ])}

          {nutrition['601'] !== undefined && ([
            <Divider key={1} style={{ backgroundColor: this.dividerColor, height: 0.5 }} />,
            <NutritionItem key={2} name="Cholesterol" valueLeft={this._calcNutr('601')} valueRight={this._calcDaily('601')} style={{ fontWeight: 'bold' }} />,
          ])}

          {nutrition['307'] !== undefined && ([
            <Divider key={1} style={{ backgroundColor: this.dividerColor, height: 0.5 }} />,
            <NutritionItem key={2} name="Sodium" valueLeft={this._calcNutr('307')} valueRight={this._calcDaily('307')} style={{ fontWeight: 'bold' }} />,
          ])}

          {nutrition['205'] !== undefined && ([
            <Divider key={1} style={{ backgroundColor: this.dividerColor, height: 0.5 }} />,
            <NutritionItem key={2} name="Total Carbohydrate" valueLeft={this._calcNutr('205')} valueRight={this._calcDaily('205')} style={{ fontWeight: 'bold' }} />,
          ])}

          {nutrition['291'] !== undefined && ([
            <Divider key={1} style={{ backgroundColor: this.dividerColor, height: 0.5 }} />,
            <NutritionItem key={2} name="Dietary Fibre" valueLeft={this._calcNutr('291')} valueRight={this._calcDaily('291')} shift={10} />,
          ])}

          {nutrition['269'] !== undefined && ([
            <Divider key={1} style={{ backgroundColor: this.dividerColor, height: 0.5 }} />,
            <NutritionItem key={2} name="Total Sugars" valueLeft={this._calcNutr('269')} valueRight="" shift={10} />,
          ])}

          {nutrition['203'] !== undefined && ([
            <Divider key={1} style={{ backgroundColor: this.dividerColor, height: 0.5 }} />,
            <NutritionItem key={2} name="Protein" valueLeft={this._calcNutr('203')} valueRight="" style={{ fontWeight: 'bold' }} />,
          ])}

          {nutrition['320'] !== undefined && ([
            <Divider key={1} style={{ backgroundColor: this.dividerColor, height: 6 }} />,
            <NutritionItem key={2} name="Vitamin A" valueLeft={this._calcNutr('320')} valueRight="3%" />,
          ])}

          {nutrition['401'] !== undefined && ([
            <Divider key={1} style={{ backgroundColor: this.dividerColor, height: 0.5 }} />,
            <NutritionItem key={2} name="Vitamin C" valueLeft={this._calcNutr('401')} valueRight={this._calcDaily('401')} />,
          ])}

          {nutrition['301'] !== undefined && ([
            <Divider key={1} style={{ backgroundColor: this.dividerColor, height: 0.5 }} />,
            <NutritionItem key={2} name="Calcium" valueLeft={this._calcNutr('301')} valueRight={this._calcDaily('301')} />,
          ])}

          {nutrition['303'] !== undefined && ([
            <Divider key={1} style={{ backgroundColor: this.dividerColor, height: 0.5 }} />,
            <NutritionItem key={2} name="Iron" valueLeft={this._calcNutr('303')} valueRight={this._calcDaily('303')} />,
          ])}

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
          <Text
            style={[styles.description, this.props.style, { paddingLeft: this.props.shift, paddingRight: 5 }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {this.props.name}
          </Text>

          <Text
            style={[styles.description]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {this.props.valueLeft}
          </Text>

        </View>

        <Text
          style={[styles.description, this.props.style, { fontWeight: 'bold' }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {this.props.valueRight}
        </Text>
        
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
