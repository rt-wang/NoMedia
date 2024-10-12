import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const WelcomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>We all need mental exercise</Text>
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
    fontFamily: 'Athelas-Bold', // Note: You may need to ensure this font is available in your project
    textAlign: 'center',
    left: 0,
  },
});

export default WelcomeScreen;