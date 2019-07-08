import React from 'react';
import {
  Image, View, StyleSheet, Animated, Easing, Dimensions, Alert,
} from 'react-native';
import { Text, Button } from 'react-native-elements';
import colors, { hexInterpolateHSL } from 'res/colors';
import fontSize from 'res/fontSize';
import PieChart from 'library/components/PieChart';
import { MenuButton } from 'library/components/HeaderItems';
import dataInstance from 'model/Data';
import CustomLineChart from 'library/components/CustomLineChart';

const AnimatedPie = Animated.createAnimatedComponent(PieChart);
const dateFormat = { minute: '2-digit', second: '2-digit' };
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const chartConfig = {
  backgroundGradientFrom: colors.logoBack,
  backgroundGradientTo: colors.logoBack,
  color: (opacity = 1) => colors.textOp(opacity),
};

export default class InstaScoreScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'InstaScore',
    headerLeft: <MenuButton onPress={navigation.getParam('handleMenuButtonClick')} />,
  });

  constructor(props) {
    super(props);
    this.pie = React.createRef();
    this.state = { animatedValue: new Animated.Value(0), instaScore: dataInstance.getInstaScore(), instaScoreHistoryData: '' };
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

  _getDataFromTrendData = ((data) => {
    const result = [];
    for (let i = data.length - 1; i >= 0; i--) {
      result.push(data[i].average);
    }
    return result;
  });

  _getLabelsFromTrendData = ((data) => {
    const result = [];
    for (let i = data.length - 1; i >= 0; i--) {
      result.push(data[i].time.getSeconds());
    }
    return result;
  });

  screenWillFocus = (async () => {
    const { animatedValue } = this.state;

    const result = dataInstance.getWeeklyInstaScoreTrend();
    console.log(result);

    const data = {
      labels: this._getLabelsFromTrendData(result),
      datasets: [{
        data: this._getDataFromTrendData(result),
        color: (opacity = 1) => colors.logoOp(opacity), // optional
      }],
    };

    await this.setState({ instaScoreHistoryData: data, instaScore: dataInstance.getInstaScore() });

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
  });

  _getMessageForScore = ((score) => {
    let message = '';
    const { logo } = colors;
    const { red } = colors;
    let textColor = logo;

    if (score === 100) {
      message = 'YOU should be the face of InstaFresh!';
    } else if (score > 80) {
      message = 'Instamazing!!! you are doing better than most :)';
    } else if (score > 50) {
      message = 'You are getting there. Keep eating!!!';
    } else if (score > 30) {
      message = 'Try harder';
    } else if (score > 10) {
      message = 'Try harder';
    } else if (score > 0) {
      message = 'Try harder';
    } else if (score === 0) {
      message = 'Whoops! Guess it is time to buy a bigger garbage bin.';
    }

    textColor = hexInterpolateHSL(red, logo, score / 100.0);

    return (
      <Text h3 h3Style={{ color: textColor, textAlign: 'center', opacity: 0.6 }}>{message}</Text>
    );
  });

  render() {
    const { animatedValue, instaScore, instaScoreHistoryData } = this.state;
    let segments = [{ name: 'score', value: instaScore, color: colors.logo }, { name: 'remaining', value: 100 - instaScore, color: colors.red }];
    if (instaScore === 100) {
      segments = [{ name: 'score', value: instaScore, color: colors.logo }];
    }
    return (
      <View style={styles.container}>
        <View style={styles.message}>
          {this._getMessageForScore(instaScore)}
        </View>
        <View style={{ flex: 5, alignItems: 'center', justifyContent: 'center' }}>
          <Text h1>{`${instaScore}%`}</Text>
          <AnimatedPie
            ref={this.pie}
            endAngle={animatedValue.interpolate({ inputRange: [0, 1], outputRange: [0, 2 * Math.PI] })}
            style={{ ...styles.pie }}
            segmentValues={segments}
          />
        </View>
        
        <View style={styles.bottomContainer}>
          {instaScoreHistoryData !== '' && (
            <View style={styles.chartContainer}>
              <Text h3 h3Style={{ padding: 10 }}>Weekly InstaScore Trend</Text>
              {instaScoreHistoryData.datasets[0].data.length > 1 && (
                <CustomLineChart
                  data={instaScoreHistoryData}
                  width={screenWidth - 50}
                  height={screenHeight / 4}
                  withOuterLines={false}
                  style={{ borderRadius: 10 }}
                  chartConfig={chartConfig}
                />
              )}
              {instaScoreHistoryData.datasets[0].data.length <= 1 && (
                <View style={styles.notEnoughData}>
                  <Text h4 h4style={{ textAlign: 'center' }}>Not enough data to display usage trend.</Text>
                </View>
              )}
            </View>
          )}
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Button
              title="Reset InstaScore"
              style={styles.buttonStyle}
              buttonStyle={{ ...{ width: 150, backgroundColor: colors.red } }}
              onPress={() => {
                Alert.alert(
                  'Are you sure you want to reset your InstaScore?',
                  'Resetting your InstaScore deletes all prior InstaScore data as well as resets the current score to 100.',
                  [
                    {
                      text: 'Cancel',
                      style: 'cancel',
                    },
                    {
                      text: 'OK',
                      onPress: () => {
                        dataInstance.resetInstaScore();
                        this.screenWillFocus();
                      },
                    },
                  ],
                  { cancelable: true },
                );
              }}
            />
          </View>
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
    flex: 6,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonStyle: {
  },
  chartContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notEnoughData: {
    width: screenWidth - 50,
    height: screenHeight / 4,
    borderRadius: 10,
    backgroundColor: colors.logoBack,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    opacity: 0.5,
  },
  message: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
  }
});
