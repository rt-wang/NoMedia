import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { usePosts } from './PostContext';
import Post from './Post';

const CommentSection = ({ route, navigation }) => {
  const { postId } = route.params;
  const { posts, addCommentsToPost } = usePosts();
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const generateComments = useCallback(() => {
    return Array(20).fill().map((_, index) => ({
      id: `comment_${Date.now()}_${index}`,
      type: 'post',
      username: `User${Math.floor(Math.random() * 1000)}`,
      handle: `user${Math.floor(Math.random() * 1000)}`,
      content: `This is an auto-generated comment ${index + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
      timestamp: Date.now() - Math.random() * 1000000,
      comments: [],
      reposts: Math.floor(Math.random() * 50),
      likes: Math.floor(Math.random() * 100),
    }));
  }, []);

  useEffect(() => {
    const loadComments = async () => {
      setIsLoading(true);
      const post = posts.find(p => p.id === postId);
      if (post && post.comments.length > 0) {
        setComments(post.comments);
      } else {
        const generatedComments = generateComments();
        setComments(generatedComments);
        addCommentsToPost(postId, generatedComments);
      }
      setIsLoading(false);
    };

    loadComments();
  }, [postId, posts, generateComments, addCommentsToPost]);

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

  if (isLoading) {
    return <View style={styles.container}><Text style={styles.loadingText}>Loading comments...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={comments}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.scrollContent}
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
  loadingText: {
    color: '#fff',
    textAlign: 'center',
    padding: 20,
  },
});

export default CommentSection;