import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const WelcomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}><Text style={styles.welcomeTextBold}></Text>I. Intellectual Feed</Text>
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
    fontSize: 32,
    color: '#FFFFFF',
    fontFamily: 'Athelas-Bold', // Note: You may need to ensure this font is available in your project
    textAlign: 'center',
    left: 1,
  },
  welcomeTextBold: {
    fontFamily: 'Athelas-Regular',
    fontSize: 47,
  },
});

export default WelcomeScreen;