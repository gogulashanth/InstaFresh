import React, { Component } from 'react';
import {
  StyleSheet,
} from 'react-native';
import ThemedFlatList from 'library/components/ThemedFlatList';
import CustomListItem from 'library/components/CustomListItem';


export default class Licenses extends Component {
  renderItem = (({ item }) => {
    const {
      image,
      userUrl,
      username,
      name,
      version,
      licenses,
      repository,
      licenseUrl,
      parents,
    } = item;

    return (
      <CustomListItem
        leftAvatar={{ source: { uri: image }, size: 'medium' }}
        title={name}
        subtitle={licenses}
        subsubtitle={version}
        containerStyle={{  }}
        onPress={() => this.props.licenseClicked(item)}
      />
    );

  });

  render() {
    const { licenses } = this.props;

    return (
      <ThemedFlatList
        style={styles.list}
        keyExtractor={({ key }) => key}
        data={licenses}
        renderItem={this.renderItem}
      />
    );
  }
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
});
