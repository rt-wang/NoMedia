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
      <Text style={[styles.tabText, activeTab === 'ForYou' && styles.activeTabText]}>For Your Mind</Text>
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
        content = "Hurricane Milton, a Category 5 storm, approaches Florida’s Gulf Coast with life-threatening winds, storm surges, and floods. Evacuations are underway, with shelters open and airports closed​ (FOX Weather).";
        name = "WeatherGod";
        username = "weathergod";
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

  const generateUniquePostContent = (index) => {
    const uniquePosts = [
      { postType: 'thought', content: "If computational power allows for simulations to mirror reality, infinite regress becomes viable—each simulated universe creating another. Given finite resources and entropy, could our reality be nested within a parent simulation? Theoretical frameworks like Bostrom's Simulation Argument (pt. 1)", name: "Jan Cristelli", username: "janathan22", topic_id: "Debate" },
      { postType: 'opinion', content: "Hot take: pineapple on pizza is actually delicious. Fight me.", name: "Gordon Ramsay", username: "gordonramsay", topic_id: "Food" },
      { postType: 'question', content: "Philosophical clarity is like therapy. Ludwig Wittgenstein’s Tractatus breaks down how language limits our world, but the real genius lies in realizing that what can't be said still matters deeply.", name: "Arun Baku", username: "neiltyson", topic_id: "Filosofie" },
      { postType: 'thought', content: "Sometimes I think about how wild it is that we can instantly communicate with people across the globe. What a time to be alive!", name: "Mark Zuckerberg", username: "zuck", topic_id: "Technology" },
      { postType: 'opinion', content: "Unpopular opinion: Mondays aren't that bad. It's all about perspective.", name: "Tony Robbins", username: "tonyrobbins", topic_id: "Motivation" },
      { postType: 'question', content: "Bro im not even lying this app has got me scrolling for hours reading about FUCKING PHYSICS my nigga", name: "Bill Gates", username: "billgates", topic_id: "Self-Improvement" }
    ];

    return uniquePosts[index] || generatePostContent('thought');
  };

  const generateUniqueArticlePreview = (index) => {
    const uniqueArticles = [
      { articleType: 'tech', title: "The Future of AI: Friend or Foe?", content: "As AI continues to advance at an unprecedented rate, we explore the potential benefits and risks of this transformative technology.", username: "Lex Fridman", name: "lexfridman", topic_id: "AI" },
      { articleType: 'literature', title: "Ulysses Summary", content: "James Joyce's Ulysses, a modernist masterpiece, follows Leopold Bloom's odyssey through Dublin on June 16, 1904. The novel parallels Homer's Odyssey, exploring themes of identity, love, and the human condition through stream of consciousness and innovative literary techniques.", username: "Dillon McLeod", name: "dylanthefylan", topic_id: "Literature" },
      { articleType: 'science', title: "Breaking the Speed of Light: New Theories Emerge", content: "Recent breakthroughs in quantum physics suggest that faster-than-light travel might not be as impossible as once thought.", username: "Michio Kaku", name: "michiokaku", topic_id: "Physics" },
      { articleType: 'politics', title: "Atomic Habits Summary", content: "Atomic Habits shows how small, consistent changes can lead to big results by focusing on habit-building systems, making it easier to achieve personal goals and long-term growth.", username: "Michael Duda", name: "mickydude", topic_id: "Music" },
      { articleType: 'math', title: "Möbius Strip's Twist", content: "A surface with only one side and one boundary? The Möbius strip, a topological curiosity, defies our intuition about mathematical orientation and continuity.", username: "John Milnor", name: "TopologyWizard", topic_id: "Mathematics" }
    ];

    return uniqueArticles[index] || generateArticlePreview('tech');
  };

  const generatePageCount = () => {
    // Generate a random number between 0 and 1
    const rand = Math.random();
    
    if (rand < 0.6) {
      // 60% chance of being between 7 and 12
      return Math.floor(Math.random() * (12 - 7 + 1)) + 7;
    } else if (rand < 0.8) {
      // 20% chance of being between 5 and 6
      return Math.floor(Math.random() * (6 - 5 + 1)) + 5;
    } else {
      // 20% chance of being between 13 and 20
      return Math.floor(Math.random() * (20 - 13 + 1)) + 13;
    }
  };

  const generatePosts = (count) => {
    const sequence = ['P', 'A', 'P', 'A', 'A', 'P', 'P', 'A', 'P', 'A', 'A'];
    const newPosts = sequence.map((type, index) => {
      if (type === 'P') {
        const postContent = generateUniquePostContent(index);
        return {
          id: `generated_${Date.now()}_${index}`,
          type: 'post',
          postType: postContent.postType,
          username: postContent.username,
          name: postContent.name,
          content: postContent.content,
          comments: Math.floor(Math.random() * (30 - 10 + 1)) + 10,
          reposts: Math.min(Math.floor(Math.random() * 50), 40),
          likes: Math.floor(Math.random() * (100 - 50 + 1)) + 50,
          isUserPost: false,
          topic_id: postContent.topic_id,
        };
      } else {
        const article = generateUniqueArticlePreview(index);
        return {
          id: `generated_${Date.now()}_${index}`,
          type: 'article',
          articleType: article.articleType,
          title: article.title,
          username: article.username,
          name: article.name,
          content: article.content,
          comments: Math.floor(Math.random() * (30 - 10 + 1)) + 10,
          reposts: Math.min(Math.floor(Math.random() * 50), 40),
          likes: Math.floor(Math.random() * (100 - 50 + 1)) + 50,
          isUserPost: false,
          pageCount: generatePageCount(),
          topic_id: article.topic_id,
        };
      }
    });

    // If more posts are needed, fill with random posts
    if (count > sequence.length) {
      const additionalPosts = Array(count - sequence.length).fill().map((_, index) => {
        if (Math.random() < 0.5) {
          const postContent = generatePostContent('thought');
          return {
            id: `generated_${Date.now()}_${index + sequence.length}`,
            type: 'post',
            postType: 'thought',
            username: postContent.username,
            name: postContent.name,
            content: postContent.content,
            comments: Math.floor(Math.random() * (30 - 10 + 1)) + 10,
            reposts: Math.min(Math.floor(Math.random() * 50), 40),
            likes: Math.floor(Math.random() * (100 - 50 + 1)) + 50,
            isUserPost: false,
            topic_id: 'Random',
          };
        } else {
          const article = generateArticlePreview('tech');
          return {
            id: `generated_${Date.now()}_${index + sequence.length}`,
            type: 'article',
            articleType: 'tech',
            title: article.title,
            username: article.username,
            name: article.name,
            content: article.content,
            comments: Math.floor(Math.random() * (30 - 10 + 1)) + 10,
            reposts: Math.min(Math.floor(Math.random() * 50), 40),
            likes: Math.floor(Math.random() * (100 - 50 + 1)) + 50,
            isUserPost: false,
            pageCount: generatePageCount(),
            topic_id: 'Random',
          };
        }
      });
      newPosts.push(...additionalPosts);
    }

    newPosts.forEach(post => addPost(post, true));
    setRenderedPostCount(prevCount => prevCount + newPosts.length);
  };

  const fetchLatestPosts = async () => {
    if (!hasMorePosts || loading) return;

    try {
      setLoading(true);

      // Fetch user-created posts first
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');
      const name = await AsyncStorage.getItem('name');
      const username = await AsyncStorage.getItem('username');

      if (!token || !userId) {
        console.error('User not authenticated');
        return;
      }

      const response = await axios.get(`${POST_URL}/api/posts/latest?page=0&size=20`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const latestPosts = response.data;
      
      const processedPosts = latestPosts.map(post => ({
        ...post,
        type: post.title ? 'article' : 'post',
        name: post.name || name,
        username: post.username || username,
        topic_id: post.topic_id || null,
        isUserPost: true, // Mark these as user posts
      }));
      
      // Clear existing posts and add user posts first
      processedPosts.forEach(post => addPost(post, true));

      // Generate and add auto-generated posts
      if (page === 0) {
        generatePosts(11);
        setPage(prevPage => prevPage + 1);
        setRenderedPostCount(11 + processedPosts.length);
      } else {
        generatePosts(20);
        setPage(prevPage => prevPage + 1);
        setRenderedPostCount(prevCount => prevCount + 20);
      }

      if (latestPosts.length < 20) {
        setHasMorePosts(false);
      }
    } catch (error) {
      console.error('Error fetching latest posts:', error);
      generatePosts(20);
    } finally {
      setLoading(false);
    }
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
    if (index >= renderedPostCount) return null;
    const isReposted = reposts.some(repost => repost.originalPost.id === item.id);
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
            title: item.title,
            topic_id: item.topic_id, // Ensure topic_id is passed to Post component
          }}
          onCommentPress={() => handleCommentPress(item)}
          commentCount={item.comments}
        />
      );
    }
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
            data={posts}
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
});

export default ForYouPage;
