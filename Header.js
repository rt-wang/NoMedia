import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Header = () => (
  <View style={styles.header}>
    <Text style={styles.headerText}>NoMedia.</Text>
  </View>
);

const styles = StyleSheet.create({
  header: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  headerText: {
    fontFamily:'Athelas',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default Header;