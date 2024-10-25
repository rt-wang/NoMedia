import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const NotesEditorPage = () => {
  const [note, setNote] = useState('');
  const [isTypewriterMode, setIsTypewriterMode] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.navigate('ChronologicalNotes');
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const toggleTypewriterMode = () => {
    setIsTypewriterMode(!isTypewriterMode);
  };

  const renderFormatToolbar = () => {
    // Implement floating toolbar for text formatting
    return (
      <View style={styles.formatToolbar}>
        {/* Add formatting buttons here */}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={24} color="#FFB6C1" />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleTypewriterMode}>
          <Text style={styles.typewriterButton}>
            {isTypewriterMode ? 'Normal' : 'Typewriter'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShare}>
          <Ionicons name="share-outline" size={24} color="#FFB6C1" />
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <TextInput
          style={[styles.noteInput, isTypewriterMode && styles.typewriterInput]}
          multiline
          value={note}
          onChangeText={setNote}
          placeholder="Start typing..."
          placeholderTextColor="#666"
        />
      </KeyboardAvoidingView>
      {renderFormatToolbar()}
      <Modal
        visible={showShareModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Share to social media?</Text>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => {
                // Implement share functionality
                setShowShareModal(false);
              }}
            >
              <Text style={styles.modalButtonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => setShowShareModal(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    marginTop: -75,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  typewriterButton: {
    color: '#FFB6C1',
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  noteInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 18,
    padding: 16,
  },
  typewriterInput: {
    textAlignVertical: 'center',
  },
  formatToolbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#111',
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#111',
    padding: 20,
    borderRadius: 0,
    alignItems: 'center',
  },
  modalText: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#FFB6C1',
    padding: 10,
    marginTop: 10,
    width: 150,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#000000',
    fontSize: 16,
  },
});

export default NotesEditorPage;