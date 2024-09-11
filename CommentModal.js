import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CommentModal = ({ isVisible, onClose, originalPost, onPostComment }) => {
  const [comment, setComment] = useState('');

  const handlePostComment = () => {
    onPostComment(comment);
    setComment('');
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePostComment} disabled={comment.trim().length === 0}>
              <Text style={[styles.postButton, comment.trim().length === 0 && styles.postButtonDisabled]}>Post</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.originalPostContainer}>
            <Text style={styles.originalPostUsername}>{originalPost.username}</Text>
            <Text style={styles.originalPostContent}>{originalPost.content}</Text>
          </View>
          <TextInput
            style={styles.commentInput}
            placeholder="Post your reply"
            placeholderTextColor="#666"
            multiline
            value={comment}
            onChangeText={setComment}
            autoFocus
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#000',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 30,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cancelButton: {
    color: '#fff',
    fontSize: 16,
  },
  postButton: {
    color: '#1DA1F2',
    fontSize: 16,
    fontWeight: 'bold',
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
    marginBottom: 4,
  },
  originalPostContent: {
    color: '#ccc',
    fontSize: 14,
  },
  commentInput: {
    color: '#fff',
    fontSize: 16,
    minHeight: 100,
  },
});

export default CommentModal;