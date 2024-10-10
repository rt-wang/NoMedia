import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const WelcomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to NoMedia.</Text>
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
    fontSize: 34,
    color: '#FFFFFF',
    fontFamily: 'Athelas-Bold', // Note: You may need to ensure this font is available in your project
    textAlign: 'center',
    left: 1,
  },
});

export default WelcomeScreen;