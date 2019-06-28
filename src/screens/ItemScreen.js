import React from 'react';
import {
  View, StyleSheet, Image, Button, SafeAreaView, ImageBackground,
} from 'react-native';
import colors from 'res/colors';
import themes from 'res/themes';
import palette from 'res/palette';
import dataInstance from 'model/Data';
import { Button as RNEButton, Icon, Text } from 'react-native-elements';
import NutritionInfo from 'library/components/NutritionInfo';
import { widthConversion } from 'res/fontSize';
import AddItemCard from 'library/components/AddItemCard';
import ItemUseCard from 'library/components/ItemUseCard';
import Item from 'model/Item';

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
      drawerLockMode: 'locked-closed',
    };
  };

  constructor(props) {
    super(props);
    this.editModal = React.createRef();
    this.itemUseCard = React.createRef();
    this.wastedItemUseCard = React.createRef();
    this.consumedItemUseCard = React.createRef();

    const { navigation } = this.props;

    const itemID = navigation.getParam('itemID');
    const item = dataInstance.getItem(itemID);
    const pantry = dataInstance.getPantry(item.pantryID);
    this.state = { item, pantry };

    this.dateFormat = { year: 'numeric', month: 'long', day: 'numeric' };
  }

  componentWillMount() {
    const { navigation } = this.props;
    navigation.setParams({ handleEditPress: this.handleEditPress });
    dataInstance.registerListener(this._handleDataUpdate);
  }

  componentWillUnmount() {
    dataInstance.unregisterListener(this._handleDataUpdate);
  }

  _handleDataUpdate = (() => {
    const { item } = this.state;
    const newItem = dataInstance.getItem(item.id);
    if (newItem !== undefined) {
      const pantry = dataInstance.getPantry(item.pantryID);
      this.setState({ item: newItem, pantry });
    }
  });

  handleEditPress = (() => {
    const { item } = this.state;
    this.editModal.current.show(item);
  });

  handleEditItem = ((editedItem) => {
    const { item } = this.state;
    dataInstance.editItem(item.id, editedItem);
  });

  render() {
    const { item, pantry } = this.state;
    const { navigation } = this.props;

    return (
      <SafeAreaView style={styles.container}>
        <AddItemCard
          ref={this.editModal}
          visible={false}
          onSave={this.handleEditItem}
          editMode
          navigation={navigation}
        />
        <ItemUseCard
          ref={this.consumedItemUseCard}
          title="How much did you consume?"
          subtitle="Move the slider to adjust"
          maxValue={item.quantity}
          onSave={amt => dataInstance.addConsumed(item.id, amt)}
        />
        <ItemUseCard
          ref={this.wastedItemUseCard}
          title="How much did you waste?"
          subtitle="Move the slider to adjust"
          maxValue={item.quantity}
          onSave={amt => dataInstance.addWasted(item.id, amt)}
        />
        <View style={{ flex: 1, padding: 12, flexDirection: 'column' }}>
          <View style={{ flex: 0.8, flexDirection: 'row', justifyContent: 'center' }}>
            <Image source={{ uri: item.imageURI }} style={{ flex: 1, borderRadius: 10 }} />


            <View style={styles.containerText}>
              <ItemDescription iconName="list" iconType="entypo" name="Quantity" value={(Math.round(item.quantity * 10) / 10).toString()} />
              <ItemDescription iconName="ios-archive" iconType="ionicon" name="Pantry" value={pantry.name} />
              <ItemDescription iconName="calendar" iconType="entypo" name="Expiry Date" value={item.expiryDate.toLocaleDateString('en-US', this.dateFormat)} />
            </View>
          </View>

          <View style={styles.nutrition}>
            <NutritionInfo nutrition={item.nutrition} />
          </View>
          <View style={styles.buttonContainer}>
            <RNEButton title="Wasted" buttonStyle={{ ...styles.buttonStyle, backgroundColor: colors.red }} onPress={() => this.wastedItemUseCard.current.show()} />
            <RNEButton title="Consumed" buttonStyle={styles.buttonStyle} onPress={() => this.consumedItemUseCard.current.show()} />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

class ItemDescription extends React.Component {
  render() {
    return (
      <View style={{
        flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
      }}
      >
        <Icon
          size={18 * widthConversion}
          reverse
          reverseColor={colors.text}
          name={this.props.iconName}
          type={this.props.iconType}
          color={colors.logoBack}
        />
        <View style={{
          flex: 2, flexDirection: 'column', alignItems: 'flex-start', paddingLeft: 10,
        }}
        >
          <Text h3>{this.props.name}</Text>
          <Text h4 style={{ opacity: 0.5 }}>{this.props.value}</Text>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkerLogoBack,
  },
  heading: {
    padding: 1,
  },
  subheading: {
    padding: 1,
  },
  containerText: {
    flex: 1,
    flexDirection: 'column',
    alignSelf: 'center',
    paddingLeft: 10,
  },
  buttonContainer: {
    flex: 0.4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  nutrition: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexBasis: 'auto',
    paddingTop: 10,
    paddingLeft: 30,
    paddingRight: 30,
  },
  buttonStyle: {
    width: 130,
    borderRadius: 20,
  },
});
