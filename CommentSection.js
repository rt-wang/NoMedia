import React from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { usePosts } from './PostContext';
import Post from './Post';

const CommentSection = ({ route, navigation }) => {
  const { postId } = route.params;
  const { posts } = usePosts();

  const post = posts.find(p => p.id === postId);
  const comments = post ? post.comments : [];

  const handleCommentPress = (comment) => {
    navigation.push('CommentSection', { postId: comment.id });
  };

  const renderItem = ({ item }) => (
    <Post
      item={item}
      onCommentPress={() => handleCommentPress(item)}
      commentCount={item.comments ? item.comments.length : 0}
    />
  );

  if (!post) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Post not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={comments}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.scrollContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No comments yet</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    paddingBottom: 20,
    paddingHorizontal: 16,
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
});

export default CommentSection;