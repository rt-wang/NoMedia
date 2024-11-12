import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Post from './Post';
import ArticlePreview from './ArticlePreview';
import { useReposts } from './RepostContext';
import { usePosts } from './PostContext';
import EditProfileModal from './EditProfileModal';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const CONTENT_INDENT = '  '; // Two spaces for indentation
const USER_URL = `http://localhost:8080`;
const POST_URL = `http://localhost:8082`;

const PersonalInfo = ({ name, username, bio, following, followers }) => (
  <View style={styles.personalInfo}>
    <Text style={styles.name}>{name}</Text>
    <Text style={styles.username}>@{username}</Text>
    <Text style={styles.bio}>{bio}</Text>
    <View style={styles.followInfo}>
      <Text style={styles.followText}>
        <Text style={styles.followCount}>{following}</Text> Following
      </Text>
      <Text style={styles.followText}>
        <Text style={styles.followCount}>{followers}</Text> Followers
      </Text>
    </View>
  </View>
);

const ActionButtons = ({ onEditProfile, onDraftsPress }) => (
  <View style={styles.actionButtons}>
    <TouchableOpacity style={styles.button} onPress={onEditProfile}>
      <Text style={styles.buttonText}>Edit Profile</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.button} onPress={onDraftsPress}>
      <Text style={styles.buttonText}>Drafts</Text>
    </TouchableOpacity>
  </View>
);

const ContentTabs = ({ activeTab, setActiveTab }) => (
  <View style={styles.contentTabs}>
    <TouchableOpacity onPress={() => setActiveTab('Posts')} style={[styles.tab, activeTab === 'Posts' && styles.activeTab]}>
      <Text style={[styles.tabText, activeTab === 'Posts' && styles.activeTabText]}>Posts</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => setActiveTab('Replies')} style={[styles.tab, activeTab === 'Replies' && styles.activeTab]}>
      <Text style={[styles.tabText, activeTab === 'Replies' && styles.activeTabText]}>Replies</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => setActiveTab('Likes')} style={[styles.tab, activeTab === 'Likes' && styles.activeTab]}>
      <Text style={[styles.tabText, activeTab === 'Likes' && styles.activeTabText]}>Likes</Text>
    </TouchableOpacity>
  </View>
);

const ReplyContainer = ({ item, reply }) => {
  if (!item || !reply) {
    return null; // or return a placeholder component
  }

  return (
    <View style={styles.replyContainer}>
      {item.type === 'article' ? <ArticlePreview item={item} /> : <Post item={item} />}
      <View style={styles.replyLine} />
      <View style={styles.reply}>
        <Post item={reply} />
      </View>
    </View>
  );
};

