import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Animated, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePosts } from './PostContext';

const CreatePage = () => {
  const [body, setBody] = useState('');
  const [title, setTitle] = useState('');
  const [showTitle, setShowTitle] = useState(false);
  const [showSavedIndicator, setShowSavedIndicator] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

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
        {showSavedIndicator && (
          <Animated.View style={[styles.savedIndicator, { opacity: fadeAnim }]}>
            <Ionicons name="checkmark-circle" size={24} color="#fff" />
            <Text style={styles.savedIndicatorText}>Saved</Text>
          </Animated.View>
        )}
        <View style={styles.bodyContainer}>
          <TextInput
            style={styles.bodyInput}
            placeholder="What's happening?"
            placeholderTextColor="#666"
            multiline
            value={body}
            onChangeText={handleBodyChange}
          />
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
    fontSize: 16,
    fontFamily: 'SFProText-Regular',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    paddingBottom: 8,
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
    padding: 16,
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
    color: '#FFFFFF',
    marginLeft: 5,
    fontSize: 16,
    fontFamily: 'SFProText-Regular',
  },
  bodyContainer: {
    flex: 1,
  },
  bodyInput: {
    color: '#FFFFFF',
    fontSize: 18,
    flex: 1,
    fontFamily: 'SFProText-Regular',
    marginTop: -10,
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
});

export default CreatePage;
