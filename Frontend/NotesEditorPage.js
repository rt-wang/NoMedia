import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const THEME_PINK = '#FFC6D1';

const NotesEditorPage = () => {
  const [note, setNote] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.navigate('ChronologicalNotes');
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const renderFormatToolbar = () => {
    // Implement floating toolbar for text formatting
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={24} color={THEME_PINK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Typewriter</Text>
        <TouchableOpacity onPress={handleShare}>
          <Ionicons name="paper-plane-outline" size={24} color={THEME_PINK} />
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.noteContainer}
      >
        <TextInput
          style={styles.noteInput}
          multiline
          value={note}
          onChangeText={setNote}
          placeholder="Start typing..."
          placeholderTextColor="#666"
        />
        {renderFormatToolbar()}
      </KeyboardAvoidingView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showShareModal}
        onRequestClose={() => setShowShareModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Share options go here</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowShareModal(false)}
            >
              <Text style={styles.modalButtonText}>Close</Text>
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
    paddingRight: 20,
  },
  headerTitle: {
    color: THEME_PINK,
    fontSize: 18,
    fontWeight: 'bold',
  },
  noteContainer: {
    flex: 1,
    padding: 16,
  },
  noteInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#111',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: THEME_PINK,
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#000000',
    fontSize: 16,
  },
});

export default NotesEditorPage;
