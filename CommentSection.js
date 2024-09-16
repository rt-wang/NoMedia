import React, { useState, useRef } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { usePosts } from './PostContext';
import Post from './Post';
import { Ionicons } from '@expo/vector-icons';

const PINK_COLOR = '#FFB6C1'; // A darker pink that fits NoMedia's theme

const CommentSection = ({ route, navigation }) => {
  const { postId } = route.params;
  const { posts } = usePosts();
  const [comment, setComment] = useState('');
  const inputRef = useRef(null);

  const post = posts.find(p => p.id === postId);
  const comments = post ? post.comments : [];

  const handleCommentPress = (comment) => {
    navigation.push('CommentSection', { postId: comment.id });
  };

  const handleSendComment = () => {
    // Implement send comment logic here
    console.log('Sending comment:', comment);
    setComment(''); // Clear the input after sending
  };

  const renderComments = () => {
    return comments.map((item, index) => (
      <View key={item.id} style={styles.commentContainer}>
        <View style={styles.commentLine} />
        <Post
          item={item}
          onCommentPress={() => handleCommentPress(item)}
          commentCount={item.comments ? item.comments.length : 0}
        />
      </View>
    ));
  };

  if (!post) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Post not found</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={20}
      >
        <Post
          item={post}
          onCommentPress={() => {}}
          commentCount={comments.length}
        />
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Comments</Text>
          <View style={styles.dividerLine} />
        </View>
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
          />
          <TouchableOpacity onPress={handleSendComment} style={styles.sendButton}>
            <Ionicons name="send" size={24} color={PINK_COLOR} />
          </TouchableOpacity>
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#333',
  },
  dividerText: {
    color: '#888',
    marginHorizontal: 10,
    fontSize: 14,
    fontWeight: 'bold',
  },
  commentContainer: {
    flexDirection: 'row',
    paddingLeft: 16,
  },
  commentLine: {
    width: 2,
    backgroundColor: '#333',
    marginRight: 8,
  },
  commentInputContainer: {
    backgroundColor: '#111',
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  inputWrapper: {
    position: 'relative',
  },
  commentInput: {
    backgroundColor: '#222',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingRight: 40, // Make room for the send button
    color: '#fff',
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    position: 'absolute',
    right: 10,
    top: '38%',
    transform: [{ translateY: -12 }], // Half the icon size to center it
    padding: 4,
  },
});

export default CommentSection;