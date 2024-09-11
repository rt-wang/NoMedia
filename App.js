import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Animated, Easing } from 'react-native';
import ForYouPage from './ForYouPage';
import AccountPage from './AccountPage';
import NavigationBar from './NavigationBar';
import Header from './Header'; // Make sure you have this component
import NotificationsPage from './NotificationsPage'; // Add this import
import CreatePage from './CreatePage'; // Add this import
import Threads from './Threads';
import ReadNext from './ReadNext';
// Import other pages as needed

import * as Font from 'expo-font';
import { useState, useEffect } from 'react';

const Tab = createBottomTabNavigator();

const CustomTransition = ({ current, next, inverted, layouts: { screen } }) => {
  const progress = Animated.add(
    current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    }),
    next ? next.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    }) : 0
  );

  return {
    cardStyle: {
      transform: [{
        rotateY: progress.interpolate({
          inputRange: [0, 1, 2],
          outputRange: ['0deg', '90deg', '180deg'],
        }),
      }],
    },
  };
};

const screenOptions = {
  headerShown: false,
  tabBarStyle: { display: 'none' },
  cardStyleInterpolator: CustomTransition,
};

const AppContent = ({ children, navigation, route }) => (
  <SafeAreaView style={styles.container}>
    <Header />
    <View style={styles.content}>
      {children}
    </View>
    <NavigationBar activePage={route.name.toLowerCase()} />
  </SafeAreaView>
);

const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'AbhayaLibre-Regular': require('./assets/fonts/AbhayaLibre-Regular.ttf'),
        'AbhayaLibre-Medium': require('./assets/fonts/AbhayaLibre-Medium.ttf'),
        'AbhayaLibre-SemiBold': require('./assets/fonts/AbhayaLibre-SemiBold.ttf'),
        'AbhayaLibre-Bold': require('./assets/fonts/AbhayaLibre-Bold.ttf'),
        'AbhayaLibre-ExtraBold': require('./assets/fonts/AbhayaLibre-ExtraBold.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null; // or return a loading screen
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator screenOptions={screenOptions}>
          <Tab.Screen name="Home">
            {(props) => (
              <AppContent {...props}>
                <ForYouPage {...props} />
              </AppContent>
            )}
          </Tab.Screen>
          <Tab.Screen name="Account">
            {(props) => (
              <AppContent {...props}>
                <AccountPage {...props} />
              </AppContent>
            )}
          </Tab.Screen>
          <Tab.Screen name="Notifications">
            {(props) => (
              <AppContent {...props}>
                <NotificationsPage {...props} />
              </AppContent>
            )}
          </Tab.Screen>
          <Tab.Screen name="Create">
            {(props) => (
              <AppContent {...props}>
                <CreatePage {...props} />
              </AppContent>
            )}
          </Tab.Screen>
          <Tab.Screen name="Threads" component={Threads} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
  },
});

export default App;
