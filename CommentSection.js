import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { usePosts } from './PostContext';
import Post from './Post';
import { Ionicons } from '@expo/vector-icons';

const PINK_COLOR = '#FFB6C1';
const MAX_CHARS = 300;

const CommentSection = ({ route, navigation }) => {
  const { postId } = route.params;
  const { posts, addComment } = usePosts();
  const [comment, setComment] = useState('');
  const [charCount, setCharCount] = useState(0);
  const inputRef = useRef(null);

  const post = posts.find(p => p.id === postId);
  const comments = post ? post.comments : [];

  useEffect(() => {
    setCharCount(comment.length);
  }, [comment]);

  const handleCommentPress = (comment) => {
    navigation.push('CommentSection', { postId: comment.id });
  };

  const handleSendComment = () => {
    if (comment.trim().length > 0 && comment.length <= MAX_CHARS) {
      addComment(postId, comment.trim());
      setComment('');
      inputRef.current?.blur();
    } else if (comment.length > MAX_CHARS) {
      Alert.alert('Error', 'Comment exceeds maximum character limit');
    } else {
      Alert.alert('Error', 'Comment cannot be empty');
    }
  };

  const renderComments = () => {
    return comments.map((item) => (
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
            maxLength={MAX_CHARS}
          />
          <TouchableOpacity onPress={handleSendComment} style={styles.sendButton}>
            <Ionicons name="send" size={24} color={PINK_COLOR} />
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
    paddingRight: 40,
    color: '#fff',
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    position: 'absolute',
    right: 10,
    top: '38%',
    transform: [{ translateY: -12 }],
    padding: 4,
  },
  charCount: {
    color: '#888',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
});

export default CommentSection;