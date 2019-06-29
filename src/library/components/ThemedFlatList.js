import React from 'react';
import { FlatList } from 'react-native';
import { withTheme } from 'react-native-elements';

const ThemedFlatList = props => (
  <FlatList {...props} />
);

export default withTheme(ThemedFlatList, 'ThemedFlatList');
