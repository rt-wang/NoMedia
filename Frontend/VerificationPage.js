import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const LIGHT_PINK = '#FFB6C1';
const INACTIVE_BUTTON = '#666666';
const API_BASE_URL = `http://localhost:8080`; // Replace with your actual API base URL

const VerificationPage = ({ route, navigation }) => {
  const { name, email, password } = route.params;
  const [verificationCode, setVerificationCode] = useState('');
  const [username, setUsername] = useState('');
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [usernameError, setUsernameError] = useState('');

  const handleVerify = async () => {
    try {
      // Here you would implement the logic to verify the code
      // For this example, we'll just set isCodeVerified to true
      setIsCodeVerified(true);
    } catch (error) {
      console.error('Verification error:', error);
      Alert.alert('Error', 'Verification failed. Please try again.');
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
    setUsername(text);
    setIsUsernameValid(text.length >= 3 && !text.includes('@') && !text.includes(' '));
  };

  const handleCompleteRegistration = async () => {
    if (isUsernameValid) {
      try {
        const response = await axios.post(`${API_BASE_URL}/api/users/register`, {
          name,
          username,
          email,
          password
        });

        if (response.status === 200) {
          // Registration successful, navigate to the login page
          navigation.replace('Login');
        }
      } catch (error) {
        console.error('Registration error:', error);
        if (error.response && error.response.status === 409) {
          Alert.alert('Error', 'This username is already taken. Please choose a different one.');
        } else if (error.response && error.response.data && error.response.data.message) {
          Alert.alert('Error', error.response.data.message);
        } else {
          Alert.alert('Error', 'Registration failed. Please try again.');
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Your Email</Text>
      <Text style={styles.subtitle}>Verification email sent to {email}</Text>
      {!isCodeVerified ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter verification code"
            value={verificationCode}
            onChangeText={setVerificationCode}
            keyboardType="numeric"
            maxLength={6}
            placeholderTextColor="#666"
          />
          <TouchableOpacity 
            style={[styles.button, verificationCode.length !== 6 && styles.inactiveButton]} 
            onPress={handleVerify}
            disabled={verificationCode.length !== 6}
          >
            <Text style={styles.buttonText}>Verify</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.subtitle}>Choose your username</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter username"
              value={username}
              onChangeText={handleUsernameChange}
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor="#666"
            />
            {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}
          </View>
          <TouchableOpacity 
            style={[styles.button, !isUsernameValid && styles.inactiveButton]} 
            onPress={handleCompleteRegistration}
            disabled={!isUsernameValid}
          >
            <Text style={styles.buttonText}>Complete Registration</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#000000',
  },
  title: {
    fontSize: 28,
    fontFamily: 'AbhayaLibre-Bold',
    marginBottom: 10,
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'AbhayaLibre-Regular',
    marginBottom: 30,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#333333',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 25,
    paddingHorizontal: 15,
    color: '#FFFFFF',
    backgroundColor: '#111111',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FAF9F6',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  inactiveButton: {
    backgroundColor: INACTIVE_BUTTON,
  },
  buttonText: {
    color: "#000",
    fontSize: 18,
    fontFamily: 'AbhayaLibre-Regular',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 25,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
});

export default VerificationPage;