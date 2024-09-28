import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Animated, Modal, FlatList, ScrollView, PanResponder } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePosts } from './PostContext';

// Import TOPICS from TopicsPage.js
import { TOPICS } from './TopicsPage';

const HighlightedTextInput = ({ value, onChangeText, placeholder, placeholderTextColor, style }) => {
  // ... (HighlightedTextInput component remains the same)
};

const CreatePage = () => {
  const [body, setBody] = useState('');
  const [title, setTitle] = useState('');
  const [showTitle, setShowTitle] = useState(false);
  const [showSavedIndicator, setShowSavedIndicator] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showHashtagSuggestions, setShowHashtagSuggestions] = useState(false);
  const [hashtagSuggestions, setHashtagSuggestions] = useState([]);
  const [currentHashtag, setCurrentHashtag] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('Noms');
  const [modalVisible, setModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const navigation = useNavigation();
  const { addPost } = usePosts();

  const SAMPLE_HASHTAGS = [
    'trending', 'news', 'tech', 'politics', 'sports',
    'entertainment', 'music', 'movies', 'gaming', 'food',
    'travel', 'fashion', 'art', 'science', 'health'
  ];

  useEffect(() => {
    if (currentHashtag) {
      const filteredSuggestions = SAMPLE_HASHTAGS.filter(tag => 
        tag.toLowerCase().startsWith(currentHashtag.toLowerCase())
      );
      setHashtagSuggestions(filteredSuggestions);
    } else {
      setHashtagSuggestions(SAMPLE_HASHTAGS);
    }
  }, [currentHashtag]);

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

  const renderBodyContent = () => {
    const parts = body.split(/(\/\S+)/);
    return parts.map((part, index) => {
      if (part.startsWith('/')) {
        return <Text key={index} style={styles.highlightedText}>{part}</Text>;
      }
      return <Text key={index}>{part}</Text>;
    });
  };

  const handleBodyChange = (text) => {
    setBody(text);
    if (text.length >= 300 && !showTitle) {
      setShowTitle(true);
    } else if (text.length < 300 && showTitle) {
      setShowTitle(false);
      setTitle('');
    }

    // Check for hashtag
    const lastChar = text.slice(-1);
    if (lastChar === '/') {
      setShowHashtagSuggestions(true);
      setCurrentHashtag('');
    } else if (showHashtagSuggestions) {
      const words = text.split(' ');
      const lastWord = words[words.length - 1];
      if (lastWord.startsWith('/')) {
        setCurrentHashtag(lastWord.slice(1));
      } else {
        setShowHashtagSuggestions(false);
      }
    }
  };

  const selectHashtag = (hashtag) => {
    const words = body.split(' ');
    words[words.length - 1] = `/${hashtag} `;
    setBody(words.join(' '));
    setShowHashtagSuggestions(false);
  };

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
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
        {showSavedIndicator && (
          <Animated.View style={[styles.savedIndicator, { opacity: fadeAnim }]}>
            <Ionicons name="checkmark-circle" size={24} color="#fff" />
            <Text style={styles.savedIndicatorText}>Saved</Text>
          </Animated.View>
        )}
        <View style={styles.bodyContainer}>
          <HighlightedTextInput
            style={styles.bodyInput}
            placeholder="What's happening?"
            placeholderTextColor="#666"
            value={body}
            onChangeText={handleBodyChange}
          />
        </View>
      </View>
      <TouchableOpacity
        style={styles.topicButton}
        onPress={openModal}
      >
        <Text style={styles.topicButtonText}>{selectedTopic}</Text>
        <Ionicons name="chevron-up" size={16} color="#FFFFFF" />
      </TouchableOpacity>
      {showHashtagSuggestions && (
        <View style={styles.hashtagSuggestions}>
          <FlatList
            data={hashtagSuggestions}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.hashtagItem}
                onPress={() => selectHashtag(item)}
              >
                <Text style={styles.hashtagText}>/{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
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
          style={styles.topicModalOverlay}
          activeOpacity={1}
          onPress={closeModal}
        >
          <Animated.View
            style={[
              styles.topicModalContent,
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
            <View style={styles.topicModalHeader}>
              <Text style={styles.topicModalTitle}>Select a Topic</Text>
              <TouchableOpacity onPress={closeModal}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={TOPICS}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.topicItem}
                  onPress={() => handleTopicSelect(item)}
                >
                  <Text style={styles.topicItemText}>{item}</Text>
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
    marginLeft: -15,
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
  },
  highlightedText: {
    color: '#FFB6C1',
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
  hashtagSuggestions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: 200,
    backgroundColor: '#111111',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  hashtagItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  hashtagText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'SFProText-Regular',
  },
  topicButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  topicButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'SFProText-Regular',
    marginRight: 4,
  },
  topicModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  topicModalContent: {
    backgroundColor: '#111111',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    maxHeight: '80%',
  },
  topicModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  topicModalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'SFProText-Bold',
  },
  topicItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  topicItemText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'SFProText-Regular',
  },
});

export default CreatePage;