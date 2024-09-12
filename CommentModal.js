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
            <TouchableOpacity onPress={handlePostComment} disabled={comment.trim().length === 0 || comment.length > MAX_CHARS}>
              <Text style={[styles.postButton, (comment.trim().length === 0 || comment.length > MAX_CHARS) && styles.postButtonDisabled]}>Post</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.scrollView}>
            <View style={styles.originalPostContainer}>
              <Text style={styles.originalPostUsername}>{originalPost.username}</Text>
              <Text style={styles.originalPostContent}>
                {originalPost.type === 'article' 
                  ? truncateText(originalPost.content, 150)
                  : originalPost.content
                }
              </Text>
            </View>
            <TextInput
              style={styles.commentInput}
              placeholder="Post your reply"
              placeholderTextColor="#666"
              multiline
              value={comment}
              onChangeText={setComment}
              maxLength={MAX_CHARS}
            />
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
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  scrollView: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeButton: {
    padding: 5,
  },
  postButton: {
    color: '#1DA1F2',
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  postButtonDisabled: {
    opacity: 0.5,
  },
  originalPostContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 16,
    marginBottom: 16,
  },
  originalPostUsername: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  originalPostContent: {
    color: '#e6e6e6',
    fontSize: 16,
    lineHeight: 22,
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
  },
});

export default CommentModal;