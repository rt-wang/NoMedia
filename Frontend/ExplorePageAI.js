import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SearchBar = () => (
  <View style={styles.searchBarContainer}>
    <TextInput style={styles.searchBar} placeholder="Search NoMedia" placeholderTextColor="#999" />
    <Ionicons name="search" size={24} color="#999" style={styles.searchIcon} />
  </View>
);

const ExplorePageAI = () => {
  return (
    <View style={styles.container}>
      <SearchBar />
      <Text style={styles.text}>Coming soon</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
  },
  text: {
    color: '#fff',
    fontSize: 24,
    textAlign: 'center',
    marginTop: 20,
  },
  searchBarContainer: {
    marginBottom: 16,
  },
  searchBar: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 10,
    paddingLeft: 40,
    color: '#fff',
  },
  searchIcon: {
    position: 'absolute',
    left: 10,
    top: 8,
  },
});

export default ExplorePageAI;
