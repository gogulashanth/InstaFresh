import React from 'react';
import {
  ActivityIndicator, View,
} from 'react-native';
import colors from 'res/colors';
import { MenuButton } from 'library/components/HeaderItems';
import api from 'model/API';
import { WebView } from 'react-native-webview';

const webLoad = (progress => (
  <View style={{
    flex: 0, height: 5, width: '100%', flexDirection: 'row', alignSelf: 'flex-start', backgroundColor: colors.darkerLogoBack,
  }}
  >
    <View style={{
      flex: 0, height: 5, width: `${progress}%`, backgroundColor: colors.logo,
    }}
    />
    <View style={{ flex: 0, height: 5, width: `${progress}%` }} />
  </View>
));

export default class RecipeDetailScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('recipeItem').name,
  });

  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.recipe = navigation.getParam('recipeItem');
    this.state = { loadingProgress: 0, loading: true };
  }

  render() {
    const { loadingProgress, loading } = this.state;
    return (
      <View style={{ flex: 1 }}>
        {loading && (
          webLoad(loadingProgress)
        )}
        <WebView
          source={{ uri: this.recipe.recipeURL }}
          style={{ flex: 1 }}
          onLoadProgress={({ nativeEvent }) => {
            this.setState({ loadingProgress: nativeEvent.progress * 100 });
          }}
          onLoadEnd={() => this.setState({ loading: false })}
        />
      </View>

    );
  }
}
