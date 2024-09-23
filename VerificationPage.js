import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const LIGHT_PINK = '#FFB6C1';
const INACTIVE_BUTTON = '#666666';

const VerificationPage = ({ route, navigation }) => {
  const { email } = route.params;
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeComplete, setIsCodeComplete] = useState(false);

  useEffect(() => {
    setIsCodeComplete(verificationCode.length === 6);
  }, [verificationCode]);

  const handleContinue = () => {
    if (isCodeComplete) {
      // Here you would implement the logic to verify the code
      // For this example, we'll just navigate to the main app
      navigation.replace('MainApp');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Your Email</Text>
      <Text style={styles.subtitle}>Verification email sent to {email}</Text>
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
        style={[styles.button, !isCodeComplete && styles.inactiveButton]} 
        onPress={handleContinue}
        disabled={!isCodeComplete}
      >
        <Text style={styles.buttonText}>Continue to platform</Text>
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