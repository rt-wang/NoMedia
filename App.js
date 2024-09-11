import React, { useState, useEffect } from 'react';
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
import CommentModal from './CommentModal';
import Threads from './Threads';
import ReadNext from './ReadNext';

import * as Font from 'expo-font';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = ({ showCommentModal }) => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ForYou">
      {(props) => <ForYouPage {...props} showCommentModal={showCommentModal} />}
    </Stack.Screen>
    <Stack.Screen name="Threads" component={Threads} />
    <Stack.Screen name="ReadNext" component={ReadNext} />
  </Stack.Navigator>
);

const CustomTransition = ({ current, next, inverted, layouts: { screen } }) => {
  // ... (keep existing CustomTransition logic)
};

const screenOptions = ({ route }) => ({
  headerShown: false,
  tabBarStyle: { display: 'none' },
  tabBar: (props) => <NavigationBar {...props} currentRoute={route.name} />
});

const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

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

  const showCommentModal = (post) => {
    console.log("showCommentModal called with post:", post);
    setSelectedPost(post);
    setCommentModalVisible(true);
  };

  const hideCommentModal = () => {
    setCommentModalVisible(false);
    setSelectedPost(null);
  };

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
              screenOptions={screenOptions}
              tabBar={props => <NavigationBar {...props} />}
            >
              <Tab.Screen name="Home">
                {(props) => (
                  <HomeStack {...props} showCommentModal={showCommentModal} />
                )}
              </Tab.Screen>
              <Tab.Screen name="Account" component={AccountPage} />
              <Tab.Screen name="Notifications" component={NotificationsPage} />
              <Tab.Screen name="Create" component={CreatePage} />
            </Tab.Navigator>
          </View>
        </NavigationContainer>
        <CommentModal
          isVisible={commentModalVisible}
          onClose={hideCommentModal}
          originalPost={selectedPost}
          onPostComment={(comment) => {
            console.log('Posted comment:', comment);
            hideCommentModal();
          }}
        />
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
