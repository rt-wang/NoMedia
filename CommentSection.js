import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { usePosts } from './PostContext';
import Post from './Post';
import { Ionicons } from '@expo/vector-icons';

const PINK_COLOR = '#FFB6C1';
const MAX_CHARS = 300;

const CommentSection = ({ route, navigation }) => {
  const { postId, commentId } = route.params;
  const { posts, addComment } = usePosts();
  const [comment, setComment] = useState('');
  const [charCount, setCharCount] = useState(0);
  const inputRef = useRef(null);

  const findPostAndComment = (postId, commentId) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return { post: null, comment: null };
    
    if (!commentId) return { post, comment: null };
    
    const findComment = (comments) => {
      for (let c of comments) {
        if (c.id === commentId) return c;
        const nestedComment = findComment(c.comments || []);
        if (nestedComment) return nestedComment;
      }
      return null;
    };
    
    const comment = findComment(post.comments || []);
    return { post, comment };
  };

  const { post, comment: originalComment } = findPostAndComment(postId, commentId);
  const comments = originalComment ? originalComment.comments || [] : post ? post.comments || [] : [];

  useEffect(() => {
    setCharCount(comment.length);
  }, [comment]);

  const handleCommentPress = (clickedComment) => {
    navigation.push('CommentSection', { postId, commentId: clickedComment.id });
  };

  const handleSendComment = () => {
    if (comment.trim().length > 0 && comment.length <= MAX_CHARS) {
      addComment(postId, comment.trim(), commentId);
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
      <TouchableOpacity key={item.id} onPress={() => handleCommentPress(item)}>
        <View style={styles.commentContainer}>
          <Post
            item={item}
            onCommentPress={() => {}} // We don't need this anymore as the whole comment is touchable
            commentCount={item.comments ? item.comments.length : 0}
          />
        </View>
      </TouchableOpacity>
    ));
  };

  if (!post) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Post not found</Text>
      </View>
    );
  }

  const renderOriginalItem = () => {
    const item = originalComment || post;
    return (
      <Post
        item={{
          ...item,
          type: 'post', // Force the item to be treated as a post
        }}
        onCommentPress={() => {}}
        commentCount={comments.length}
      />
    );
  };

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
        <View style={styles.originalPostContainer}>
          {renderOriginalItem()}
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
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
});

export default CommentSection;