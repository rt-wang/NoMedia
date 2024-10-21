import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Animated, Modal, FlatList, ScrollView, PanResponder } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePosts } from './PostContext';
import axios from 'axios';

// Import NOM_BOXES from NomsPage.js
import { NOM_BOXES } from './NomsPage';

const API_BASE_URL = 'http://localhost:8082'; // Replace with your actual API URL

const HighlightedTextInput = ({ value, onChangeText, placeholder, placeholderTextColor, style }) => {
  // ... (HighlightedTextInput component remains the same)
};

const CreatePage = () => {
  const [body, setBody] = useState('');
  const [showSavedIndicator, setShowSavedIndicator] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [selectedNom, setSelectedNom] = useState('Noms');
  const [modalVisible, setModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredNoms, setFilteredNoms] = useState(NOM_BOXES);
  const [showCreateNomInput, setShowCreateNomInput] = useState(false);
  const [newNomName, setNewNomName] = useState('');
  const [allNoms, setAllNoms] = useState([...NOM_BOXES]);

  const navigation = useNavigation();
  const { addPost } = usePosts();

  useEffect(() => {
    loadNoms();
  }, []);

  const loadNoms = async () => {
    try {
      const storedNoms = await AsyncStorage.getItem('allNoms');
      if (storedNoms) {
        setAllNoms(JSON.parse(storedNoms));
      }
    } catch (error) {
      console.error('Error loading noms:', error);
    }
  };

  const saveNoms = async (noms) => {
    try {
      await AsyncStorage.setItem('allNoms', JSON.stringify(noms));
    } catch (error) {
      console.error('Error saving noms:', error);
    }
  };

  const saveAsDraft = async () => {
    if (body.trim().length === 0) return;

    try {
      const draft = { title, body, timestamp: Date.now() };
      const existingDrafts = await AsyncStorage.getItem('drafts');
      let drafts = existingDrafts ? JSON.parse(existingDrafts) : [];
      drafts.push(draft);
      await AsyncStorage.setItem('drafts', JSON.stringify(drafts));
      setBody('');
      setTitle('');
      showSavedAnimation();
    } catch (error) {
      console.error('Error saving draft:', error);
    }
    setShowDropdown(false);
  };

  const showSavedAnimation = () => {
    setShowSavedIndicator(true);
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(1000),
      Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => setShowSavedIndicator(false));
  };

  const handlePost = async () => {
    if (body.trim().length === 0) return;

    try {
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');
      const authorities = await AsyncStorage.getItem('authorities');
      const name = await AsyncStorage.getItem('name');
      const username = await AsyncStorage.getItem('username');

      if (!token || !userId) {
        console.error('User not authenticated');
        return;
      }

      const newPost = {
        user_id: userId,
        content: body,
        title: title.trim(),
        post_format: 'Original',
        topic_id: selectedNom !== 'Noms' ? selectedNom : null, // Ensure this is set correctly
        name: name,
        username: username,
      };

      console.log('New post data:', newPost); // Add this line for debugging

      const response = await axios.post(`${API_BASE_URL}/api/posts`, newPost, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'authorities': authorities,
        }
      });
      console.log('Post created successfully:', response.data);

      if (response.status === 201) {
        // Make sure the response.data includes the topic_id
        addPost(response.data);
        setBody('');
        setTitle('');
        setSelectedNom('Noms'); // Reset the selected Nom
        navigation.goBack();
      } else {
        console.log(response.data);
        console.error('Failed to create post:', response.status);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
    }
  };

  const handleBodyChange = (text) => {
    setBody(text);
  };

  const handleNomSelect = (nom) => {
    setSelectedNom(nom.title.substring(2)); // Remove the leading "/ "
    closeModal();
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = allNoms.filter(nom => 
      nom.title.substring(2).toLowerCase().includes(query.toLowerCase())
    );
    setFilteredNoms(filtered);
  };

  const handleCheckPress = () => {
    if (searchQuery.trim()) {
      const existingNom = allNoms.find(nom => 
        nom.title.substring(2).toLowerCase() === searchQuery.trim().toLowerCase()
      );

      if (existingNom) {
        handleNomSelect(existingNom);
      } else {
        // Create new Nom
        const newNom = { id: Date.now().toString(), title: `/ ${searchQuery.trim()}` };
        const updatedNoms = [newNom, ...allNoms];
        setAllNoms(updatedNoms);
        setFilteredNoms(updatedNoms);
        saveNoms(updatedNoms);
        handleNomSelect(newNom);
      }
      setSearchQuery('');
    }
  };

  const handleCreateNom = () => {
    setShowCreateNomInput(true);
  };

  const handleNewNomSubmit = () => {
    if (newNomName.trim()) {
      // Here you would typically add the new Nom to your data source
      // For now, we'll just add it to the filtered Noms
      const newNom = { id: Date.now().toString(), title: `/ ${newNomName.trim()}` };
      setFilteredNoms([newNom, ...filteredNoms]);
      setNewNomName('');
      setShowCreateNomInput(false);
      // Optionally, you can select the newly created Nom
      handleNomSelect(newNom);
    }
  };

  const openModal = () => {
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return gestureState.dy > 5;
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy > 50) {
        closeModal();
      }
    },
  });

  const renderNomItem = ({ item }) => (
    <TouchableOpacity
      style={styles.nomItem}
      onPress={() => handleNomSelect(item)}
    >
      <Text style={styles.nomItemText}>{item.title.substring(2)}</Text>
      {item.title.substring(2) === selectedNom && (
        <Ionicons name="checkmark" size={24} color="#FFFFFF" style={styles.checkmarkIcon} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TextInput
          style={styles.bodyInput}
          value={body}
          onChangeText={handleBodyChange}
          multiline
          selectionColor="#FFE4E8"
          autoFocus={true}
        />
      </View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.nomButton}
          onPress={openModal}
        >
          <Text style={styles.nomButtonText}>{selectedNom}</Text>
          <Ionicons name="chevron-up" size={16} color="#FFFFFF" style={styles.nomButtonIcon} />
        </TouchableOpacity>
        <View style={styles.rightButtons}>
          <TouchableOpacity onPress={() => setShowDropdown(true)} style={styles.ellipsisButton}>
            <Ionicons name="ellipsis-vertical" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.postButton} onPress={handlePost}>
            <Text style={styles.postButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        visible={showDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDropdown(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setShowDropdown(false)}
        >
          <View style={styles.dropdownMenu}>
            <TouchableOpacity onPress={saveAsDraft} style={styles.dropdownItem}>
              <Text style={styles.dropdownItemText}>Add as Draft</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeModal}
      >
        <TouchableOpacity
          style={styles.nomModalOverlay}
          activeOpacity={1}
          onPress={closeModal}
        >
          <Animated.View
            style={[
              styles.nomModalContent,
              {
                transform: [
                  {
                    translateY: slideAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [300, 0],
                    }),
                  },
                ],
              },
            ]}
            {...panResponder.panHandlers}
          >
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search or create Nom"
                placeholderTextColor="#666"
                value={searchQuery}
                onChangeText={handleSearch}
                onSubmitEditing={handleCheckPress}
              />
              <TouchableOpacity style={styles.checkButton} onPress={handleCheckPress}>
                <Ionicons name="checkmark" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={filteredNoms}
              renderItem={renderNomItem}
              keyExtractor={(item) => item.id}
              style={styles.nomList}
            />
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 18,
    marginTop: -30,
  },
  bodyInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'SFProText-Regular',
    textAlignVertical: 'top',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  dropdownMenu: {
    backgroundColor: '#111111',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 8,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dropdownItemText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'SFProText-Regular',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  rightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nomButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: 100,
  },
  nomButtonText: {
    color: '#FFFFFF',
    fontSize: 14, // Slightly larger font size
    fontWeight: '600', // Make the text a bit bolder
    fontFamily: 'SFProText-Semibold', // Use a semibold font if available
  },
  nomButtonIcon: {
    marginLeft: 4,
  },
  nomModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  nomModalContent: {
    backgroundColor: '#111111',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    paddingHorizontal: 16,
    height: 400, // Fixed height
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#222',
    borderRadius: 20,
    paddingHorizontal: 16,
    color: '#FFFFFF',
    marginRight: 8,
    fontFamily: 'SFProText-Regular',
  },
  checkButton: {
    backgroundColor: 'rgba(255, 182, 193, 0.1)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 182, 193, 0.3)',
  },
  createNomInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  createNomInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#222',
    borderRadius: 20,
    paddingHorizontal: 16,
    color: '#FFFFFF',
    marginRight: 8,
    fontFamily: 'SFProText-Regular',
  },
  nomList: {
    flex: 1,
  },
  nomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  nomItemText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'SFProText-Regular',
    flex: 1,
  },
  checkmarkIcon: {
    marginLeft: 8,
  },
  ellipsisButton: {
    marginRight: 12,
  },
  postButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'SFProText-Regular',
  },
});

export default CreatePage;
