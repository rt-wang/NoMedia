import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Modal, TouchableWithoutFeedback, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreatePage = () => {
  const [postType, setPostType] = useState('Nom');
  const [showDropdown, setShowDropdown] = useState(false);
  const [body, setBody] = useState('');
  const [showPromptSearch, setShowPromptSearch] = useState(false);
  const [promptSearch, setPromptSearch] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [showSavedIndicator, setShowSavedIndicator] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const navigation = useNavigation();

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const selectPostType = (type) => {
    setPostType(type);
    setShowDropdown(false);
  };

  const renderDropdownItem = ({ item, index, separators }) => (
    <TouchableOpacity 
      style={[
        styles.dropdownItem, 
        index === 1 && styles.lastDropdownItem // Apply different style to last item
      ]} 
      onPress={() => selectPostType(item)}
    >
      <Text style={styles.dropdownItemText}>{item}</Text>
      {item === postType && <Ionicons name="checkmark" size={20} color="#000" />}
    </TouchableOpacity>
  );

  const toggleMenu = () => setShowMenu(!showMenu);

  const saveAsDraft = async () => {
    if (body.trim().length === 0) {
      setShowMenu(false);
      return;
    }

    try {
      const draft = { postType, body, timestamp: Date.now() };
      const existingDrafts = await AsyncStorage.getItem('drafts');
      let drafts = existingDrafts ? JSON.parse(existingDrafts) : [];
      drafts.push(draft);
      await AsyncStorage.setItem('drafts', JSON.stringify(drafts));
      setBody('');
      showSavedAnimation();
      setShowMenu(false);
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  };

  const addTopic = () => {
    setShowPromptSearch(true);
    setShowMenu(false);
  };

  const showSavedAnimation = () => {
    setShowSavedIndicator(true);
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(1000),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setShowSavedIndicator(false));
  };

  const handlePost = async () => {
    // Implement post functionality here
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={() => { setShowPromptSearch(false); setShowMenu(false); }}>
        <View style={styles.content}>
          {showSavedIndicator && (
            <Animated.View style={[styles.savedIndicator, { opacity: fadeAnim }]}>
              <Ionicons name="checkmark-circle" size={24} color="#fff" />
              <Text style={styles.savedIndicatorText}>Saved</Text>
            </Animated.View>
          )}
          <View style={styles.postTypeContainer}>
            <TouchableOpacity style={styles.postTypeButton} onPress={toggleDropdown}>
              <Text style={styles.postTypeText}>{postType}</Text>
              <Ionicons name="chevron-down" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleMenu}>
              <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          {showMenu && (
            <View style={styles.menu}>
              <TouchableOpacity style={styles.menuItem} onPress={saveAsDraft}>
                <Text style={styles.menuItemText}>Save as draft</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={addTopic}>
                <Text style={styles.menuItemText}>Add topic?</Text>
              </TouchableOpacity>
            </View>
          )}
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
                placeholder="your topic?"
                placeholderTextColor="#999"
                value={body}
                onChangeText={setBody}
              />
            </View>
          ) : (
            <View style={styles.bodyContainer}>
              <TextInput
                style={styles.bodyInput}
                placeholder="What's on your mind?"
                placeholderTextColor="#999"
                multiline
                value={body}
                onChangeText={setBody}
              />
            </View>
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
                      placeholder="Search for a topic"
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
      <TouchableOpacity style={styles.postButton} onPress={handlePost}>
        <Text style={styles.postButtonText}>Post</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  postTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  savedIndicator: {
    position: 'absolute',
    top: -24,
    left: 123,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'center',
    maxWidth: 120,
    zIndex: 1,
  },
  savedIndicatorText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 16,
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
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#333',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  postButtonText: {
    color: '#fff',
    fontSize: 18,
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
  lastDropdownItem: {
    borderBottomWidth: 0, // Remove bottom border for last item
  },
  dropdownItemText: {
    color: '#fff',
    fontSize: 18,
  },
  bodyContainer: {
    flex: 1,
    marginTop: 16,
  },
  bodyInput: {
    color: '#fff',
    fontSize: 18,
    paddingTop: -30,
    flex: 1,
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
  menu: {
    position: 'absolute',
    top: 50,
    right: 10,
    backgroundColor: '#333',
    borderRadius: 8,
    zIndex: 1,
  },
  menuItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  menuItemText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default CreatePage;
