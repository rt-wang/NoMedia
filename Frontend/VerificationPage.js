import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const LIGHT_PINK = '#FFB6C1';
const INACTIVE_BUTTON = '#666666';
const API_BASE_URL = `http://localhost:8080`; // Replace with your actual API base URL

const VerificationPage = ({ route, navigation }) => {
  const { email } = route.params;
  const [verificationCode, setVerificationCode] = useState('');
  const [username, setUsername] = useState('');
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [isUsernameValid, setIsUsernameValid] = useState(false);

  useEffect(() => {
    setIsUsernameValid(username.length >= 3);
  }, [username]);

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

  const handleSetUsername = async () => {
    if (isUsernameValid) {
      try {
        const response = await axios.post(`${API_BASE_URL}/api/users/set-username`, {
          email,
          username
        });

        if (response.status === 200) {
          navigation.replace('MainApp');
        }
      } catch (error) {
        console.error('Set username error:', error);
        Alert.alert('Error', 'Failed to set username. Please try again.');
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
          <TextInput
            style={styles.input}
            placeholder="Enter username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
            placeholderTextColor="#666"
          />
          <TouchableOpacity 
            style={[styles.button, !isUsernameValid && styles.inactiveButton]} 
            onPress={handleSetUsername}
            disabled={!isUsernameValid}
          >
            <Text style={styles.buttonText}>Continue to platform</Text>
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
});

export default VerificationPage;