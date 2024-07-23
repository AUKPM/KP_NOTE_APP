import React from 'react';
import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  ImageBackground,
} from 'react-native';

import AppNavigator from './src/navigation/AppNavigator';
import {Auth0Provider} from 'react-native-auth0';
import {MainProvider} from './src/contexts/MainContext';
// @ts-ignore
import {AUTH0_CLIENT_ID, AUTH0_DOMAIN} from '@env';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'light';

  const backgroundStyle = {
    backgroundColor: 'transparent',
  };

  const bgImagePath = require('./src/assets/image/BG/start_bg2.png');

  return (
    <Auth0Provider domain={AUTH0_DOMAIN} clientId={AUTH0_CLIENT_ID}>
      <MainProvider>
        <ImageBackground
          style={{flex: 1}}
          source={bgImagePath}
          resizeMode="cover">
          <StatusBar
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            backgroundColor={backgroundStyle.backgroundColor}
          />
          <AppNavigator />
        </ImageBackground>
      </MainProvider>
    </Auth0Provider>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
