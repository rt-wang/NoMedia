import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const LIGHT_GREY = '#CCCCCC';
const WHITE = '#FFFFFF';
const BLACK = '#000000';

const NavigationBar = ({ state, descriptors, navigation: propNavigation }) => {
  const navigation = propNavigation || useNavigation();
  const route = useRoute();

  const navigateTo = (screen) => {
    if (screen === 'Home') {
      navigation.navigate('Home', { screen: 'ForYou' });
    } else if (screen === 'NomsPage') {
      navigation.navigate('Home', { screen: 'NomsPage' });
    } else if (screen === 'Saved') {
      navigation.navigate('Saved');
    } else if (screen === 'NotesEditorPage') {
      navigation.navigate('NotesEditorPage');
    } else {
      navigation.navigate(screen);
    }
  };

  const isActive = (screenName) => {
    const currentRouteName = state?.routes?.[state.index]?.name || route.name;
    if (screenName === 'Home') {
      return ['Home', 'Threads', 'ReadNext', 'ForYou'].includes(currentRouteName);
    }
    if (screenName === 'NomsPage') {
      return currentRouteName === 'NomsPage';
    }
    if (screenName === 'NotesEditorPage') {
      return currentRouteName === 'NotesEditorPage';
    }
    return currentRouteName === screenName;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.iconContainer}
        onPress={() => navigateTo('NotesEditorPage')}
      >
        <Ionicons 
          name="document-text-outline" 
          size={24} 
          color={isActive('NotesEditorPage') ? WHITE : LIGHT_GREY} 
        />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.iconContainer}
        onPress={() => navigateTo('Home')}
      >
        <Ionicons 
          name="home" 
          size={24} 
          color={isActive('Home') ? WHITE : LIGHT_GREY} 
        />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.iconContainer}
        onPress={() => navigateTo('NomsPage')}
      >
        <Ionicons 
          name="people-outline" 
          size={24} 
          color={isActive('NomsPage') ? WHITE : LIGHT_GREY} 
        />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.iconContainer}
        onPress={() => navigateTo('Saved')}
      >
        <Ionicons 
          name="bookmark-outline" 
          size={24} 
          color={isActive('Saved') ? WHITE : LIGHT_GREY} 
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
});

export default NavigationBar;
