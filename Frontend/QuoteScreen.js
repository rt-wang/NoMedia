import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePosts } from './PostContext';

const QuoteScreen = ({ route, navigation }) => {
  const { post } = route.params;
  const [quoteText, setQuoteText] = useState('');
  const [charCount, setCharCount] = useState(0);
  const MAX_CHARS = 300;
  const { quotePost } = usePosts();

  useEffect(() => {
    setCharCount(quoteText.length);
  }, [quoteText]);

  const handlePost = async () => {
    if (quoteText.trim().length > 0 && quoteText.length <= MAX_CHARS) {
      try {
        await quotePost(post, quoteText);
        navigation.goBack();
      } catch (error) {
        Alert.alert('Error', 'Failed to create quote. Please try again.');
      }
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.modalContainer}
    >
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.postButton} 
            onPress={handlePost} 
            disabled={quoteText.trim().length === 0 || quoteText.length > MAX_CHARS}
          >
            <Text style={[styles.postButtonText, (quoteText.trim().length === 0 || quoteText.length > MAX_CHARS) && styles.postButtonDisabled]}>Post</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.scrollView}>
          <View style={styles.commentContainer}>
            <View style={styles.verticalLineContainer}>
              <View style={styles.verticalLine} />
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.commentInput}
                placeholder="Add a comment..."
                placeholderTextColor="#666"
                multiline
                value={quoteText}
                onChangeText={setQuoteText}
                maxLength={MAX_CHARS}
              />
            </View>
          </View>
          <View style={styles.originalPostContainer}>
            <View style={styles.userInfoContainer}>
              <Text style={styles.originalPostUsername}>
                {post.name} <Text style={styles.originalPostHandle}>@{post.username}</Text>
              </Text>
            </View>
            <View style={styles.grayOutlineBox}>
              <Text style={styles.originalPostContent}>{post.content}</Text>
            </View>
          </View>
        </ScrollView>
        <Text style={styles.charCount}>{charCount}/{MAX_CHARS}</Text>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  modalContent: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 10 : 10,
    paddingBottom: 30,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  closeButton: {
    padding: 5,
    marginLeft: -8,
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
  postButtonDisabled: {
    opacity: 0.5,
  },
  commentContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  verticalLineContainer: {
    width: 2,
    marginRight: 10,
  },
  verticalLine: {
    flex: 1,
    backgroundColor: '#444',
  },
  inputWrapper: {
    flex: 1,
  },
  commentInput: {
    color: '#fff',
    fontSize: 18,
    lineHeight: 24,
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 0,
  },
  originalPostContainer: {
    marginTop: 16,
  },
  userInfoContainer: {
    marginBottom: 8,
  },
  originalPostUsername: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  originalPostHandle: {
    color: '#999',
    fontWeight: 'normal',
  },
  grayOutlineBox: {
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 10,
    padding: 10,
  },
  originalPostContent: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 22,
  },
  charCount: {
    color: '#888',
    fontSize: 14,
    textAlign: 'right',
    marginTop: 8,
  },
});

export default QuoteScreen;