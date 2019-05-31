/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @format
 */

import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { MenuProvider } from 'react-native-popup-menu';
import HomeScreen from 'screens/HomeScreen';
import Item from 'model/Item';
import Pantry from 'model/Pantry';
import ItemSummary from 'library/components/ItemSummary';
import InstaFreshHeader from 'library/components/InstaFreshHeader';

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    // const img = 'https://brain-images-ssl.cdn.dixons.com/9/4/10164049/l_10164049_008.jpg';
    // const pantry = new Pantry('default', img);
    // const dat = new Date();
    // let itemData = [];
    // var i;
    // for(i=0; i < 10; i++) {
    //   itemData[i] = new Item('Apple', dat, img, 'na', 2, pantry);
    // }

    return (
      <MenuProvider>
        <HomeScreen/>
      </MenuProvider>

      // <MenuProvider>
      //   <InstaFreshHeader style={styles.container} screenName='home'>
      //     <ItemSummary style={{top:100}}/>
      //     <ItemSummary style={{top:120}}/>
      //   </InstaFreshHeader>
      // </MenuProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#202020',
  },
  random: {
    top: 100,
  },
  random2: {
    top: 125,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
