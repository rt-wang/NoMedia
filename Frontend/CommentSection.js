import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { usePosts } from './PostContext';
import Post from './Post';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const POST_URL = 'http://localhost:8082';

const PINK_COLOR = '#FFB6C1';
const MAX_CHARS = 300;

const CommentSection = ({ route, navigation, hideOriginalPost = false, isModal = false }) => {
  const { postId, postData } = route.params;
  const { posts, addComment } = usePosts();
  const [comment, setComment] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [comments, setComments] = useState([]);
  const inputRef = useRef(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const initializeUserData = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      setToken(storedToken);
    };
    initializeUserData();
  }, []);

  useEffect(() => {
    setCharCount(comment.length);
  }, [comment]);

  useEffect(() => {
    if (token) {
      fetchComments();
    }
  }, [postId, token]);

  const fetchComments = async () => {
    try {
      if (!token) {
        console.error('No token found');
        Alert.alert('Error', 'You are not logged in. Please log in and try again.');
        return;
      }
      const response = await axios.get(`${POST_URL}/api/posts/comment/${postId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error, "token", token);
      Alert.alert('Error', 'Failed to fetch comments. Please try again.');
    }
  };

  const handleCommentPress = (clickedComment) => {
    navigation.push('CommentSection', { postId, originalPost: clickedComment });
  };

  const handleSendComment = async () => {
    if (comment.trim().length > 0 && comment.length <= MAX_CHARS) {
      try {
        const token = await AsyncStorage.getItem('token');
        const userId = await AsyncStorage.getItem('userId');
        const username = await AsyncStorage.getItem('username');
        const name = await AsyncStorage.getItem('name');

        const commentRequest = {
          userId: userId,
          content: comment.trim(),
          postFormat: 'Comment',
          parentPostId: postId,
          username: username,
          name: name,
        };

        const response = await axios.post(`${POST_URL}/api/posts/comment/${postId}`, commentRequest, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        if (response.status === 201) {
          const newComment = response.data;
          setComments(prevComments => [newComment, ...prevComments]);
          setComment('');
          inputRef.current?.blur();
        } else {
          throw new Error('Failed to create comment');
        }
      } catch (error) {
        console.error('Error creating comment:', error, "postId", postId);
        Alert.alert('Error', 'Failed to create comment. Please try again.');
      }
    } else if (comment.length > MAX_CHARS) {
      Alert.alert('Error', 'Comment exceeds maximum character limit');
    } else {
      Alert.alert('Error', 'Comment cannot be empty');
    }
  };

  const renderComments = () => {
    return comments.map((item) => (
      <TouchableOpacity key={item.postId} onPress={() => handleCommentPress(item)}>
        <View style={[styles.commentContainer, isModal && styles.modalCommentContainer]}>
          <Post
            item={item}
            onCommentPress={() => {}}
            commentCount={0} // We don't have nested comments count in this implementation
          />
        </View>
      </TouchableOpacity>
    ));
  };

  const renderOriginalItem = () => {
    if (!postData) return null;
    return (
      <Post
        item={{
          ...postData,
          type: 'post',
        }}
        onCommentPress={() => {}}
        commentCount={comments.length}
      />
    );
  };

  if (!posts) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Post not found</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, isModal && styles.modalContainer]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <KeyboardAwareScrollView
        contentContainerStyle={[styles.scrollContent, isModal && styles.modalScrollContent]}
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={20}
      >
        {!hideOriginalPost && (
          <View style={styles.originalPostContainer}>
            {renderOriginalItem()}
          </View>
        )}
        {!hideOriginalPost && (
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
          </View>
        )}
        {comments.length > 0 ? renderComments() : (
          <Text style={styles.emptyText}>No comments yet</Text>
        )}
      </KeyboardAwareScrollView>
      <View style={styles.commentInputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            ref={inputRef}
            style={styles.commentInput}
            placeholder="Add a comment"
            placeholderTextColor="#888"
            value={comment}
            onChangeText={setComment}
            multiline
            maxLength={MAX_CHARS}
          />
          <TouchableOpacity onPress={handleSendComment} style={styles.sendButton} disabled={comment.trim().length === 0}>
            <View style={[styles.sendButtonInner, comment.trim().length === 0 && styles.sendButtonDisabled]}>
              <Ionicons name="arrow-up" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>
        <Text style={styles.charCount}>{charCount}/{MAX_CHARS}</Text>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 3,
  },
  errorText: {
    color: '#fff',
    textAlign: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    padding: 20,
  },
  divider: {
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  dividerLine: {
    height: 1,
    backgroundColor: '#333',
  },
  commentContainer: {
    flexDirection: 'row',
    paddingLeft: 20,
    paddingRight: 16,
  },
  commentInputContainer: {
    backgroundColor: '#111',
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    position: 'relative', // Ensure the send button can overlap
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#222',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    paddingRight: 40, // Ensure space for the send button
    color: '#fff',
    fontSize: 16,
    maxHeight: 100,
    marginLeft: -2, // Equal distance from the sides of the phone
    marginRight: -2, // Equal distance from the sides of the phone
  },
  sendButton: {
    position: 'absolute',
    right: 4, // Align with the right margin of the text input
    bottom: 4, // Align with the bottom padding of the text input
    width: 28, // Shrink the size of the button
    height: 28, // Shrink the size of the button
    borderRadius: 14, // Adjust the border radius to match the new size
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // Ensure the button is on top
    marginLeft: 10,
  },
  sendButtonInner: {
    width: '100%',
    height: '100%',
    borderRadius: 14, // Adjust the border radius to match the new size
    backgroundColor: PINK_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#555',
  },
  charCount: {
    color: '#888',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
  originalPostContainer: {
    paddingHorizontal: 8, // Add horizontal padding to match For You page
  },
  modalContainer: {
    paddingTop: 0,
  },
  modalScrollContent: {
    paddingTop: 10, // Reduced from 50 to 10 to move content up
  },
  modalCommentContainer: {
    paddingLeft: 10, // Reduce left padding for comments in modal view
  },
});

export default CommentSection;
