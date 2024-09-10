import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const LIGHT_GREY = '#CCCCCC';
const WHITE = '#FFFFFF';
const BLACK = '#000000';
const DARK_GREY = '#333333';

const NavigationBar = ({ activePage = 'home' }) => {
  const navigation = useNavigation();

  const navigateTo = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[
          styles.iconContainer, 
          activePage === 'home' && styles.activeIconContainer
        ]}
        onPress={() => navigateTo('Home')}
      >
        <Ionicons 
          name="home" 
          size={24} 
          color={activePage === 'home' ? BLACK : LIGHT_GREY} 
        />
      </TouchableOpacity>
      <TouchableOpacity 
        style={[
          styles.iconContainer, 
          activePage === 'ai' && styles.activeIconContainer
        ]}
        onPress={() => navigateTo('AI')}
      >
        <Text style={[
          styles.aiText, 
          { color: activePage === 'ai' ? BLACK : LIGHT_GREY }
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
          activePage === 'notifications' && styles.activeIconContainer
        ]}
        onPress={() => navigateTo('Notifications')}
      >
        <Ionicons 
          name="notifications" 
          size={24} 
          color={activePage === 'notifications' ? BLACK : LIGHT_GREY}
        />
      </TouchableOpacity>
      <TouchableOpacity 
        style={[
          styles.iconContainer, 
          activePage === 'account' && styles.activeIconContainer
        ]}
        onPress={() => navigateTo('Account')}
      >
        <Ionicons 
          name="person" 
          size={24} 
          color={activePage === 'account' ? BLACK : LIGHT_GREY} 
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
