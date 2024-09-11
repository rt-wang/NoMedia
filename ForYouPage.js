import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ArticlePreview from './ArticlePreview';
import Post from './Post';

const LIGHT_GREY = '#CCCCCC';

const SearchBar = () => (
  <View style={styles.searchBarContainer}>
    <TextInput style={styles.searchBar} placeholder="Search NoMedia" placeholderTextColor="#999" />
    <Ionicons name="search" size={24} color="#999" style={styles.searchIcon} />
  </View>
);

const ForYouPage = ({ navigation, showCommentModal }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = () => {
    setLoading(true);
    // Simulating API call
    setTimeout(() => {
      const newPosts = Array(10).fill().map((_, index) => {
        const isArticle = Math.random() > 0.6; // 40% chance of being an article
        const baseContent = 'This is a sample content for the post or article preview. It can be longer or shorter depending on the actual content.';
        const content = isArticle 
          ? baseContent.repeat(Math.ceil(200 / baseContent.length)) 
          : baseContent.slice(0, 150);

        return {
          id: Date.now() + index,
          type: isArticle ? 'article' : 'post',
          title: isArticle ? 'Sample Article Title' : undefined,
          username: `User${Math.floor(Math.random() * 1000)}`,
          handle: `handle${Math.floor(Math.random() * 1000)}`,
          content: content,
          comments: Math.floor(Math.random() * 100),
          reposts: Math.floor(Math.random() * 100),
          likes: Math.floor(Math.random() * 1000),
        };
      });
      setPosts(prevPosts => [...prevPosts, ...newPosts]);
      setLoading(false);
    }, 1000);
  };

  const handleCommentPress = (post) => {
    console.log('handleCommentPress called with post:', post.id);
    if (showCommentModal) {
      showCommentModal(post);
    } else {
      console.error('showCommentModal is not defined');
    }
  };

  const renderItem = ({ item }) => {
    if (item.type === 'article') {
      return <ArticlePreview item={item} navigation={navigation} onCommentPress={() => handleCommentPress(item)} />;
    } else {
      return <Post item={item} navigation={navigation} onCommentPress={() => handleCommentPress(item)} />;
    }
  };

  return (
    <View style={styles.container}>
      <SearchBar />
      <FlatList
        data={posts}
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
  scrollContent: {
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  searchBarContainer: {
    padding: 10,
    paddingHorizontal: 16,
    backgroundColor: '#000',
  },
  searchBar: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 10,
    paddingLeft: 40,
    color: '#fff',
  },
  searchIcon: {
    position: 'absolute',
    left: 26,
    top: 18,
  },
  loadingText: {
    color: '#fff',
    textAlign: 'center',
    padding: 10,
  },
});

export default ForYouPage;