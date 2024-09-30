import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MAX_BIO_LENGTH = 200;

const EditProfileModal = ({ isVisible, onClose, onSave, initialProfile }) => {
  console.log('EditProfileModal received initialProfile:', initialProfile);
  const [name, setName] = useState(initialProfile.name || '');
  const [username, setUsername] = useState(initialProfile.username || '');
  const [bio, setBio] = useState(initialProfile.bio || '');
  const [usernameError, setUsernameError] = useState('');

  // Add this useEffect hook
  useEffect(() => {
    if (isVisible) {
      setName(initialProfile.name || '');
      setUsername(initialProfile.username || '');
      setBio(initialProfile.bio || '');
    }
  }, [isVisible, initialProfile]);

  const handleBioChange = (text) => {
    if (text.length <= MAX_BIO_LENGTH) {
      setBio(text);
    }
  };

  const handleUsernameChange = (text) => {
    if (text.includes('@')) {
      setUsernameError('Username cannot contain @');
    } else if (text.includes(' ')) {
      setUsernameError('Username cannot contain spaces');
    } else {
      setUsernameError('');
    }
    setUsername(text.trim()); // Remove any leading or trailing spaces
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    if (!username.trim()) {
      Alert.alert('Error', 'Username cannot be empty');
      return;
    }

    if (username.includes('@') || username.includes(' ')) {
      Alert.alert('Error', 'Username cannot contain @ or spaces');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId'); 
      const authorities = await AsyncStorage.getItem('authorities');

      // Only include fields that have changed
      const updatedProfile = {};
      if (name.trim() !== initialProfile.name) updatedProfile.name = name.trim();
      if (username.trim() !== initialProfile.username) updatedProfile.username = username.trim();
      if (bio !== initialProfile.bio) updatedProfile.bio = bio;

      // If nothing has changed, close the modal without making an API call
      if (Object.keys(updatedProfile).length === 0) {
        onClose();
        return;
      }

      const response = await axios.put(
        `http://localhost:8080/api/users/${userId}`,
        updatedProfile,
        { 
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-Authorities': authorities
          }
        }
      );

      if (response.status === 200) {
        // Merge the updated fields with the initial profile
        const savedProfile = { ...initialProfile, ...updatedProfile };
        onSave(savedProfile);
        onClose();
      } else {
        Alert.alert('Error', 'Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.response && error.response.status === 409) {
        Alert.alert('Error', 'This username is already taken. Please choose a different one.');
      } else if (error.response && error.response.data && error.response.data.message) {
        Alert.alert('Error', error.response.data.message);
      } else {
        Alert.alert('Error', 'Failed to update profile. Please try again.');
      }
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View style={styles.closeButtonContainer}>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.scrollView}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Add your name"
                placeholderTextColor="#666"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={handleUsernameChange}
                placeholder="Enter new username"
                placeholderTextColor="#666"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="off"
                spellCheck={false}
                keyboardType="visible-password" // This disables auto-suggestion on iOS
              />
              {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Bio</Text>
              <TextInput
                style={[styles.input, styles.bioInput]}
                value={bio}
                onChangeText={handleBioChange}
                placeholder="Add a bio to your profile"
                placeholderTextColor="#666"
                multiline
                maxLength={MAX_BIO_LENGTH}
              />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#000',
    marginTop: 51,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  closeButtonContainer: {
    width: 60,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  closeButton: {
    padding: 5,
    marginTop: 8, // Adjust this value to move the close button down
  },
  saveButton: {
    backgroundColor: '#333',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#111',
    color: '#fff',
    fontSize: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  bioInput: {
    height: 200,
    textAlignVertical: 'top',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
});

export default EditProfileModal;