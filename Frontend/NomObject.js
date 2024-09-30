import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ArticlePreview from './ArticlePreview';
import Post from './Post';
import { useReposts } from './RepostContext';
import { usePosts } from './PostContext';

const NomObject = ({ route, navigation }) => {
  const { nomTitle } = route.params;
  const { posts, addPost } = usePosts();
  const [loading, setLoading] = useState(false);
  const { reposts } = useReposts();
  const [sortBy, setSortBy] = useState('Popular');

  useEffect(() => {
    if (posts.length === 0) {
      fetchPosts();
    }
  }, []);

  const fetchPosts = () => {
    setLoading(true);
    // Simulating API call for nom-specific posts
    setTimeout(() => {
      const newPosts = Array(10).fill().map((_, index) => {
        const isArticle = Math.random() > 0.6;
        const baseContent = `This is a sample content related to "${nomTitle}". It can be longer or shorter depending on the actual content.`;
        const content = isArticle 
          ? baseContent.repeat(Math.ceil(200 / baseContent.length)) 
          : baseContent.slice(0, 150);

        return {
          id: `nom_${Date.now()}_${index}`,
          type: isArticle ? 'article' : 'post',
          title: isArticle ? `${nomTitle} - Article ${index + 1}` : undefined,
          username: `User${Math.floor(Math.random() * 1000)}`,
          handle: `handle${Math.floor(Math.random() * 1000)}`,
          content: content,
          comments: Math.floor(Math.random() * 100),
          reposts: Math.floor(Math.random() * 100),
          likes: Math.floor(Math.random() * 1000),
          isUserPost: false,
        };
      });
      newPosts.forEach(post => addPost(post));
      setLoading(false);
    }, 1000);
  };

  const handleCommentPress = (post) => {
    navigation.navigate('CommentSection', { postId: post.id });
  };

  const handleArticlePress = (item) => {
    navigation.navigate('Threads', { 
      item: {
        ...item,
        threads: [{ content: item.content, pageNumber: 1 }],
      }
    });
  };

  const renderItem = ({ item }) => {
    const isReposted = reposts.some(repost => repost.originalPost.id === item.id);
    if (item.type === 'article') {
      return (
        <ArticlePreview 
          item={item} 
          onCommentPress={() => handleCommentPress(item)}
          onArticlePress={() => handleArticlePress(item)}
          isReposted={isReposted}
        />
      );
    } else {
      return (
        <Post 
          item={item} 
          onCommentPress={() => handleCommentPress(item)}
          commentCount={item.comments}
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{nomTitle}</Text>
        <TouchableOpacity 
          style={styles.sortButton}
          onPress={() => setSortBy(sortBy === 'Popular' ? 'Recent' : 'Popular')}
        >
          <Text style={styles.sortButtonText}>{sortBy}</Text>
          <Ionicons name="chevron-down" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={posts.filter(post => !post.isUserPost)}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        onEndReached={fetchPosts}
        onEndReachedThreshold={0.1}
        ListFooterComponent={loading ? <Text style={styles.loadingText}>Loading...</Text> : null}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortButtonText: {
    color: '#FFFFFF',
    marginRight: 4,
  },
  scrollContent: {
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  loadingText: {
    color: '#fff',
    textAlign: 'center',
    padding: 10,
  },
});

export default NomObject;