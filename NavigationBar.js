import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LIGHT_GREY = '#CCCCCC';
const WHITE = '#FFFFFF';
const BLACK = '#000000';
const DARK_GREY = '#333333';

const NavigationBar = ({ state, descriptors, navigation }) => {
  const navigateTo = (screen) => {
    if (screen === 'Home') {
      // Always navigate to the ForYouPage when Home is tapped
      navigation.navigate('Home', { screen: 'ForYou' });
    } else {
      navigation.navigate(screen);
    }
  };

  const isActive = (screenName) => {
    const currentRoute = state.routes[state.index];
    if (screenName === 'Home') {
      return currentRoute.name === 'Home' || currentRoute.name === 'Threads' || currentRoute.name === 'ReadNext' || currentRoute.name === 'ForYou';
    }
    return currentRoute.name === screenName && screenName !== 'Create';
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[
          styles.iconContainer, 
          isActive('Home') && styles.activeIconContainer
        ]}
        onPress={() => navigateTo('Home')}
      >
        <Ionicons 
          name="home" 
          size={24} 
          color={isActive('Home') ? BLACK : LIGHT_GREY} 
        />
      </TouchableOpacity>
      <TouchableOpacity 
        style={[
          styles.iconContainer, 
          isActive('AI') && styles.activeIconContainer
        ]}
        onPress={() => navigateTo('AI')}
      >
        <Text style={[
          styles.aiText, 
          { color: isActive('AI') ? BLACK : LIGHT_GREY }
        ]}>
          AI
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.addButtonContainer}
        onPress={() => navigateTo('Create')}
      >
        <Ionicons name="add" size={32} color={WHITE} />
      </TouchableOpacity>
      <TouchableOpacity 
        style={[
          styles.iconContainer,
          isActive('Notifications') && styles.activeIconContainer
        ]}
        onPress={() => navigateTo('Notifications')}
      >
        <Ionicons 
          name="notifications" 
          size={24} 
          color={isActive('Notifications') ? BLACK : LIGHT_GREY}
        />
      </TouchableOpacity>
      <TouchableOpacity 
        style={[
          styles.iconContainer, 
          isActive('Account') && styles.activeIconContainer
        ]}
        onPress={() => navigateTo('Account')}
      >
        <Ionicons 
          name="person" 
          size={24} 
          color={isActive('Account') ? BLACK : LIGHT_GREY} 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: BLACK,
    paddingBottom: 5,
  },
  iconContainer: {
    padding: 10,
    borderRadius: 20,
  },
  activeIconContainer: {
    backgroundColor: WHITE,
  },
  addButtonContainer: {
    backgroundColor: DARK_GREY,
    width: 65,
    height: 65,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -8,
    borderWidth: 4,
    borderColor: BLACK,
  },
  aiText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});

export default NavigationBar;
