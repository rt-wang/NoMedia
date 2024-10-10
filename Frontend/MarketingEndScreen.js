import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

const MarketingEndScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>NoMedia.</Text>
        <Text style={styles.subtitle1}>For Your Mind</Text>
      </View>
      <View style={styles.subtitle2Container}>
        <Text style={styles.subtitle2}>waitlist in bio</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -40, // Adjust this value to move the content up
  },
  title: {
    fontSize: 52,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'Athelas',
    letterSpacing: 1,
    left: 5,
  },
  subtitle1: {
    fontSize: 24,
    color: '#FFFFFF',
    marginTop: 4,
    fontFamily: 'AbhayaLibre-Regular',
    letterSpacing: 0.5,
  },
  subtitle2Container: {
    position: 'absolute',
    bottom: 70, // Increased this value to move the text up
    alignSelf: 'center',
    borderColor: '#FFB6C1',
    borderWidth: 2,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  subtitle2: {
    fontSize: 26,
    color: '#FFF0F3',
    fontFamily: 'AbhayaLibre-Regular',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});

export default MarketingEndScreen;