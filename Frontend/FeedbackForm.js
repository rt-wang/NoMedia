import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MarketingEndScreen from './MarketingEndScreen'; // Make sure to import this

const LIGHT_PINK = '#FFB6C1';

const FeedbackForm = ({ navigation }) => {
  const [improvements, setImprovements] = useState('');
  const [likes, setLikes] = useState('');

  const handleSubmit = () => {
    console.log('Improvements:', improvements);
    console.log('Likes:', likes);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <TouchableOpacity 
        style={styles.visibleButton} 
        onPress={() => navigation.navigate('CommentSpectrumPage')}
      >
        <Text style={styles.visibleButtonText}>Comment Spectrum</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.visibleButton} 
        onPress={() => navigation.navigate('WelcomeScreen')}
      >
        <Text style={styles.visibleButtonText}>Welcome to NoMedia</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.visibleButton} 
        onPress={() => navigation.navigate('MarketingEndScreen')}
      >
        <Text style={styles.visibleButtonText}>Marketing End Screen</Text>
      </TouchableOpacity>

      <Text style={styles.label}>What's missing?</Text>
      <TextInput
        style={styles.input}
        multiline
        numberOfLines={4}
        onChangeText={setImprovements}
        value={improvements}
        placeholder="Text"
        placeholderTextColor="#666"
      />

      <Text style={styles.label}>How would you use NoMedia?</Text>
      <TextInput
        style={styles.input}
        multiline
        numberOfLines={4}
        onChangeText={setLikes}
        value={likes}
        placeholder="Text"
        placeholderTextColor="#666"
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Feedback</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.visibleButton}
        onPress={() => navigation.navigate('CommentDistribution')}
      >
        <Text style={styles.visibleButtonText}>Comment Distribution</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingTop: 40,
  },
  contentContainer: {
    padding: 20,
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 10,
    fontFamily: 'AbhayaLibre-Regular',
  },
  input: {
    width: '100%',
    height: 100,
    borderColor: '#333333',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 25,
    paddingHorizontal: 15,
    paddingTop: 10,
    color: '#FFFFFF',
    backgroundColor: '#111111',
    fontSize: 16,
    fontFamily: 'AbhayaLibre-Regular',
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: LIGHT_PINK,
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: "#000",
    fontSize: 18,
    fontFamily: 'AbhayaLibre-Regular',
  },
  visibleButton: {
    backgroundColor: LIGHT_PINK,
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  visibleButtonText: {
    color: '#000000',
    fontSize: 16,
    fontFamily: 'AbhayaLibre-Regular',
  },
});

export default FeedbackForm;