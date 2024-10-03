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

  console.log("ForYouPage rendered");

  const generatePostContent = (type) => {
    let content = '';
    let username = '';
    let handle = '';
    switch (type) {
      case 'thought':
        content = "When you join ISIS for work experience but they hand you the vest on day one . . . who relates?";
        username = "Daniel Zhong";
        handle = "mathenjoyer";
        break;
      case 'opinion':
        content = "Felt a sense of peace after writing this: To philosophize is to embrace complexity, to accept that life's contradictions are not failures of reason, but the essence of existence itself.";
        username = "Dylan McLeod";
        handle = "Dmac";
        break;
      default:
        content = "I just saw the biggest gay guy ever! This nigga looked like hulf hogan with heels on! I can’t lie I got scared!!!!";
        username = "Kevin Hart";
        handle = "NotKevinHart";
    }
    console.log(`Generated post for ${type} with username: ${username} and handle: ${handle}`);
    return { content, username, handle };
  };

  const generateArticlePreview = (type) => {
    let title, content, username, handle;
    switch (type) {
      case 'tech':
        title = "Cantor's Infinite Revelation";
        content = "Cantor's diagonal method proves that some infinities are larger than others, shattering our intuition of size. The theorem reveals that real numbers can't be listed, even by infinite means.";
        username = "Terry Tao";
        handle = "DaTaoist";
        break;
      case 'lifestyle':
        title = "Minimalism: Living More with Less";
        content = "In a world of excess, minimalism is gaining traction as a lifestyle choice. This article delves into the benefits of adopting a minimalist approach, from reduced stress to increased focus on what truly matters. Discover practical tips for decluttering your life and finding joy in simplicity.";
        username = "MinimalistLiving";
        handle = "less_is_more";
        break;
      default:
        title = "Sample Article Title";
        content = "This is a sample content for an article preview. It can be longer or shorter depending on the actual content.";
        username = "DefaultUser";
        handle = "default_handle";
    }
    return { title, content, username, handle };
  };

  const fetchPosts = () => {
    setLoading(true);
    // Simulating API call
    setTimeout(() => {
      const permutations = [
        ['post', 'post', 'article'],
        ['post', 'article', 'post'],
        ['article', 'post', 'post'],
        ['post', 'article', 'article'],
        ['article', 'post', 'article'],
        ['article', 'article', 'post']
      ];

      const newPosts = Array(12).fill().map((_, index) => {
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
          handle = article.handle;
        } else {
          postType = ['thought', 'question', 'opinion'][Math.floor(Math.random() * 3)];
          const postContent = generatePostContent(postType);
          content = postContent.content;
          username = postContent.username;
          handle = postContent.handle;
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
          handle: handle,
          content: content,
          comments: comments,
          reposts: reposts,
          likes: likes,
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
        threads: [{ content: item.content, pageNumber: 1 }], // Assuming single page for now
      }
    });
  };

  const handleNavigateToProfile = () => {
    setShowProfilePrompt(false);
    navigation.navigate('Account', { screen: 'AccountMain' }); // Updated this line
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
          commentCount={item.comments} // Add this line
        />
      );
    } else {
      return (
        <Post 
          item={item} 
          onCommentPress={() => handleCommentPress(item)}
          commentCount={item.comments} // Change this line
        />
      );
    }
  };

  useEffect(() => {
    console.log("useEffect in ForYouPage called");
    fetchPosts();
  }, []);

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
});

export default ForYouPage;