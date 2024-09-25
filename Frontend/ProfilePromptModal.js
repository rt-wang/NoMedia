import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const ProfilePromptModal = ({ visible, onClose, onNavigateToProfile }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#888" />
          </TouchableOpacity>
          <Text style={styles.modalText}>Add a bio to your profile</Text>
          <TouchableOpacity style={styles.button} onPress={onNavigateToProfile}>
            <Text style={styles.buttonText}>Update Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};


const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalView: {
    backgroundColor: 'rgba(28, 28, 30, 0.95)',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    width: width * 0.85,
    maxWidth: 400,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 5,
    top: -12,
    left: 6
  },
  modalText: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 18,
    color: '#fff',
    fontFamily: 'SFProText-Semibold',
    letterSpacing: 0.5,
  },
  button: {
    backgroundColor: '#FAF9F6', // Changed to match login/registration button color
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginTop: 10,
  },
  buttonText: {
    color: "#000", // Changed to match login/registration button text color
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'AbhayaLibre-Regular',
  },
});

export default ProfilePromptModal;