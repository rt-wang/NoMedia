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
      navigation.navigate('Home', { screen: 'ForYou' });
    } else if (screen === 'NomsPage') {
      navigation.navigate('Home', { screen: 'NomsPage' });
    } else if (screen === 'Saved') {
      navigation.navigate('Saved');
    } else {
      navigation.navigate(screen);
    }
  };

  const isActive = (screenName) => {
    const currentRoute = state.routes[state.index];
    if (screenName === 'Home') {
      return currentRoute.name === 'Home' || currentRoute.name === 'Threads' || currentRoute.name === 'ReadNext' || currentRoute.name === 'ForYou';
    }
    if (screenName === 'NomsPage') {
      return currentRoute.name === 'NomsPage';
    }
    return currentRoute.name === screenName;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.createButtonContainer}
        onPress={() => navigateTo('Create')}
      >
        <Ionicons name="document-text-outline" size={24} color={WHITE} />
      </TouchableOpacity>
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
          isActive('NomsPage') && styles.activeIconContainer
        ]}
        onPress={() => navigateTo('NomsPage')}
      >
        <Text style={[
          styles.nomsText, 
          { color: isActive('NomsPage') ? BLACK : LIGHT_GREY }
        ]}>
          /
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[
          styles.iconContainer, 
          isActive('Saved') && styles.activeIconContainer
        ]}
        onPress={() => navigateTo('Saved')}
      >
        <Ionicons 
          name="bookmark-outline" 
          size={24} 
          color={isActive('Saved') ? BLACK : LIGHT_GREY} 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    backgroundColor: BLACK,
    paddingBottom: 5,
    paddingHorizontal: 16,
  },
  iconContainer: {
    padding: 10,
    borderRadius: 20,
  },
  activeIconContainer: {
    backgroundColor: WHITE,
  },
  createButtonContainer: {
    backgroundColor: DARK_GREY,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -8,
    borderWidth: 4,
    borderColor: BLACK,
  },
  nomsText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
});

export default NavigationBar;
