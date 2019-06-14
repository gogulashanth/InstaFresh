/* eslint-disable react/prefer-stateless-function */
/* eslint-disable keyword-spacing */
/* eslint-disable react/no-multi-comp */
import React from 'react';
import {
  StyleSheet, View, Animated, Easing,
} from 'react-native';
import colors from 'res/colors';
import { AddButton, HeaderLogo, MenuButton } from 'library/components/HeaderItems';


export default class AboutScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'About',
    headerLeft: <MenuButton onPress={navigation.getParam('handleMenuButtonClick')} />,

  });

  constructor(props) {
    super(props);
    this.state = {
      imageOpacity: new Animated.Value(0),
      text1Opacity: new Animated.Value(0),
      text2Opacity: new Animated.Value(0),
      text3Opacity: new Animated.Value(0),
      text4Opacity: new Animated.Value(0),
      text5Opacity: new Animated.Value(0),
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    const {
      imageOpacity, text3Opacity, text4Opacity, text1Opacity, text5Opacity, text2Opacity,
    } = this.state;

    navigation.setParams({
      handleMenuButtonClick: this.handleMenuButtonClick,
    });

    this.animation = Animated.sequence([
      Animated.timing( // Animate over time
        imageOpacity, // The animated value to drive
        {
          toValue: 1, // Animate to opacity: 1 (opaque)
          easing: Easing.ease,
          duration: 2000, // Make it take a while
        },
      ),
      Animated.loop(Animated.sequence([
        this.createAnimation(text3Opacity),
        this.createAnimation(text4Opacity),
        this.createAnimation(text1Opacity),
        this.createAnimation(text5Opacity),
        this.createAnimation(text2Opacity),
      ])),
    ]);
    this.animation.start();
  }

  componentWillUnmount() {
    this.animation.stop();
  }

  createAnimation = ((obj) => {
    Animated.sequence([
      Animated.timing( // Animate over time
        obj, // The animated value to drive
        {
          toValue: 1, // Animate to opacity: 1 (opaque)
          duration: 1000, // Make it take a while
        },
      ),
      Animated.delay(2000),
      Animated.timing(
        obj, // The animated value to drive
        {
          toValue: 0, // Animate to opacity: 1 (opaque)
          duration: 1000, // Make it take a while
        },
      ),
    ]);
  });


  render() {
    const { search, filteredData } = this.state;
    const {
      imageOpacity, text3Opacity, text4Opacity, text1Opacity, text5Opacity, text2Opacity,
    } = this.state;

    return (
      <View style={[styles.container, { flexDirection: 'column', alignItems: 'center' }]}>
        <Animated.Text style={[styles.Facts, { opacity: text1Opacity }]}>
          Each year, food waste in Canada creates some 56.6 million tonnes of carbon dioxide-equivalent emissions. 
        </Animated.Text>
        <View style={[styles.container, { flexDirection: 'row' }]}>
          <Animated.Text style={[styles.Facts, { opacity: text2Opacity }]}>
            63% of the food Canadians thrown away could have been eaten.
          </Animated.Text>
          <Animated.Text style={[styles.Facts, { opacity: text3Opacity }]}>
            Wasted food costs the average Canadian household $1,100 a year!
          </Animated.Text>
        </View>
        <View style={[styles.container, { flexDirection: 'row' }]}>
          <Animated.Text style={[styles.Facts, { opacity: text4Opacity }]}> 
            Over 1/3 of all food produced globally goes to waste. 
          </Animated.Text>
          <Animated.Image 
            resizeMode="contain" 
            style={{ width: 150, height: 150, opacity: imageOpacity }} 
            source={require('res/images/instafresh_logo_text_bottom.png')} 
          />
          <Animated.Text style={[styles.Facts, { opacity: text5Opacity }]}> 
            We waste 1,000,000 cups of milk EVERY DAY! 
          </Animated.Text>
        </View>
        <View style={[styles.container, { flex: 2.5, flexDirection: 'row', alignItems: 'center' }]}>
          <Animated.Text style={styles.About}> 
            InstaFresh is a CSR (Corporate Social Responsibility) centred 
            mobile application that was created to enable users to reduce 
            their carbon footprint. InstaFresh was explicitly designed to 
            reduce food waste and help users save money on the unintentional 
            loss of food. We welcome and encourage feedback that would help 
            us improve user experience with InstaFresh. 
          </Animated.Text>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkerLogoBack,
    padding: 10,
  },
  Facts: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Noteworthy',
    color: '#a89bb2',
    textAlign: 'center',
    lineHeight: 26,
  },
  About: {
    flex: 1,
    padding: 10,
    fontSize: 18,
    fontFamily: 'Rockwell',
    color: '#F2E4FF',
    textAlign: 'center',
  },
});
