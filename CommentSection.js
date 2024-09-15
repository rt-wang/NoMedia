import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { usePosts } from './PostContext';

const Comment = ({ comment, depth = 0 }) => {
  const [showReplies, setShowReplies] = useState(false);

  return (
    <View style={[styles.comment, { marginLeft: depth * 20 }]}>
      <Text style={styles.commentUsername}>{comment.username}</Text>
      <Text style={styles.commentContent}>{comment.content}</Text>
      {comment.replies && comment.replies.length > 0 && (
        <TouchableOpacity onPress={() => setShowReplies(!showReplies)}>
          <Text style={styles.seeReplies}>
            {showReplies ? 'Hide replies' : `See ${comment.replies.length} replies`}
          </Text>
        </TouchableOpacity>
      )}
      {showReplies && comment.replies.map(reply => (
        <Comment key={reply.id} comment={reply} depth={depth + 1} />
      ))}
    </View>
  );
};

const CommentSection = ({ route }) => {
  const { postId } = route.params;
  const postContext = usePosts();
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (postContext && postContext.posts) {
      const post = postContext.posts.find(p => p.id === postId);
      if (post && post.comments.length > 0) {
        setComments(post.comments);
      } else {
        // Generate auto comments if no comments exist
        const generatedComments = Array(20).fill().map((_, index) => ({
          id: `comment_${index}`,
          username: `User${Math.floor(Math.random() * 1000)}`,
          content: `This is an auto-generated comment ${index + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
          timestamp: Date.now() - Math.random() * 1000000,
          replies: [],
        }));
        setComments(generatedComments);
      }
    }
  }, [postId, postContext]);

  const handleAddComment = () => {
    if (newComment.trim() && postContext && postContext.addComment) {
      postContext.addComment(postId, newComment);
      setNewComment('');
    }
  };

  if (!postContext) {
    return <Text style={styles.errorText}>Unable to load comments</Text>;
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={newComment}
        onChangeText={setNewComment}
        placeholder="Add a comment..."
        placeholderTextColor="#999"
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleAddComment}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
      <FlatList
        data={comments}
        renderItem={({ item }) => <Comment comment={item} />}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>No comments yet</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 10,
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#1DA1F2',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  comment: {
    marginVertical: 5,
    padding: 5,
    borderLeftWidth: 1,
    borderLeftColor: '#333',
  },
  commentUsername: {
    color: '#fff',
    fontWeight: 'bold',
  },
  commentContent: {
    color: '#ccc',
  },
  seeReplies: {
    color: '#1DA1F2',
    marginTop: 5,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    padding: 10,
  },
  emptyText: {
    color: '#999',
    textAlign: 'center',
    padding: 20,
  },
});

export default CommentSection;