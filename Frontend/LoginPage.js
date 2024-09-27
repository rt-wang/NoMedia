import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LIGHT_PINK = '#FFB6C1';

const LoginPage = ({ navigation }) => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // This is a mock login. In a real app, you'd validate against a backend.
    if (emailOrUsername && password) {
      try {
        // Store the user info
        await AsyncStorage.setItem('currentUser', emailOrUsername);
        // Navigate to the main app
        navigation.replace('MainApp');
      } catch (error) {
        Alert.alert('Error', 'Failed to log in. Please try again.');
      }
    } else {
      Alert.alert('Error', 'Please enter both email/username and password.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to NoMedia</Text>
      <TextInput
        style={styles.input}
        placeholder="Username or Email"
        value={emailOrUsername}
        onChangeText={setEmailOrUsername}
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
      />
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
        <Text style={styles.registerText}>Don't have an account?{' '}
            <Text style={styles.registerHighlight}>Register</Text>
        </Text>
      </TouchableOpacity>
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
    marginBottom: 30,
    color: '#FFFFFF',
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
    marginBottom: 15,
  },
  buttonText: {
    color: "#000",
    fontSize: 18,
    fontFamily: 'AbhayaLibre-Regular',
  },
  registerText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'AbhayaLibre-Regular',
  },
  registerHighlight: {
    color: LIGHT_PINK,
    fontSize: 16,
    fontFamily: 'AbhayaLibre-Bold',
    textDecorationLine: 'underline',
  },
  forgotPasswordText: {
    color: '#888888',
    fontSize: 13,
    fontWeight: '400',
    fontFamily: 'AbhayaLibre-Regular',
    alignSelf: 'flex-start',
    marginBottom: 16,
    marginTop: -18,
    marginLeft: 0,
    width: '100%',
    left: 120,
  },
});

export default LoginPage;