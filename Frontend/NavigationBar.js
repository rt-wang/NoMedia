import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const INACTIVE_COLOR = '#808080';  // Slightly lighter grey for non-selected icons
const ACTIVE_COLOR = '#FFFFFF';    // White for selected icon
const BLACK = '#000000';

const NavigationBar = ({ state, descriptors, navigation: propNavigation }) => {
  const navigation = propNavigation || useNavigation();
  const route = useRoute();

  const navigateTo = (screen) => {
    if (screen === 'Home') {
      navigation.navigate('Home', { screen: 'ForYou' });
    } else if (screen === 'NomsPage') {
      navigation.navigate('NomsPage');
    } else if (screen === 'Collections') {
      navigation.navigate('Collections');
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
    if (screenName === 'Collections') {
      return currentRouteName === 'Collections';
    }
    return currentRouteName === screenName;
  };

  const getIconProps = (screenName, iconName) => {
    const active = isActive(screenName);
    return {
      name: active ? iconName : `${iconName}-outline`,  // Use filled icon when active
      size: 24,  // Keep consistent size
      color: active ? ACTIVE_COLOR : INACTIVE_COLOR,
      style: active ? styles.activeIcon : styles.icon
    };
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.iconContainer}
        onPress={() => navigateTo('NotesEditorPage')}
      >
        <Ionicons {...getIconProps('NotesEditorPage', 'document-text')} />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.iconContainer}
        onPress={() => navigateTo('Home')}
      >
        <Ionicons {...getIconProps('Home', 'home')} />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.iconContainer}
        onPress={() => navigateTo('NomsPage')}
      >
        <Ionicons {...getIconProps('NomsPage', 'people')} />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.iconContainer}
        onPress={() => navigateTo('Collections')}
      >
        <Ionicons {...getIconProps('Collections', 'bookmark')} />
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    opacity: 0.9,  // Less dim for inactive icons
  },
  activeIcon: {
    transform: [{scale: 1.05}],  // Smaller scale difference
    opacity: 1,    // Full opacity for active icon
  },
});

export default NavigationBar;
