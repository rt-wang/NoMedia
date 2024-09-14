import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsPage = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    loadPhoneNumber();
  }, []);

  const loadPhoneNumber = async () => {
    try {
      const savedPhoneNumber = await AsyncStorage.getItem('phoneNumber');
      if (savedPhoneNumber !== null) {
        setPhoneNumber(savedPhoneNumber);
      }
    } catch (error) {
      console.error('Failed to load phone number:', error);
    }
  };

  const handleSavePhoneNumber = async (number) => {
    try {
      await AsyncStorage.setItem('phoneNumber', number);
      setPhoneNumber(number);
    } catch (error) {
      console.error('Failed to save phone number:', error);
    }
  };

  const formatPhoneNumber = (text) => {
    const cleaned = ('' + text).replace(/\D/g, '');
    const match = cleaned.match(/^()?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      const intlCode = (match[1] ? '+1 ' : '');
      return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
    }
    return text;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Account')}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <View style={styles.settingItem}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={(text) => {
            const formattedNumber = formatPhoneNumber(text);
            handleSavePhoneNumber(formattedNumber);
          }}
          placeholder="(xxx) xxx-xxxx"
          placeholderTextColor="#666"
          keyboardType="phone-pad"
        />
      </View>
      <View style={styles.settingItem}>
        <Text style={styles.label}>Notifications</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#333" }}
          thumbColor={notificationsEnabled ? "#fff" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => setNotificationsEnabled(previousState => !previousState)}
          value={notificationsEnabled}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
  },
  backButton: {
    marginBottom: 24,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    color: '#fff',
    fontSize: 16,
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 8,
    borderRadius: 5,
    fontSize: 16,
    width: 150,
    textAlign: 'center', // Changed from 'right' to 'center'
  },
});

export default SettingsPage;