import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native'; // Add StatusBar import
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack'; // Add this line
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
const Stack = createStackNavigator();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ForYou" component={ForYouPage} />
    <Stack.Screen name="Threads" component={Threads} />
    <Stack.Screen name="ReadNext" component={ReadNext} />
  </Stack.Navigator>
);

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

const screenOptions = ({ route }) => ({
  headerShown: false,
  tabBarStyle: { display: 'none' },
  tabBar: (props) => <NavigationBar {...props} currentRoute={route.name} />
});

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
      <StatusBar barStyle="light-content" /> 
      <SafeAreaView style={styles.container}>
        <NavigationContainer>
          <View style={styles.content}>
            <Header />
            <Tab.Navigator
              screenOptions={{ headerShown: false }}
              tabBar={props => <NavigationBar {...props} />}
            >
              <Tab.Screen name="Home" component={HomeStack} />
              <Tab.Screen name="Account" component={AccountPage} />
              <Tab.Screen name="Notifications" component={NotificationsPage} />
              <Tab.Screen name="Create" component={CreatePage} />
            </Tab.Navigator>
          </View>
        </NavigationContainer>
      </SafeAreaView>
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
