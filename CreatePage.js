import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Modal, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';

const CreatePage = () => {
  const [postType, setPostType] = useState('Nom');
  const [showDropdown, setShowDropdown] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [showPromptSearch, setShowPromptSearch] = useState(false);
  const [promptSearch, setPromptSearch] = useState('');
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) {
      if (title === '' && body === '') {
        setPostType('Nom');
      }
    }
  }, [isFocused, title, body]);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const selectPostType = (type) => {
    setPostType(type);
    setShowDropdown(false);
  };

  const renderDropdownItem = ({ item }) => (
    <TouchableOpacity style={styles.dropdownItem} onPress={() => selectPostType(item)}>
      <Text style={styles.dropdownItemText}>{item}</Text>
      {item === postType && <Ionicons name="checkmark" size={20} color="#000" />}
    </TouchableOpacity>
  );

  return (
    <TouchableWithoutFeedback onPress={() => setShowPromptSearch(false)}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.postTypeButton} onPress={toggleDropdown}>
            <Text style={styles.postTypeText}>{postType}</Text>
            <Ionicons name="chevron-down" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.postButton}>
            <Text style={styles.postButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
        {showDropdown && (
          <FlatList
            style={styles.dropdown}
            data={['Nom', 'Prompt']}
            renderItem={renderDropdownItem}
            keyExtractor={(item) => item}
          />
        )}
        {postType === 'Prompt' ? (
          <View style={styles.promptInputContainer}>
            <Text style={styles.promptPrefix}>/</Text>
            <TextInput
              style={styles.promptInput}
              placeholder="your question?"
              placeholderTextColor="#999"
              value={title}
              onChangeText={setTitle}
            />
          </View>
        ) : (
          <>
            <TextInput
              style={styles.titleInput}
              placeholder="Title"
              placeholderTextColor="#999"
              value={title}
              onChangeText={setTitle}
            />
            <View style={styles.bodyContainer}>
              <TextInput
                style={styles.bodyInput}
                placeholder="body text"
                placeholderTextColor="#999"
                multiline
                value={body}
                onChangeText={setBody}
              />
            </View>
          </>
        )}
        {postType === 'Nom' && (
          <TouchableOpacity 
            style={styles.addPromptButton} 
            onPress={() => setShowPromptSearch(true)}
          >
            <Text style={styles.addPromptButtonText}>add prompt?</Text>
          </TouchableOpacity>
        )}
        <Modal
          visible={showPromptSearch}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowPromptSearch(false)}
        >
          <TouchableWithoutFeedback onPress={() => setShowPromptSearch(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                <View style={styles.promptSearchContainer}>
                  <Text style={styles.promptSearchPrefix}>/</Text>
                  <TextInput
                    style={styles.promptSearchInput}
                    placeholder="Search for a prompt"
                    placeholderTextColor="#999"
                    value={promptSearch}
                    onChangeText={setPromptSearch}
                    autoFocus
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  postTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postTypeText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 8,
  },
  postButton: {
    backgroundColor: '#333',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dropdown: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    backgroundColor: '#333',
    borderRadius: 8,
    zIndex: 1,
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  dropdownItemText: {
    color: '#fff',
    fontSize: 18,
  },
  titleInput: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingVertical: 12,
    marginBottom: 16,
  },
  bodyContainer: {
    flex: 1,
  },
  bodyInput: {
    color: '#fff',
    fontSize: 18,
    paddingTop: 12,
    flex: 1,
  },
  addPromptButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addPromptButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  promptSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 8,
    width: '80%',
  },
  promptSearchPrefix: {
    color: '#666',
    fontSize: 18,
    marginRight: 8,
  },
  promptSearchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 18,
  },
  promptInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingVertical: 12,
    marginBottom: 16,
  },
  promptPrefix: {
    color: '#666',
    fontSize: 22,
    marginRight: 8,
  },
  promptInput: {
    flex: 1,
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
});

export default CreatePage;
