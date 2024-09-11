import React, { useState } from 'react';
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
import CommentModal from './CommentModal'; // Add this import
// Import other pages as needed

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
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const showCommentModal = (post) => {
    setSelectedPost(post);
    setCommentModalVisible(true);
  };

  const hideCommentModal = () => {
    setCommentModalVisible(false);
    setSelectedPost(null);
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator screenOptions={screenOptions}>
          <Tab.Screen name="Home">
            {(props) => (
              <AppContent {...props}>
                <ForYouPage {...props} showCommentModal={showCommentModal} />
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
          {/* Add other screens here */}
        </Tab.Navigator>
        <CommentModal
          isVisible={commentModalVisible}
          onClose={hideCommentModal}
          originalPost={selectedPost}
          onPostComment={(comment) => {
            // Handle posting comment
            console.log('Posted comment:', comment);
            hideCommentModal();
          }}
        />
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
