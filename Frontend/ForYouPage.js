import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Make sure to import this
import AsyncStorage from '@react-native-async-storage/async-storage';
import ArticlePreview from './ArticlePreview';
import Post from './Post';
import { useReposts } from './RepostContext';
import { usePosts } from './PostContext';
import NomsPage from './NomsPage';
import ProfilePromptModal from './ProfilePromptModal';
import axios from 'axios';

const LIGHT_GREY = '#CCCCCC';
const ACTIVE_TAB_COLOR = '#FFB6C1';
const USER_URL = 'http://localhost:8080'; // Adjust this to your user service URL
const POST_URL = 'http://localhost:8082'; // Your existing post service URL

const TabNavigator = ({ activeTab, setActiveTab }) => (
  <View style={styles.tabNavigator}>
    <TouchableOpacity
      style={[styles.tab, activeTab === 'ForYou' && styles.activeTab]}
      onPress={() => setActiveTab('ForYou')}
    >
      <Text style={[styles.tabText, activeTab === 'ForYou' && styles.activeTabText]}>For You Page</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.tab, activeTab === 'Noms' && styles.activeTab]}
      onPress={() => setActiveTab('Noms')}
    >
      <Text style={[styles.tabText, activeTab === 'Noms' && styles.activeTabText]}>Noms</Text>
    </TouchableOpacity>
  </View>
);

