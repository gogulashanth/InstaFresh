import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity,TouchableHighlight, Animated, Easing } from 'react-native';
import {Header, Icon} from 'react-native-elements';
import InstaMenu from 'library/components/InstaMenu';
import palette from 'res/palette';
import colors from 'res/colors';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers
} from 'react-native-popup-menu';
import AddItemCard from 'library/components/AddItemCard';
import dataInstance from 'model/Data';

export default class InstaFreshHeader extends React.Component {
  constructor(props) {
    super(props);
    this.addItemCardRef = React.createRef();
    this.state = {
      menuButtonPressed: false,
      xPosition: new Animated.Value(-300),
      opacity: 1,
      addItemVisible: false,
    };
  }

  handleAddItem = ((item) => {
    dataInstance.addItem(item, item.pantryID);
  });

  handleManualAddClick = (() => {
    this.addItemCardRef.current.show();
    // this.setState({ addItemVisible: true });
  });

  handleMenuClick = (() => {
    const { menuButtonPressed, xPosition } = this.state;
    if (menuButtonPressed) {
      this.setState({ menuButtonPressed: false, opacity: 1 });
      Animated.timing(xPosition, {
        toValue: -300,
        duration: 300,
        easing: Easing.quad,
      }).start();
    } else {
      this.setState({ menuButtonPressed: true, opacity: 0.5 });
      Animated.timing(xPosition, {
        toValue: 0,
        duration: 300,
        easing: Easing.quad,
      }).start();
    }
  });

  render() {
    switch (this.props.screenName) {
      case 'home':
        rightIcon = (
          <Menu renderer={renderers.Popover} rendererProps={{ placement: 'bottom', anchorStyle: styles.anchorStyle}}>
            <MenuTrigger customStyles={triggerStyles}>
              <Icon 
                name='ios-add' 
                type='ionicon' 
                color={colors.logo}
              />
            </MenuTrigger>
            <MenuOptions customStyles={optionStyles}>
              <MenuOption onSelect={this.handleManualAddClick} value={1} text="Manual Add" />
              <MenuOption value={2} text="AutoScan" />
              <MenuOption value={2} text="Barcode Scan" />
            </MenuOptions>
          </Menu>
        );
        centerComp = (
          <View>
            <Image
              style={{ width: 200, height: 30 }}
              source={require('res/images/instafresh_logo_text_horiz.png')}
              resizeMode="contain"
            />
          </View>
        );
        break;

      default:
        rightIcon = null;
        centerComp = null;
        break;
    }

    let children = 0;

    if (this.state.menuButtonPressed) {
      children = (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={this.handleMenuClick}
          style={[styles.container,this.props.style]}
        >
          <View style={[styles.container,this.props.style,{opacity:this.state.opacity}]}>
            {this.props.children}
          </View>
        </TouchableOpacity>
      );
    } else {
      children = (
        <View style={[styles.container,this.props.style,{opacity:this.state.opacity}]}>
          {this.props.children}
        </View>
      );
    }

    const menuIcon = (
      <TouchableOpacity onPress={this.handleMenuClick}>
        <Icon
          name="ios-menu"
          type="ionicon"
          color={colors.logo}
          iconStyle={styles.iconStyleLeft}
        />
      </TouchableOpacity>
    );

    return (
      <View style={[styles.container]}>
        <Header
          leftComponent={menuIcon}
          centerComponent={centerComp}
          rightComponent={rightIcon}
          containerStyle={palette.header}
          barStyle="default"
        />
        <AddItemCard
          ref={this.addItemCardRef}
          visible={false}
          onSave={this.handleAddItem}
        />
        <View style={[styles.container]}>
          {children}
          <Animated.View
            position="absolute"
            style={[styles.slideView, {
              transform: [{ translateX: this.state.xPosition }],
            }]}
          >
            <InstaMenu />
          </Animated.View>
        </View>
      </View>

    );
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    flexDirection: 'column',
  },
  slideView: {
    height: '100%',
    width: '67%',
    top: 0,
    flexDirection: 'column', 
  },
  iconStyleLeft: {
    paddingRight: 40,
    paddingLeft: 5,
    paddingTop: 5,
    paddingBottom: 5,
  },
  iconStyleRight: {
    paddingRight: 5,
    paddingLeft: 40,
    paddingTop: 5,
    paddingBottom: 5,
  },
  anchorStyle: {
    backgroundColor: colors.lighterLogoBack,
  },
});

const triggerStyles = {
  triggerWrapper: {
    padding: 10,
  },
  TriggerTouchableComponent: TouchableOpacity,
};

const optionStyles = {
  optionsContainer: {
    backgroundColor: colors.lighterLogoBack,
    margin: 0,
    flex:1,
    flexBasis: 'auto',
    width: 120,
    borderRadius: 10,
    alignItems: 'center',
  },
  optionWrapper: {
    marginTop: 1,
    marginBottom: 1,
    backgroundColor: colors.lighterLogoBack,
  },
  optionText: {
    color: colors.text,
  },
};