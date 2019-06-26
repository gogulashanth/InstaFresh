import React from 'react';
import {
  Image, View, StyleSheet, Animated, Easing,
} from 'react-native';
import { Text } from 'react-native-elements';
import colors from 'res/colors';
import fontSize from 'res/fontSize';
import PieChart from 'library/components/PieChart';
import { MenuButton } from 'library/components/HeaderItems';
import dataInstance from 'model/Data';

const AnimatedPie = Animated.createAnimatedComponent(PieChart);

export default class InstaScoreScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'InstaScore',
    headerLeft: <MenuButton onPress={navigation.getParam('handleMenuButtonClick')} />,
  });

  constructor(props) {
    super(props);
    this.pie = React.createRef();
    this.state = { animatedValue: new Animated.Value(0), instaScore: dataInstance.getInstaScore() };
  }

  componentWillMount() {
    const { navigation } = this.props;
    this.navListener = navigation.addListener('didFocus', this.screenWillFocus);

    navigation.setParams({
      handleMenuButtonClick: this.handleMenuButtonClick,
    });
  }

  componentWillUnmount() {
    this.navListener.remove();
  }

  handleMenuButtonClick = (() => {
    const { navigation } = this.props;
    navigation.toggleDrawer();
  });

  screenWillFocus = (() => {
    const { animatedValue } = this.state;

    Animated.sequence([
      Animated.timing(
        animatedValue,
        {
          toValue: 0,
          duration: 1,
        },
      ),
      Animated.timing(
        animatedValue,
        {
          toValue: 1,
          duration: 2000,
          easing: Easing.out(Easing.elastic()),
        },
      ),
    ]).start();

    this.setState({ instaScore: dataInstance.getInstaScore() });
  });

  render() {
    const { animatedValue, instaScore } = this.state;
    let segments = [{ name: 'score', value: instaScore, color: colors.logo }, { name: 'remaining', value: 100 - instaScore, color: colors.red }];
    if (instaScore === 100) {
      segments = [{ name: 'score', value: instaScore, color: colors.logo }];
    }
    return (
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text h3>Welcome to instascore!</Text>
        </View>
        <View style={{ flex: 5, alignItems: 'center', justifyContent: 'center' }}>
          <Text h1>{instaScore}</Text>
          <AnimatedPie
            ref={this.pie}
            endAngle={animatedValue.interpolate({ inputRange: [0, 1], outputRange: [0, 2 * Math.PI] })}
            style={{ ...styles.pie }}
            segmentValues={segments}
          />
        </View>
        <View style={styles.bottomContainer}>
          <Text style={styles.description}>This is your instascore!</Text>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.darkerLogoBack,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  pie: {
    position: 'absolute',
    alignSelf: 'center',
    height: 200,
    width: 200,
  },
  title: {
    fontSize: fontSize.title,
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 3,
  },
  description: {
  },
  bottomContainer: {
    flex: 5,
  },
});
