import { Dimensions } from 'react-native';

export const widthConversion = Dimensions.get('window').width * 0.0025;

const fontSize = {
  title: 23*widthConversion,
  menu: 23*widthConversion,
  subHeading: 15*widthConversion,
  heading: 20*widthConversion,
  text: 15*widthConversion,
  h2: 19*widthConversion,
  h3: 17*widthConversion,
  h4: 14*widthConversion,

};
export default fontSize;
