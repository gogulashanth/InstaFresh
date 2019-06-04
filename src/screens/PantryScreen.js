import React from 'react';
import {
  View, Text, StyleSheet, Image, Button, SafeAreaView,
} from 'react-native';
import colors from 'res/colors';
import palette from 'res/palette';
import dataInstance from 'model/Data';
import { Button as RNEButton, Icon } from 'react-native-elements';
import NutritionInfo from 'library/components/NutritionInfo';
import { widthConversion } from 'res/fontSize';
import AddItemCard from 'library/components/AddItemCard';

export default class ItemScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const title = navigation.getParam('title');
    return {
      title,
      headerRight: <Button
        color={colors.logo}
        title="Edit"
        onPress={navigation.getParam('handleEditPress')}
      />,
    };
  };

  constructor(props) {
    super(props);
    this.editModal = React.createRef();
    const { navigation } = this.props;

    const pantryID = navigation.getParam('pantryID');
    const pantry = dataInstance.getPantry(pantryID);
    this.state = { pantry };
  }

  componentWillMount() {
    const { navigation } = this.props;
    navigation.setParams({ handleEditPress: this.handleEditPress });
  }

  handleEditPress = (() => {
    const { pantry } = this.state;
    this.editModal.current.show(pantry);
  });

  render() {
    const { pantry } = this.state;
    const { navigation } = this.props;

    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, padding: 12, flexDirection: 'column' }}>
          <Image source={{ uri: pantry.imageURI }} style={{ flex: 1, borderRadius: 10 }} />
          
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkerLogoBack,
  },
});
