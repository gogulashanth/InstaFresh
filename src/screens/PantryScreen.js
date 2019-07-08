import React from 'react';
import {
  View, Text, StyleSheet, Image, Button, SafeAreaView, FlatList,
} from 'react-native';
import colors from 'res/colors';
import palette from 'res/palette';
import dataInstance from 'model/Data';
import { Button as RNEButton, Icon, ListItem } from 'react-native-elements';
import { widthConversion } from 'res/fontSize';
import AddPantryCard from 'library/components/AddPantryCard';
import CustomListItem from 'library/components/CustomListItem';
import { CachedImage } from 'react-native-cached-image';
import ThemedFlatList from 'library/components/ThemedFlatList';

export default class ItemScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { state } = navigation;
    const { title } = state.params;

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
    this.onPressItem = this.onPressItem.bind(this);
    const pantryID = navigation.getParam('pantryID');
    const pantry = dataInstance.getPantry(pantryID);
    this.pantryID = pantryID;
    this.state = { pantry };
  }

  async componentWillMount() {
    await dataInstance.loadData();
    dataInstance.registerListener(this.onDataUpdate);

    this.onDataUpdate();

    const { navigation } = this.props;
    navigation.setParams({
      handleEditPress: this.handleEditPress,
      handleManualAdd: this.handleManualAddClick,
      handleMenuButtonClick: this.handleMenuButtonClick,
    });
  }

  componentWillUnmount() {
    dataInstance.unregisterListener(this.onDataUpdate);
  }

  onPressItem(id) {
    const { navigation } = this.props;
    navigation.navigate('Item', { itemID: id, title: dataInstance.getItem(id).name });
  }

  keyExtractor = (item, index) => item.id;

  handleEditPress = (() => {
    const { pantry } = this.state;
    this.editModal.current.show(pantry);
  });

  handleEditPantry = ((pantry) => {
    dataInstance.editPantry(pantry.id, pantry);
  });

  onDataUpdate = (() => {
    const { navigation } = this.props;
    const pantry = dataInstance.getPantry(this.pantryID);
    if (typeof pantry !== 'undefined') {
      navigation.setParams({ title: pantry.name });
      const d = Object.values(pantry.items);
      this.setState({ pantry, data: d });
    }
  });

  renderItem = ((item) => {
    const dataItem = item.item;

    const currentDate = new Date();
    const numDaysLeft = Math.round((dataItem.expiryDate - currentDate) / (1000 * 60 * 60 * 24));
    let style = null;
    let expiryComp = null;

    if (numDaysLeft < 0) {
      expiryComp = 'Expired!';
      style = { color: colors.red };
    } else if (numDaysLeft <= 1) {
      expiryComp = 'Expires today!';
      style = { color: colors.red };
    } else if (numDaysLeft <= 2) {
      expiryComp = 'Expires in two days!';
      style = { color: colors.red };
    } else {
      expiryComp = `Expires in ${numDaysLeft} days`;
      style = null;
    }

    return (
      <CustomListItem
        leftAvatar={{ source: { uri: dataItem.imageURI } }}
        title={`${dataItem.name} - ${dataItem.quantity}`}
        subtitle={expiryComp}
        chevron
        containerStyle={{ marginTop: 5 }}
        subtitleStyle={style}
        onPress={() => this.onPressItem(dataItem.id)}
      />
    );
  });

  render() {
    const { pantry, data } = this.state;
    const { navigation } = this.props;

    return (
      <SafeAreaView style={styles.container}>
        <AddPantryCard
          ref={this.editModal}
          editMode
          visible={false}
          onSave={this.handleEditPantry}
          navigation={navigation}
        />
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <CachedImage source={{ uri: pantry.imageURI }} style={{ flex: 1 }} />
          <ThemedFlatList
            style={{ flex: 1 }}
            data={data}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderItem}
          />
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
