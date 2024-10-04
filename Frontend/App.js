import React, { useState, useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, StyleSheet, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Animated, Easing } from 'react-native';
import ForYouPage from './ForYouPage';
import AccountPage from './AccountPage';
import NavigationBar from './NavigationBar';
import Header from './Header';
import NotificationsPage from './NotificationsPage';
import CreatePage from './CreatePage';
import Threads from './Threads';
import ReadNext from './ReadNext';
import QuoteScreen from './QuoteScreen';
import RepostScreen from './RepostScreen';
import Drafts from './Drafts';
import SettingsPage from './SettingsPage';
import CommentSection from './CommentSection';
import { PostProvider } from './PostContext';
import ExplorePageAI from './ExplorePageAI';
import RegistrationPage from './RegistrationPage';
import * as Font from 'expo-font';
import { RepostProvider } from './RepostContext';
import LoginPage from './LoginPage';
import FeedbackForm from './FeedbackForm';
import VerificationPage from './VerificationPage';
import UserAccountPage from './UserAccountPage';
import ForgotPasswordPage from './ForgotPasswordPage';
import NomsPage from './NomsPage';
import NomObject from './NomObject';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ForYou" component={ForYouPage} />
    <Stack.Screen name="Threads" component={Threads} />
    <Stack.Screen name="ReadNext" component={ReadNext} />
    <Stack.Screen name="Quote" component={QuoteScreen} />
    <Stack.Screen name="Repost" component={RepostScreen} />
    <Stack.Screen name="CommentSection" component={CommentSection} />
    <Stack.Screen name="ExplorePageAI" component={ExplorePageAI} />
    <Stack.Screen name="FeedbackForm" component={FeedbackForm} />
    <Stack.Screen name="NomsPage" component={NomsPage} />
    <Stack.Screen name="NomObject" component={NomObject} />
  </Stack.Navigator>
);

const AccountStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AccountMain" component={AccountPage} />
    <Stack.Screen name="Drafts" component={Drafts} />
    <Stack.Screen name="Settings" component={SettingsPage} />
  </Stack.Navigator>
);

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginPage} />
    <Stack.Screen name="Registration" component={RegistrationPage} />
    <Stack.Screen name="Verification" component={VerificationPage} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordPage} />
  </Stack.Navigator>
);

const MainApp = () => {
  const screenOptions = ({ route }) => ({
    headerShown: false,
    tabBarStyle: { display: 'none' },
    tabBar: (props) => <NavigationBar {...props} currentRoute={route.name} />
  });

  return (
    <View style={styles.content}>
      <Header />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs">
          {() => (
            <Tab.Navigator
              screenOptions={screenOptions}
              tabBar={props => <NavigationBar {...props} />}
            >
              <Tab.Screen name="Home" component={HomeStack} />
              <Tab.Screen name="Account" component={AccountStack} />
              <Tab.Screen name="Notifications" component={NotificationsPage} />
              <Tab.Screen name="Create" component={CreatePage} />
            </Tab.Navigator>
          )}
        </Stack.Screen>
        <Stack.Screen name="UserAccountPage" component={UserAccountPage} />
      </Stack.Navigator>
    </View>
  );
};

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
        'SFProText-Regular': require('./assets/fonts/SFProText-Regular.otf'),
        'SFProText-Bold': require('./assets/fonts/SFProText-Bold.otf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null; // or return a loading screen
  }

  return (
    <PostProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <RepostProvider>
          <SafeAreaProvider>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={styles.container}>
              <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="Auth" component={AuthStack} />
                  <Stack.Screen name="MainApp" component={MainApp} />
                </Stack.Navigator>
              </NavigationContainer>
            </SafeAreaView>
          </SafeAreaProvider>
        </RepostProvider>
      </GestureHandlerRootView>
    </PostProvider>
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
