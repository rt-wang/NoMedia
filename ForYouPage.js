import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Make sure to import this
import AsyncStorage from '@react-native-async-storage/async-storage';
import ArticlePreview from './ArticlePreview';
import Post from './Post';
import { useReposts } from './RepostContext';
import { usePosts } from './PostContext';
import TopicsPage from './TopicsPage';
import ProfilePromptModal from './ProfilePromptModal';

const LIGHT_GREY = '#CCCCCC';
const ACTIVE_TAB_COLOR = '#FFB6C1';

const TabNavigator = ({ activeTab, setActiveTab }) => (
  <View style={styles.tabNavigator}>
    <TouchableOpacity
      style={[styles.tab, activeTab === 'ForYou' && styles.activeTab]}
      onPress={() => setActiveTab('ForYou')}
    >
      <Text style={[styles.tabText, activeTab === 'ForYou' && styles.activeTabText]}>For You Page</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.tab, activeTab === 'Topics' && styles.activeTab]}
      onPress={() => setActiveTab('Topics')}
    >
      <Text style={[styles.tabText, activeTab === 'Topics' && styles.activeTabText]}>Topics</Text>
    </TouchableOpacity>
  </View>
);

const ForYouPage = ({ navigation, showCommentModal }) => {
  const { posts, addPost } = usePosts();
  const [loading, setLoading] = useState(false);
  const { reposts } = useReposts();
  const [activeTab, setActiveTab] = useState('ForYou');
  const [showProfilePrompt, setShowProfilePrompt] = useState(false);

  useEffect(() => {
    if (posts.length === 0) {
      fetchPosts();
    }

    const checkAndShowProfilePrompt = async () => {
      const currentUser = await AsyncStorage.getItem('currentUser');
      const hasShownPrompt = await AsyncStorage.getItem(`hasShownPrompt_${currentUser}`);
      if (currentUser && hasShownPrompt !== 'true') {
        const timer = setTimeout(() => {
          setShowProfilePrompt(true);
          AsyncStorage.setItem(`hasShownPrompt_${currentUser}`, 'true');
        }, 5000); // 30 seconds delay

        return () => clearTimeout(timer);
      }
    };

    checkAndShowProfilePrompt();
  }, []);

  const fetchPosts = () => {
    setLoading(true);
    // Simulating API call
    setTimeout(() => {
      const newPosts = Array(10).fill().map((_, index) => {
        const isArticle = Math.random() > 0.6;
        const baseContent = 'This is a sample content for the post or article preview. It can be longer or shorter depending on the actual content.';
        const content = isArticle 
          ? baseContent.repeat(Math.ceil(200 / baseContent.length)) 
          : baseContent.slice(0, 150);

        return {
          id: `generated_${Date.now()}_${index}`,
          type: isArticle ? 'article' : 'post',
          title: isArticle ? 'Sample Article Title' : undefined,
          username: `User${Math.floor(Math.random() * 1000)}`,
          handle: `handle${Math.floor(Math.random() * 1000)}`,
          content: content,
          comments: Math.floor(Math.random() * 100),
          reposts: Math.floor(Math.random() * 100),
          likes: Math.floor(Math.random() * 1000),
          isUserPost: false, // Ensure this is false for generated posts
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
        threads: [{ content: item.content, pageNumber: 1 }], // Assuming single page for now
      }
    });
  };

  const handleNavigateToProfile = () => {
    setShowProfilePrompt(false);
    navigation.navigate('AccountPage'); // Adjust this to your actual profile page route
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
          commentCount={item.comments} // Pass the comment count to Post component
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      <TabNavigator activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'ForYou' ? (
        <>
          <FlatList
            data={posts.filter(post => !post.isUserPost)} // Only display non-user posts
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            onEndReached={fetchPosts}
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
        <TopicsPage navigation={navigation} />
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
});

export default ForYouPage;