const ForYouPage = ({ navigation, showCommentModal }) => {
  const { posts, addPost } = usePosts();
  const [loading, setLoading] = useState(false);
  const { reposts } = useReposts();
  const [activeTab, setActiveTab] = useState('ForYou');
  const [showProfilePrompt, setShowProfilePrompt] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [renderedPostCount, setRenderedPostCount] = useState(0);

  console.log("ForYouPage rendered");

  const generatePostContent = (type) => {
    let content = '';
    let name = '';
    let username = '';
    switch (type) {
      case 'thought':
        content = "When you join ISIS for work experience but they hand you the vest on day one . . . who relates?";
        name = "Daniel Zhong";
        username = "mathenjoyer";
        break;
      case 'opinion':
        content = "Felt a sense of peace after writing this: To philosophize is to embrace complexity, to accept that life's contradictions are not failures of reason, but the essence of existence itself.";
        name = "Dylan McLeod";
        username = "Dmac";
        break;
      default:
        content = "I just saw the biggest gay guy ever! This nigga looked like hulf hogan with heels on! I can't lie I got scared!!!!";
        name = "Kevin Hart";
        username = "NotKevinHart";
    }
    console.log(`Generated post for ${type} with name: ${name} and username: ${username}`);
    return { content, name, username };
  };

  const generateArticlePreview = (type) => {
    let title, content, username, name;
    switch (type) {
      case 'tech':
        title = "Cantor's Infinite Revelation";
        content = "Cantor's diagonal method proves that some infinities are larger than others, shattering our intuition of size. The theorem reveals that real numbers can't be listed, even by infinite means.";
        username = "Terry Tao";
        name = "DaTaoist";
        break;
      case 'lifestyle':
        title = "Minimalism: Living More with Less";
        content = "In a world of excess, minimalism is gaining traction as a lifestyle choice. This article delves into the benefits of adopting a minimalist approach, from reduced stress to increased focus on what truly matters. Discover practical tips for decluttering your life and finding joy in simplicity.";
        username = "MinimalistLiving";
        name = "less_is_more";
        break;
      default:
        title = "Sample Article Title";
        content = "This is a sample content for an article preview. It can be longer or shorter depending on the actual content.";
        username = "DefaultUser";
        name = "default_handle";
    }
    return { title, content, username, name };
  };

  const fetchLatestPosts = async () => {
    if (!hasMorePosts || loading) return;

    try {
      setLoading(true);

      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');
      const name = await AsyncStorage.getItem('name');
      const username = await AsyncStorage.getItem('username');

      if (!token || !userId) {
        console.error('User not authenticated');
        return;
      }

      const response = await axios.get(`${POST_URL}/api/posts/latest?page=${page}&size=20`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const latestPosts = response.data;
      
      if (latestPosts.length === 0) {
        setHasMorePosts(false);
        generatePosts(20);
      } else {
        const processedPosts = latestPosts.map(post => ({
          ...post,
          type: post.title ? 'article' : 'post',
          name: post.name || name,
          username: post.username || username,
        }));
        
        processedPosts.forEach(post => addPost(post, true));
        
        if (latestPosts.length < 20) {
          setHasMorePosts(false);
          generatePosts(20 - latestPosts.length);
        }
      }

      setPage(prevPage => prevPage + 1);
      setRenderedPostCount(prevCount => prevCount + 20);
    } catch (error) {
      console.error('Error fetching latest posts:', error);
      generatePosts(20);
    } finally {
      setLoading(false);
    }
  };

  const generatePosts = (count) => {
    // Simulating API call
    setTimeout(() => {
      const newPosts = Array(count).fill().map((_, index) => {
        const permutations = [
          ['post', 'post', 'article'],
          ['post', 'article', 'post'],
          ['article', 'post', 'post'],
          ['post', 'article', 'article'],
          ['article', 'post', 'article'],
          ['article', 'article', 'post']
        ];

        const permutationIndex = Math.floor(index / 3) % permutations.length;
        const typeIndex = index % 3;
        const type = permutations[permutationIndex][typeIndex];

        let postType, articleType, content, title, username, handle;

        if (type === 'article') {
          articleType = Math.random() < 0.5 ? 'tech' : 'lifestyle';
          const article = generateArticlePreview(articleType);
          content = article.content;
          title = article.title;
          username = article.username;
          name = article.name;
        } else {
          postType = ['thought', 'question', 'opinion'][Math.floor(Math.random() * 3)];
          const postContent = generatePostContent(postType);
          content = postContent.content;
          username = postContent.username;
          name = postContent.name;
        }

        // Generate likes between 50 and 100
        const likes = Math.floor(Math.random() * (100 - 50 + 1)) + 50;

        // Set reposts to half of likes, capped at 40
        const reposts = Math.min(Math.floor(likes / 2), 40);

        // Generate comments between 10 and 30
        const comments = Math.floor(Math.random() * (30 - 10 + 1)) + 10;

        return {
          id: `generated_${Date.now()}_${index}`,
          type: type,
          postType: postType,
          articleType: articleType,
          title: title,
          username: username,
          name: name,
          content: content,
          comments: comments,
          reposts: reposts,
          likes: likes,
          isUserPost: false,
          pageCount: Math.floor(Math.random() * (100 - 50 + 1)) + 50, // Added page count
        };
      });

      newPosts.forEach(post => addPost(post, false)); // Add generated posts
      setRenderedPostCount(prevCount => prevCount + count);
    }, 1000);
  };

  const handleCommentPress = (post) => {
    navigation.navigate('CommentSection', { postId: post.id });
  };

  const handleArticlePress = (item) => {
    navigation.navigate('Threads', { 
      item: {
        ...item,
        threads: [{ content: item.content, pageNumber: 1 }], // Assuming single page for now
      }
    });
  };

  const handleNavigateToProfile = () => {
    setShowProfilePrompt(false);
    navigation.navigate('Account', { screen: 'AccountMain' }); // Updated this line
  };

  const renderItem = ({ item, index }) => {
    if (index >= renderedPostCount || item.postFormat === 'Comment') return null;
    const isReposted = reposts.some(repost => repost.originalPost.id === item.id);

    const RepostWrapper = ({ children }) => (
      <View style={styles.repostWrapper}>
        <Text style={styles.repostIndicator}>
          <Ionicons name="repeat" size={14} color="#FFB6C1" /> Reposted by {item.name}
        </Text>
        {children}
      </View>
    );

    const renderContent = () => {
      if (item.type === 'article') {
        return (
          <ArticlePreview 
            item={{
              ...item,
              name: item.name || 'Unknown',
              username: item.username || 'unknown_user',
              pageCount: item.pageCount || 1
            }}
            onCommentPress={() => handleCommentPress(item)}
            onArticlePress={() => handleArticlePress(item)}
            isReposted={isReposted}
            commentCount={item.comments}
          />
        );
      } else {
        return (
          <Post 
            item={{
              ...item,
              name: item.name || 'Unknown',
              username: item.username || 'unknown_user',
              title: item.title
            }}
            onCommentPress={() => handleCommentPress(item)}
            commentCount={item.comments}
          />
        );
      }
    };

    if (item.postFormat === 'Repost') {
      return (
        <RepostWrapper>
          {renderContent(item.originalPost)}
        </RepostWrapper>
      );
    }

    return renderContent();
  };

  const handleEndReached = () => {
    if (!loading && posts.length >= renderedPostCount) {
      fetchLatestPosts();
    }
  };

  useEffect(() => {
    console.log("useEffect in ForYouPage called");
    fetchLatestPosts();
  }, []);

  return (
    <View style={styles.container}>
      <TabNavigator activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'ForYou' ? (
        <>
          <FlatList
            data={posts.filter(post => !post.isUserPost)}
            renderItem={renderItem}
            keyExtractor={item => (item.id || '').toString()}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.1}
            ListFooterComponent={loading ? <Text style={styles.loadingText}>Loading...</Text> : null}
            contentContainerStyle={styles.scrollContent}
          />
          <TouchableOpacity
            style={styles.feedbackButton}
            onPress={() => navigation.navigate('FeedbackForm')}
          >
            <Text style={styles.feedbackText}>Give</Text>
            <Text style={styles.feedbackText}>Feedback</Text>
          </TouchableOpacity>
          <ProfilePromptModal
            visible={showProfilePrompt}
            onClose={() => setShowProfilePrompt(false)}
            onNavigateToProfile={handleNavigateToProfile}
          />
        </>
      ) : (
        <NomsPage navigation={navigation} />
      )}
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
    padding: 10,
  },
  tabNavigator: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: ACTIVE_TAB_COLOR,
  },
  tabText: {
    color: '#888',
    fontSize: 16,
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  feedbackButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 182, 193, 0.3)',
  },
  feedbackText: {
    color: '#fff',
    fontSize: 14, // Reduced by approximately 70% from 14
    fontWeight: '400',
    fontFamily: 'SFProText-Regular',
    textAlign: 'center',
  },
  repostWrapper: {
    backgroundColor: '#1A1A1A', // Slightly lighter than black for contrast
    borderRadius: 8,
    marginBottom: 10,
    padding: 10,
  },
  repostIndicator: {
    color: '#FFB6C1', // Light pink color
    fontSize: 14,
    marginBottom: 5,
  },
});

export default ForYouPage;
