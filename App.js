import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import ForYouPage from './ForYouPage';
import NavigationBar from './NavigationBar';
import Header from './Header';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();

const AppContent = ({ children, activePage }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Header />
      <View style={styles.content}>
        {children}
      </View>
      <View style={[styles.navBarContainer, { paddingBottom: insets.bottom }]}>
        <NavigationBar activePage={activePage} />
      </View>
    </View>
  );
};

function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync({
          'SFProText-Regular': require('./assets/fonts/SFProText-Regular.otf'),
          'SFProText-Bold': require('./assets/fonts/SFProText-Bold.otf'),
          'SFProText-Semibold': require('./assets/fonts/SFProText-Semibold.otf'),
          'Athelas': require('./assets/fonts/Athelas-Regular.ttf'),
        });
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = React.useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <NavigationContainer>
      <SafeAreaView style={styles.safeArea} onLayout={onLayoutRootView}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: '#000' },
          }}
        >
          <Stack.Screen name="Home">
            {(props) => (
              <AppContent>
                <ForYouPage {...props} />
              </AppContent>
            )}
          </Stack.Screen>
          {/* Add other screens here */}
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    marginBottom: 60, // Add margin to account for the NavigationBar height
  },
  navBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000',
  },
});

export default App;
