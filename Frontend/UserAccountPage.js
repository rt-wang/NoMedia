import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Post from './Post';
import ArticlePreview from './ArticlePreview';
import { useReposts } from './RepostContext';
import { usePosts } from './PostContext';
import { useNavigation } from '@react-navigation/native';

const CONTENT_INDENT = '  '; // Two spaces for indentation

const PersonalInfo = ({ name, username, bio, following, followers }) => (
  <View style={styles.personalInfo}>
    <Text style={styles.name}>{name}</Text>
    <Text style={styles.username}>{username}</Text>
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

const ActionButtons = ({ onFollowPress, onMessagePress }) => (
  <View style={styles.actionButtons}>
    <TouchableOpacity style={styles.button} onPress={onFollowPress}>
      <Text style={styles.buttonText}>Follow</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.button} onPress={onMessagePress}>
      <Text style={styles.buttonText}>Message</Text>
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

const UserAccountPage = ({ route }) => {
  const { username } = route.params;
  const [activeTab, setActiveTab] = useState('Posts');
  const [content, setContent] = useState([]);
  const { reposts } = useReposts();
  const { posts } = usePosts();
  const navigation = useNavigation();

  const [profile, setProfile] = useState({
    name: 'User Name',
    username: username,
    bio: 'This is a brief self-introduction that is under 150 characters. It showcases the user\'s personality and interests.',
    following: 500,
    followers: 1000,
  });

  useEffect(() => {
    fetchContent();
  }, [activeTab, reposts, posts, username]);

  const fetchContent = () => {
    let newContent = [];
    if (activeTab === 'Posts') {
      // Leave this empty to display nothing for the Posts tab
      newContent = [];
    } else if (activeTab === 'Replies') {
      // Simulating replies data
      newContent = [
        { id: '3', username: username, handle: username, content: 'A reply', timestamp: Date.now(), reply: { username: 'Jane', handle: 'jane', content: 'Original post' } },
      ];
    } else if (activeTab === 'Likes') {
      // Simulating liked posts
      newContent = [
        { id: '4', username: 'Jane', handle: 'jane', content: 'A liked post', timestamp: Date.now() - 2000 },
      ];
    }
    setContent(newContent);
  };

  const handleFollowPress = () => {
    // Implement follow functionality
    console.log('Follow button pressed');
  };

  const handleMessagePress = () => {
    // Implement message functionality
    console.log('Message button pressed');
  };

  const renderItem = ({ item }) => {
    if (activeTab === 'Replies') {
      return <ReplyContainer item={item} reply={item.reply} />;
    }
    if (item.type === 'repost') {
      return (
        <View style={styles.repostContainer}>
          <Text style={styles.repostIndicator}>
            <Ionicons name="repeat" size={14} color="#FFB6C1" /> Reposted
          </Text>
          <Post item={item.originalPost} />
        </View>
      );
    }
    if (item.type === 'quote') {
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

  return (
    <View style={styles.container}>
      <ScrollView stickyHeaderIndices={[1]}>
        <View style={styles.headerContainer}>
          <PersonalInfo
            name={profile.name}
            username={profile.username}
            bio={profile.bio}
            following={profile.following}
            followers={profile.followers}
          />
        </View>
        <View style={styles.stickyHeader}>
          <ActionButtons onFollowPress={handleFollowPress} onMessagePress={handleMessagePress} />
          <ContentTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </View>
        <FlatList
          data={content}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          scrollEnabled={false}
        />
      </ScrollView>
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
    paddingRight: 16,
  },
  personalInfo: {
    flex: 1,
    padding: 16,
  },
  name: {
    fontFamily: 'SFProText-Bold',
    fontSize: 24,
    color: '#fff',
    marginBottom: 5,
  },
  username: {
    fontFamily: 'SFProText-Regular',
    fontSize: 16,
    color: '#687684',
  },
  bio: {
    fontFamily: 'SFProText-Regular',
    fontSize: 16,
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
    fontSize: 14,
    color: '#687684',
    marginRight: 16,
  },
  followCount: {
    fontFamily: 'SFProText-Semibold',
    color: '#fff',
  },
  stickyHeader: {
    backgroundColor: '#000',
    paddingTop: 6,
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
  repostContainer: {
    marginBottom: 0, // Reduced from 16 to 8
  },
  repostIndicator: {
    color: '#FFB6C1',
    fontSize: 14,
    marginBottom: 4, // Reduced from 8 to 4
    top: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  button: {
    backgroundColor: '#333',
    paddingVertical: 6,
    paddingHorizontal: 0,
    borderRadius: 10,
    width: '48%',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'SFProText-Semibold',
    color: '#fff',
    fontSize: 14,
  },
});

export default UserAccountPage;
