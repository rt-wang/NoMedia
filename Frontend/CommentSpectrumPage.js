import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';

const LIGHTER_PINK = '#FFF0F5';
const MEDIUM_PINK = '#FFD1DC';

const CommentSpectrumPage = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Instant Productivity</Text>
        <View style={styles.subtitle2Container}>
          <Text style={styles.subtitle2}>Lock in EZ</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  contentContainer: {
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 30, // Added to match CommentDistributionPage
  },
  title: {
    fontSize: 42,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'AbhayaLibre-Bold',
    paddingBottom: 150,
    alignSelf: 'center',
    width: '100%',
  },
  subtitle2Container: {
    borderColor: MEDIUM_PINK,
    borderWidth: 2,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 20,
    alignSelf: 'center',
  },
  subtitle2: {
    fontSize: 40,
    color: LIGHTER_PINK,
    fontFamily: 'AbhayaLibre-Regular',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});

export default CommentSpectrumPage;