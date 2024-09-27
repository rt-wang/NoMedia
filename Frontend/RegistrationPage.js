import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import axios from 'axios';

const LIGHT_PINK = '#FFB6C1';
const API_BASE_URL = `http://localhost:8080`; // Replace with your actual API base URL

const RegistrationPage = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/users/register`, {
        firstName,
        lastName,
        email,
        password
      });

      if (response.status === 200) {
        navigation.navigate('Verification', { email });
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'Registration failed. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Text style={styles.title}>Create Your Account</Text>
      <View style={styles.form}>
        <View style={styles.nameContainer}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
            autoCorrect={false}
            placeholderTextColor="#666"
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
            autoCorrect={false}
            placeholderTextColor="#666"
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          placeholderTextColor="#666"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#666"
          textContentType="oneTimeCode"
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholderTextColor="#666"
          textContentType="oneTimeCode"
        />
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>Already have an account?{' '}
          <Text style={styles.loginHighlight}>Log In</Text>
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
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
    marginBottom: 30,
    color: '#FFFFFF',
  },
  form: {
    width: '100%',
    maxWidth: 400,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#333333',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 15,
    color: '#FFFFFF',
    backgroundColor: '#111111',
    fontSize: 16,
  },
  halfInput: {
    width: '48%',
  },
  button: {
    backgroundColor: '#FAF9F6',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 0,
  },
  buttonText: {
    color: "#000",
    fontSize: 18,
    fontFamily: 'AbhayaLibre-Regular',
  },
  loginText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'AbhayaLibre-Regular',
    marginTop: 15,
  },
  loginHighlight: {
    color: LIGHT_PINK,
    fontSize: 16,
    fontFamily: 'AbhayaLibre-Bold',
    textDecorationLine: 'underline',
  },
});

export default RegistrationPage;