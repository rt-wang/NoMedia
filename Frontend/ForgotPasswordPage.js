import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const LIGHT_PINK = '#FFB6C1';
const API_BASE_URL = `http://localhost:8080`;

const ForgotPasswordPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendCode = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/users/forgot-password`, { email });
      if (response.status === 200) {
        setStep(2);
        setCountdown(60);
        Alert.alert('Success', 'Verification code sent to your email.');
      }
    } catch (error) {
      console.error('Send code error:', error);
      Alert.alert('Error', 'Failed to send verification code. Please try again.');
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      Alert.alert('Error', 'Please enter the verification code.');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/users/verify-code`, { email, verificationCode });
      if (response.status === 200) {
        setStep(3);
      }
    } catch (error) {
      console.error('Verify code error:', error);
      Alert.alert('Error', 'Invalid verification code. Please try again.');
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmNewPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/users/reset-password`, { email, newPassword, verificationCode });
      if (response.status === 200) {
        Alert.alert('Success', 'Your password has been reset.', [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]);
      }
    } catch (error) {
      console.error('Reset password error:', error);
      Alert.alert('Error', 'Failed to reset password. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
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
        placeholder="Verification Code"
        value={verificationCode}
        onChangeText={setVerificationCode}
        keyboardType="numeric"
        placeholderTextColor="#666"
      />
      {step === 1 && (
        <TouchableOpacity style={styles.button} onPress={handleSendCode}>
          <Text style={styles.buttonText}>Send Code</Text>
        </TouchableOpacity>
      )}
      {step === 2 && (
        <>
          <TouchableOpacity style={styles.button} onPress={handleVerifyCode}>
            <Text style={styles.buttonText}>Verify Code</Text>
          </TouchableOpacity>
          {countdown > 0 ? (
            <Text style={styles.countdownText}>Resend code in {countdown}s</Text>
          ) : (
            <TouchableOpacity onPress={handleSendCode}>
              <Text style={styles.resendText}>Resend Code</Text>
            </TouchableOpacity>
          )}
        </>
      )}
      {step === 3 && (
        <>
          <TextInput
            style={styles.input}
            placeholder="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            placeholderTextColor="#666"
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm New Password"
            value={confirmNewPassword}
            onChangeText={setConfirmNewPassword}
            secureTextEntry
            placeholderTextColor="#666"
          />
          <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
            <Text style={styles.buttonText}>Reset Password</Text>
          </TouchableOpacity>
        </>
      )}
      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.backButton}>
        <Text style={styles.backButtonText}>Back to Login</Text>
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
  countdownText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'AbhayaLibre-Regular',
    marginBottom: 15,
  },
  resendText: {
    color: LIGHT_PINK,
    fontSize: 14,
    fontFamily: 'AbhayaLibre-Regular',
    textDecorationLine: 'underline',
    marginBottom: 15,
  },
  backButton: {
    marginTop: 10,
  },
  backButtonText: {
    color: LIGHT_PINK,
    fontSize: 16,
    fontFamily: 'AbhayaLibre-Bold',
    textDecorationLine: 'underline',
  },
});

export default ForgotPasswordPage;