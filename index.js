/**
 * @format
 */

import { AppRegistry, Alert } from 'react-native';
import { Client } from 'bugsnag-react-native';
import { setJSExceptionHandler, getJSExceptionHandler, setNativeExceptionHandler } from 'react-native-exception-handler';
import App from './App';
import { name as appName } from './app.json';

const bugsnag = new Client('2c506d663f3df9c50755b0817b1dbbe7');


setJSExceptionHandler((error, isFatal) => {
  Alert.alert('Error',
    error.message,
    [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
    ],
    { cancelable: true });
  bugsnag.notify(error);
});

setNativeExceptionHandler((exceptionString) => {
  bugsnag.notify(new Error(exceptionString));
});


AppRegistry.registerComponent(appName, () => App);
