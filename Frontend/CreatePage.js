import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Animated, Modal, FlatList, ScrollView, PanResponder } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePosts } from './PostContext';

// Import NOMS from NomsPage.js
import { NOMS } from './NomsPage';

const HighlightedTextInput = ({ value, onChangeText, placeholder, placeholderTextColor, style }) => {
  // ... (HighlightedTextInput component remains the same)
};

const CreatePage = () => {
  const [body, setBody] = useState('');
  const [title, setTitle] = useState('');
  const [showTitle, setShowTitle] = useState(false);
  const [showSavedIndicator, setShowSavedIndicator] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [selectedNom, setSelectedNom] = useState('Noms');
  const [modalVisible, setModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const navigation = useNavigation();
  const { addPost } = usePosts();

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

    const newPost = {
      type: 'nom',
      title: title.trim(),
      content: body,
      reposts: 0,
      likes: 0,
      isUserPost: true,
    };

    addPost(newPost);
    setBody('');
    setTitle('');
    navigation.goBack();
  };

  const handleTitleChange = (text) => {
    if (text.length <= 50) {
      setTitle(text);
    }
  };

  const handleBodyChange = (text) => {
    setBody(text);
    if (text.length >= 300 && !showTitle) {
      setShowTitle(true);
    } else if (text.length < 300 && showTitle) {
      setShowTitle(false);
      setTitle('');
    }
  };

  const handleNomSelect = (nom) => {
    setSelectedNom(nom);
    closeModal();
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          {showTitle ? (
            <TextInput
              style={styles.titleInput}
              placeholder="Add title"
              placeholderTextColor="#666"
              value={title}
              onChangeText={handleTitleChange}
              maxLength={50}
            />
          ) : (
            <View style={styles.placeholderTitle} />
          )}
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => setShowDropdown(true)} style={styles.ellipsisButton}>
            <Ionicons name="ellipsis-vertical" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.postButton} onPress={handlePost}>
            <Text style={styles.postButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.content}>
        <TextInput
          style={styles.bodyInput}
          placeholder="What's on your mind?"
          placeholderTextColor="#666666"
          value={body}
          onChangeText={handleBodyChange}
          multiline
        />
      </View>
      <TouchableOpacity
        style={styles.nomButton}
        onPress={openModal}
      >
        <Text style={styles.nomButtonText}>{selectedNom}</Text>
        <Ionicons name="chevron-up" size={16} color="#FFFFFF" style={styles.nomButtonIcon} />
      </TouchableOpacity>
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
            <View style={styles.nomModalHeader}>
              <Text style={styles.nomModalTitle}>Select a Nom</Text>
              <TouchableOpacity onPress={closeModal}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={NOMS}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.nomItem}
                  onPress={() => handleNomSelect(item)}
                >
                  <Text style={styles.nomItemText}>{item}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: -30,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: -4,
    marginLeft: 0,
  },
  titleInput: {
    color: '#FFFFFF',
    fontSize: 21,
    fontFamily: 'Athelas',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    paddingBottom: 4,
  },
  placeholderTitle: {
    height: 33, // Approximate height of the title input
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ellipsisButton: {
    marginRight: 4,
    marginBottom: -6,
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  bodyInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'SFProText-Regular',
    textAlignVertical: 'top',
    padding: 0,
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
  nomButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Slightly more opaque white
    paddingHorizontal: 12,
    paddingVertical: 10, // Increased vertical padding for a more square shape
    borderRadius: 12, // Reduced border radius for a more square appearance
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)', // More visible border
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Spread out the text and icon
    minWidth: 100, // Ensure a minimum width for the button
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
    paddingVertical: 16,
    paddingHorizontal: 16,
    maxHeight: '80%',
  },
  nomModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  nomModalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'SFProText-Bold',
  },
  nomItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  nomItemText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'SFProText-Regular',
  },
});

export default CreatePage;