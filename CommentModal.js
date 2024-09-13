import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CommentModal = ({ isVisible, onClose, originalPost, onPostComment }) => {
  const [comment, setComment] = useState('');
  const [charCount, setCharCount] = useState(0);
  const MAX_CHARS = 300;

  useEffect(() => {
    setCharCount(comment.length);
  }, [comment]);

  const handlePostComment = () => {
    if (comment.trim().length > 0 && comment.length <= MAX_CHARS) {
      onPostComment(comment);
      setComment('');
    }
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3) + '...';
  };

  if (!originalPost) return null;

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.postButton} 
              onPress={handlePostComment} 
              disabled={comment.trim().length === 0 || comment.length > MAX_CHARS}
            >
              <Text style={[styles.postButtonText, (comment.trim().length === 0 || comment.length > MAX_CHARS) && styles.postButtonDisabled]}>Post</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.scrollView}>
            <View style={styles.originalPostContainer}>
              <View style={styles.userInfoContainer}>
                <Text style={styles.originalPostUsername}>
                  {originalPost.username} <Text style={styles.originalPostHandle}>@{originalPost.handle}</Text>
                </Text>
              </View>
              <View style={styles.grayOutlineBox}>
                <Text style={styles.originalPostContent}>
                  {originalPost.type === 'article' 
                    ? truncateText(originalPost.content, 150)
                    : originalPost.content
                  }
                </Text>
              </View>
            </View>
            <View style={styles.commentContainer}>
              <View style={styles.verticalLineContainer}>
                <View style={styles.verticalLine} />
              </View>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Post your reply"
                  placeholderTextColor="#666"
                  multiline
                  value={comment}
                  onChangeText={setComment}
                  maxLength={MAX_CHARS}
                />
              </View>
            </View>
          </ScrollView>
          <Text style={styles.charCount}>{charCount}/{MAX_CHARS}</Text>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  modalContent: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
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
  originalPostContainer: {
    marginBottom: 16,
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
  commentContainer: {
    flexDirection: 'row',
    marginTop: 16,
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
  charCount: {
    color: '#888',
    fontSize: 14,
    textAlign: 'right',
    marginTop: 8,
    paddingHorizontal: 16,
  },
});

export default CommentModal;