const AccountPage = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Posts');
  const [userInfo, setUserInfo] = useState(null);
  const [posts, setPosts] = useState([]);
  const { reposts } = useReposts();
  const { userPosts, currentUser } = usePosts();
  const [isEditProfileModalVisible, setIsEditProfileModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  // Add this new state to track if user info has been fetched
  const [isUserInfoLoaded, setIsUserInfoLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await fetchUserInfo();
      setIsLoading(false);
      setIsUserInfoLoaded(true); // Set this to true after fetching user info
    };
    loadData();
  }, []);

  useEffect(() => {
    if (userInfo) {
      fetchContent();
    }
  }, [userInfo, activeTab]);

  const fetchUserInfo = async () => {
    console.log('Fetching user info');
    try {
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');
      const authorities = await AsyncStorage.getItem(`authorities`);

      
      if (!token || !userId) { // Update this condition
        console.error('No token or username found in AsyncStorage');
        return;
      }

      console.log('Sending request with token for users:', token, userId, authorities);
      const response = await axios.get(`${USER_URL}/api/users/${userId}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Authorities': authorities
        }
      });

      console.log('Response status:', response.status);
      console.log('Response data:', response.data);

      if (response.status === 200) {
        const userData = response.data;
        setUserData(userData);
        setUserInfo({
          name: userData.name,
          username: userData.username,
          bio: userData.bio || '',
          following: userData.following || 90,
          followers: userData.followers || 62,
          authorities: JSON.parse(authorities)
        });
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      Alert.alert('Error', 'Failed to load user information');
    }
  };

  const fetchContent = async () => {
    if (activeTab !== 'Posts' || !userInfo) return;

    try {
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');
      const authorities = await AsyncStorage.getItem('authorities');

      if (!token || !userId || !authorities) {
        throw new Error('User not authenticated or missing credentials');
      }

      console.log('Sending request with token for posts:', token, userId, authorities);
      const response = await axios.get(`${POST_URL}/api/posts/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      console.log('API response:', response);
      console.log('Response data:', response.data);

      if (Array.isArray(response.data)) {
        const validPosts = response.data
          .filter(post => post.content && post.content.trim() !== '')
          .map(post => ({
            ...post,
            name: userInfo.name,
            username: userInfo.username,
            type: post.title ? 'article' : 'post',
          }));
        console.log('Processed posts:', validPosts);
        setPosts(validPosts);
      } else {
        console.error('Unexpected response data structure:', response.data);
        setPosts([]);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const renderHeader = () => (
    <>
      <View style={styles.headerContainer}>
        <PersonalInfo
          name={userInfo.name}
          username={userInfo.username}
          bio={userInfo.bio}
          following={userInfo.following}
          followers={userInfo.followers}
        />
        <TouchableOpacity 
          onPress={() => navigation.navigate('Settings')} 
          style={styles.settingsButton}
        >
          <Ionicons name="settings-outline" size={22} color="#687684" />
        </TouchableOpacity>
      </View>
      <View style={styles.stickyHeader}>
        <ActionButtons onEditProfile={handleEditProfile} onDraftsPress={handleDraftsPress} />
        <ContentTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </View>
    </>
  );

  const renderItem = useCallback(({ item }) => {
    if (item.type === 'header') {
      return renderHeader();
    }
    if (activeTab === 'Replies') {
      return <ReplyContainer item={item} reply={item.reply} />;
    }
    if (item.type === 'repost') {
      return (
        <View style={styles.repostContainer}>
          <Text style={styles.repostIndicator}>
            <Ionicons name="repeat" size={14} color="#FFB6C1" /> You Reposted
          </Text>
          <Post item={{...item.originalPost, name: item.originalPost.name, username: item.originalPost.username}} isOwnPost={true} />
        </View>
      );
    }
    if (item.type === 'quote') {
      return (
        <View style={styles.quoteRepostContainer}>
          <Post item={{ ...item, content: item.quoteText, name: item.name, username: item.username }} isOwnPost={true} />
          <View style={styles.quotedPostContainer}>
            <Post item={{...item.originalPost, name: item.originalPost.name, username: item.originalPost.username}} />
          </View>
        </View>
      );
    }
    return item.type === 'article' ? 
      <ArticlePreview item={{...item, name: userInfo?.name, username: userInfo?.username}} /> : 
      <Post item={{...item, name: userInfo?.name, username: userInfo?.username}} isOwnPost={true} />;
  }, [userInfo, activeTab]);

  const handleEditProfile = () => {
    setIsEditProfileModalVisible(true);
  };

  const handleSaveProfile = (updatedProfile) => {
    setUserInfo(prevUserInfo => ({
      ...prevUserInfo,
      ...updatedProfile
    }));
    // Optionally, you might want to refetch user info here to ensure consistency with the server
    fetchUserInfo();
  };

  const handleDraftsPress = () => {
    navigation.navigate('Drafts');
  };

  return (
    <View style={styles.container}>
      {isUserInfoLoaded ? (
        <FlatList
          data={[{ type: 'header' }, ...(posts || [])]}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.post_id?.toString() || `item-${index}`}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            isLoading ? (
              <Text style={styles.message}>Loading...</Text>
            ) : error ? (
              <Text style={styles.message}>Error: {error}</Text>
            ) : (
              <Text style={styles.message}>No posts yet. Create your first post!</Text>
            )
          }
          stickyHeaderIndices={[0]}
        />
      ) : (
        <Text style={styles.message}>Loading user information...</Text>
      )}
      {isUserInfoLoaded && userInfo && (
        <EditProfileModal
          isVisible={isEditProfileModalVisible}
          onClose={() => setIsEditProfileModalVisible(false)}
          onSave={handleSaveProfile}
          initialProfile={{
            name: userInfo.name,
            username: userInfo.username,
            bio: userInfo.bio || ''
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: '#000',
  },
  settingsButton: {
    padding: 8,
    marginTop: 3,
  },
  personalInfo: {
    flex: 1,
    paddingVertical: 8,
  },
  name: {
    fontFamily: 'SFProText-Bold',
    fontSize: 24,
    color: '#fff',
    marginBottom: 2,
  },
  username: {
    fontFamily: 'SFProText-Regular',
    fontSize: 15,
    color: '#687684',
    marginBottom: 8,
  },
  bio: {
    fontFamily: 'SFProText-Regular',
    fontSize: 15,
    color: '#fff',
    marginTop: 8,
    marginBottom: 8,
  },
  followInfo: {
    flexDirection: 'row',
    marginTop: 8,
  },
  followText: {
    fontFamily: 'SFProText-Regular',
    fontSize: 15,
    color: '#687684',
    marginRight: 20,
  },
  followCount: {
    fontFamily: 'SFProText-Semibold',
    color: '#fff',
  },
  stickyHeader: {
    backgroundColor: '#000',
    paddingTop: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  button: {
    backgroundColor: '#333',
    paddingVertical: 8,
    borderRadius: 6,
    width: '48%',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'SFProText-Semibold',
    color: '#fff',
    fontSize: 15,
  },
  contentTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tab: {
    paddingVertical: 12,
    flex: 1,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#fff',
  },
  tabText: {
    fontFamily: 'SFProText-Regular',
    fontSize: 15,
    color: '#687684',
  },
  activeTabText: {
    color: '#fff',
  },
  replyContainer: {
    marginBottom: 16,
  },
  replyLine: {
    width: 2,
    backgroundColor: '#333',
    marginLeft: 24,
    height: 20,
  },
  reply: {
    marginLeft: 24,
  },
  quoteRepostContainer: {
    marginBottom: 16,
  },
  quotedPostContainer: {
    marginLeft: 16,
    borderLeftWidth: 2,
    borderLeftColor: '#333',
    paddingLeft: 8,
  },
  repostContainer: {
    marginBottom: 0, // Reduced from 16 to 8
  },
  repostIndicator: {
    color: '#FFB6C1',
    fontSize: 14,
    marginBottom: 4, // Reduced from 8 to 4
    top: 12,
  },
  message: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 20,
  }
});

export default AccountPage;
