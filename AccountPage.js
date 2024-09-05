import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Post from './Post';
import ArticlePreview from './ArticlePreview';

const CONTENT_INDENT = '  '; // Two spaces for indentation

const PersonalInfo = ({ username, handle, bio, following, followers }) => (
  <View style={styles.personalInfo}>
    <Text style={styles.username}>{username}</Text>
    <Text style={styles.handle}>@{handle}</Text>
    <Text style={styles.bio}>{bio}</Text>
    <View style={styles.followInfo}>
      <Text style={styles.followText}>{following} Following</Text>
      <Text style={styles.followText}>{followers} Followers</Text>
    </View>
  </View>
);

const ActionButtons = () => (
  <View style={styles.actionButtons}>
    <TouchableOpacity style={styles.button}>
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

const AccountPage = () => {
  const [activeTab, setActiveTab] = useState('Posts');
  const [content, setContent] = useState([]);

  useEffect(() => {
    fetchContent();
  }, [activeTab]);

  const fetchContent = () => {
    // Simulating API call
    setTimeout(() => {
      const newContent = Array(10).fill().map((_, index) => ({
        id: Date.now() + index,
        type: Math.random() > 0.6 ? 'article' : 'post',
        title: 'Sample Article Title',
        username: `User${Math.floor(Math.random() * 1000)}`,
        handle: `handle${Math.floor(Math.random() * 1000)}`,
        content: `${CONTENT_INDENT}This is a sample content for the post or article preview. It is designed to be longer than 150 \ncharacters to demonstrate how the content truncation works in our application. This extended text allows us to see how the "more" button appears and functions when the content exceeds the character limit.`,
        comments: Math.floor(Math.random() * 100),
        reposts: Math.floor(Math.random() * 100),
        likes: Math.floor(Math.random() * 1000),
        isLiked: activeTab === 'Likes',
      }));
      setContent(newContent);
    }, 1000);
  };

  const renderItem = ({ item }) => {
    if (activeTab === 'Replies') {
      return (
        <View style={styles.replyContainer}>
          <Post item={item} />
          <View style={styles.replyLine} />
          <View style={styles.reply}>
            <Post item={{...item, username: 'YourUsername', handle: 'yourhandle'}} />
          </View>
        </View>
      );
    }
    return item.type === 'article' ? <ArticlePreview item={item} /> : <Post item={item} />;
  };

  return (
    <View style={styles.container}>
      <ScrollView stickyHeaderIndices={[1]}>
        <PersonalInfo
          username="John Doe"
          handle="johndoe"
          bio="This is a brief self-introduction that is under 150 characters. It showcases the user's personality and interests."
          following={500}
          followers={1000}
        />
        <View style={styles.stickyHeader}>
          <ActionButtons />
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
  stickyHeader: {
    backgroundColor: '#000',
    paddingTop: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#333',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  buttonText: {
    fontFamily: 'SFProText-Semibold',
    color: '#fff',
    fontSize: 14,
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
});

export default AccountPage;
