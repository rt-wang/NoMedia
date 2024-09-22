import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LIGHT_PINK = '#FFB6C1';

const FeedbackForm = ({ navigation }) => {
  const [improvements, setImprovements] = useState('');
  const [likes, setLikes] = useState('');

  const handleSubmit = () => {
    // Here you would typically send the feedback to your server
    console.log('Improvements:', improvements);
    console.log('Likes:', likes);
    // After submitting, you might want to navigate back or show a confirmation
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
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
    backgroundColor: '#FAF9F6',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: "#000",
    fontSize: 18,
    fontFamily: 'AbhayaLibre-Regular',
  },
});

export default FeedbackForm;