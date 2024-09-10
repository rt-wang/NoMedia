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
      <Text style={styles.followText}>
        <Text style={styles.followCount}>{following}</Text> Following
      </Text>
      <Text style={styles.followText}>
        <Text style={styles.followCount}>{followers}</Text> Followers
      </Text>
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

  useEffect(() => {
    fetchContent();
  }, [activeTab]);

  const fetchContent = () => {
    // Simulating API call
    setTimeout(() => {
      const newContent = Array(10).fill().map((_, index) => {
        const isArticle = Math.random() > 0.5;
        const baseContent = 'This is a sample content for the post or article preview. It is designed to be longer than 150 characters to demonstrate how the content truncation works in our application.';
        const content = isArticle ? `${CONTENT_INDENT}${baseContent}` : baseContent;

        const baseItem = {
          id: Date.now() + index,
          type: isArticle ? 'article' : 'post',
          title: isArticle ? 'Sample Article Title' : undefined,
          username: `User${Math.floor(Math.random() * 1000)}`,
          handle: `handle${Math.floor(Math.random() * 1000)}`,
          content: content,
          comments: Math.floor(Math.random() * 100),
          reposts: Math.floor(Math.random() * 100),
          likes: Math.floor(Math.random() * 1000),
          isLiked: activeTab === 'Likes',
        };

        if (activeTab === 'Replies') {
          return {
            ...baseItem,
            reply: {
              id: Date.now() + index + 1000,
              type: 'post',
              username: 'YourUsername',
              handle: 'yourhandle',
              content: 'This is a sample reply to the ' + (isArticle ? 'article' : 'post') + ' above. It demonstrates how replies are displayed in the account page.',
              comments: Math.floor(Math.random() * 50),
              reposts: Math.floor(Math.random() * 50),
              likes: Math.floor(Math.random() * 500),
            }
          };
        }

        return baseItem;
      });
      setContent(newContent);
    }, 1000);
  };

  const renderItem = ({ item }) => {
    if (activeTab === 'Replies') {
      if (!item || !item.reply) {
        return null; // or return a placeholder component
      }
      return <ReplyContainer item={item} reply={item.reply} />;
    }
    if (!item) {
      return null; // or return a placeholder component
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
});

export default AccountPage;
