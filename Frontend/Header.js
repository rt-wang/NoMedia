import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Header = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.iconContainer}
        onPress={() => navigation.navigate('Account')}
      >
        <Ionicons name="person-outline" size={24} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.headerText}>NoMedia.</Text>
      <TouchableOpacity 
        style={[styles.iconContainer, styles.iconPadding]}
        onPress={() => navigation.navigate('NotificationsPage')}
      >
        <Ionicons name="heart-outline" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#000',
    paddingHorizontal: 16,
    marginTop: -8,
  },
  headerText: {
    fontFamily: 'Athelas',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: -3,
  },
  iconContainer: {
    padding: 5,
    width: 34,
  },
  iconPadding: {
    marginRight: 3,
  },
});

export default Header;
