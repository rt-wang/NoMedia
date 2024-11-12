import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CollectionsPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Coming soon</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 30,
    color: '#FFFFFF',
    fontFamily: 'Athelas-Bold',
    textAlign: 'center',
    left: 0,
  },
});

export default CollectionsPage;
