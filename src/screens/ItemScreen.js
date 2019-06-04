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

    const itemID = navigation.getParam('itemID');
    const item = dataInstance.getItem(itemID);
    const pantry = dataInstance.getPantry(item.pantryID);
    this.state = { item, pantry };

    this.dateFormat = { year: 'numeric', month: 'long', day: 'numeric' };
  }

  componentWillMount() {
    const { navigation } = this.props;
    navigation.setParams({ handleEditPress: this.handleEditPress });
  }

  handleEditPress = (() => {
    const { item } = this.state;
    this.editModal.current.show(item);
  });

  handleEditItem = ((editedItem) => {
    const { item } = this.state;
    dataInstance.editItem(item.id, editedItem);
    const newItem = dataInstance.getItem(item.id);
    const pantry = dataInstance.getPantry(item.pantryID);
    this.setState({ item: newItem, pantry });
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
        <View style={{ flex: 1, padding: 12, flexDirection: 'column' }}>
          <View style={{ flex: 0.8, flexDirection: 'row', justifyContent: 'center' }}>
            <Image source={{ uri: item.imageURI }} style={{ flex: 1, borderRadius: 10 }} />


            <View style={styles.containerText}>
              <ItemDescription iconName="add-to-list" iconType="entypo" name="Quantity" value={item.quantity} />
              <ItemDescription iconName="ios-archive" iconType="ionicon" name="Pantry" value={pantry.name} />
              <ItemDescription iconName="calendar" iconType="entypo" name="Expiry Date" value={item.expiryDate.toLocaleDateString('en-US', this.dateFormat)} />
            </View>
          </View>

          <View style={styles.nutrition}>
            <NutritionInfo />
          </View>
          <View style={styles.buttonContainer}>
            <RNEButton title="Wasted" buttonStyle={[styles.buttonStyle, { backgroundColor: 'red' }]} onPress={() => {}} />
            <RNEButton title="Consumed" buttonStyle={styles.buttonStyle} onPress={() => {}} />
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
          <Text style={[palette.heading, styles.heading]}>{this.props.name}</Text>
          <Text style={[palette.text, styles.subheading]}>{this.props.value}</Text>
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
    flex: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    flexBasis: 'auto',
    paddingTop: 10,
  },
  buttonStyle: {
    height: 40,
    width: 110,
    borderRadius: 18,
    backgroundColor: colors.logo,
  },
});
