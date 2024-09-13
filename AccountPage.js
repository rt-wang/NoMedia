import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Post from './Post';
import ArticlePreview from './ArticlePreview';
import { useReposts } from './RepostContext';
import EditProfileModal from './EditProfileModal';

const CONTENT_INDENT = '  '; // Two spaces for indentation

const PersonalInfo = ({ username, handle, bio, following, followers, location }) => (
  <View style={styles.personalInfo}>
    <Text style={styles.username}>{username}</Text>
    <Text style={styles.handle}>@{handle}</Text>
    <Text style={styles.bio}>{bio}</Text>
    <View style={styles.locationContainer}>
      {location && (
        <View style={styles.locationItem}>
          <Ionicons name="location-outline" size={16} color="#687684" />
          <Text style={styles.locationText}>{location}</Text>
        </View>
      )}
    </View>
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

const ActionButtons = ({ onEditProfile }) => (
  <View style={styles.actionButtons}>
    <TouchableOpacity style={styles.button} onPress={onEditProfile}>
      <Text style={styles.buttonText}>Edit Profile</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.button}>
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

const AccountPage = () => {
  const [activeTab, setActiveTab] = useState('Posts');
  const [content, setContent] = useState([]);
  const [posts, setPosts] = useState([]);
  const { reposts } = useReposts();
  const [isEditProfileModalVisible, setIsEditProfileModalVisible] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Doe',
    handle: 'johndoe',
    bio: 'This is a brief self-introduction that is under 150 characters. It showcases the user\'s personality and interests.',
    following: 500,
    followers: 1000,
    location: '',
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    fetchContent();
  }, [activeTab, reposts, posts]);

  const fetchPosts = () => {
    // Simulating API call to fetch user's original posts
    setTimeout(() => {
      const originalPosts = [
        { id: '1', username: 'John Doe', handle: 'johndoe', content: 'This is an original post', timestamp: Date.now() },
        { id: '2', username: 'John Doe', handle: 'johndoe', content: 'Another original post', timestamp: Date.now() - 1000 },
      ];
      setPosts(originalPosts);
    }, 1000);
  };

  const fetchContent = () => {
    let newContent;
    if (activeTab === 'Posts') {
      // Combine original posts and reposts (including quote-type reposts)
      newContent = [...posts, ...reposts].sort((a, b) => b.timestamp - a.timestamp);
    } else if (activeTab === 'Replies') {
      // Simulating replies data
      newContent = [
        { id: '3', username: 'John Doe', handle: 'johndoe', content: 'A reply', timestamp: Date.now(), reply: { username: 'Jane', handle: 'jane', content: 'Original post' } },
      ];
    } else if (activeTab === 'Likes') {
      // Simulating liked posts
      newContent = [
        { id: '4', username: 'Jane', handle: 'jane', content: 'A liked post', timestamp: Date.now() - 2000 },
      ];
    }
    setContent(newContent.sort((a, b) => b.timestamp - a.timestamp));
  };

  const renderItem = ({ item }) => {
    if (activeTab === 'Replies') {
      return <ReplyContainer item={item} reply={item.reply} />;
    }
    if (item.isRepost && item.quoteText) {
      return (
        <View style={styles.quoteRepostContainer}>
          <Post item={{ ...item, content: item.quoteText }} />
          <View style={styles.quotedPostContainer}>
            <Post item={item.originalPost} />
          </View>
        </View>
      );
    }
    return item.type === 'article' ? <ArticlePreview item={item} /> : <Post item={item} />;
  };

  const handleEditProfile = () => {
    setIsEditProfileModalVisible(true);
  };

  const handleSaveProfile = (updatedProfile) => {
    setProfile({ ...profile, ...updatedProfile });
  };

  return (
    <View style={styles.container}>
      <ScrollView stickyHeaderIndices={[1]}>
        <PersonalInfo
          username={profile.name}
          handle={profile.handle}
          bio={profile.bio}
          following={profile.following}
          followers={profile.followers}
          location={profile.location}
        />
        <View style={styles.stickyHeader}>
          <ActionButtons onEditProfile={handleEditProfile} />
          <ContentTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </View>
        <FlatList
          data={content}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          scrollEnabled={false}
        />
      </ScrollView>
      <EditProfileModal
        isVisible={isEditProfileModalVisible}
        onClose={() => setIsEditProfileModalVisible(false)}
        onSave={handleSaveProfile}
        initialProfile={profile}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  personalInfo: {
    padding: 16,
  },
  username: {
    fontFamily: 'SFProText-Bold',
    fontSize: 24,
    color: '#fff',
  },
  handle: {
    fontFamily: 'SFProText-Regular',
    fontSize: 16,
    color: '#687684',
  },
  bio: {
    fontFamily: 'SFProText-Regular',
    fontSize: 16,
    color: '#fff',
    marginTop: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  locationText: {
    fontFamily: 'SFProText-Regular',
    fontSize: 14,
    color: '#687684',
    marginLeft: 4,
  },
  followInfo: {
    flexDirection: 'row',
    marginTop: 8,
  },
  followText: {
    fontFamily: 'SFProText-Regular',
    fontSize: 14,
    color: '#687684',
    marginRight: 16,
  },
  followCount: {
    fontFamily: 'SFProText-Semibold', // Use the semibold font
    color: '#fff', // This makes the number white
  },
  stickyHeader: {
    backgroundColor: '#000',
    paddingTop: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 16, // Add horizontal padding
  },
  button: {
    backgroundColor: '#333',
    paddingVertical: 6, // Increased vertical padding
    paddingHorizontal: 0, // Remove horizontal padding
    borderRadius: 10,
    width: '48%', // Set width to 48% of container width
    alignItems: 'center', // Center content horizontally
  },
  buttonText: {
    fontFamily: 'SFProText-Semibold',
    color: '#fff',
    fontSize: 14, // Slightly increased font size
  },
  contentTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
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
    fontSize: 16,
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
});

export default AccountPage;
