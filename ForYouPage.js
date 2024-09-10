import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Popover from 'react-native-popover-view';
// Make sure to import Platform for platform-specific shadow styles
import { Platform } from 'react-native';

const LIGHT_GREY = '#CCCCCC';

const SearchBar = () => (
  <View style={styles.searchBarContainer}>
    <TextInput style={styles.searchBar} placeholder="Search NoMedia" placeholderTextColor="#999" />
    <Ionicons name="search" size={24} color="#999" style={styles.searchIcon} />
  </View>
);

const MoreOptions = ({ onDislike, onReport }) => (
  <View style={styles.moreOptionsContainer}>
    <TouchableOpacity style={styles.moreOptionItem} onPress={onDislike}>
      <Ionicons name="thumbs-down-outline" size={20} color="white" />
      <Text style={styles.moreOptionText}>Dislike</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.moreOptionItem} onPress={onReport}>
      <Ionicons name="flag-outline" size={20} color="white" />
      <Text style={styles.moreOptionText}>Report</Text>
    </TouchableOpacity>
  </View>
);

const ArticlePreview = ({ item }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleDislike = () => {
    Alert.alert('Disliked', 'You have disliked this article');
    setShowOptions(false);
  };

  const handleReport = () => {
    Alert.alert('Reported', 'You have reported this article');
    setShowOptions(false);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    // Here you would typically update the like count on the server
  };

  const indentedContent = '  ' + item.content; // Add two space characters at the beginning

  return (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <Text style={styles.title}>{item.title}</Text>
        <Popover
          isVisible={showOptions}
          onRequestClose={() => setShowOptions(false)}
          from={(
            <TouchableOpacity onPress={() => setShowOptions(true)} style={styles.moreIconContainer}>
              <Ionicons name="ellipsis-horizontal" size={16} color={LIGHT_GREY} />
            </TouchableOpacity>
          )}
          popoverStyle={styles.popover}
        >
          <MoreOptions onDislike={handleDislike} onReport={handleReport} />
        </Popover>
      </View>
      <Text style={styles.username}>{item.username} <Text style={styles.handle}>@{item.handle}</Text></Text>
      <View style={styles.previewBoxContainer}>
        <View style={styles.previewBoxShadow} />
        <View style={styles.previewBox}>
          <Text style={styles.previewContent}>
            {indentedContent.slice(0, 197)}...{' '}
            <Text style={styles.moreButton} onPress={() => {}}>more</Text>
          </Text>
        </View>
      </View>
      <View style={styles.toolBar}>
        <View style={styles.toolItem}>
          <Ionicons name="chatbubble-outline" size={18} color="gray" />
          <Text style={styles.toolCount}>{item.comments}</Text>
        </View>
        <View style={styles.toolItem}>
          <Ionicons name="repeat" size={18} color="gray" />
          <Text style={styles.toolCount}>{item.reposts}</Text>
        </View>
        <TouchableOpacity style={styles.toolItem} onPress={handleLike}>
          <Ionicons 
            name={isLiked ? "heart" : "heart-outline"} 
            size={18} 
            color={isLiked ? "white" : "gray"} 
          />
          <Text style={styles.toolCount}>{item.likes}</Text>
        </TouchableOpacity>
        <Ionicons name="share-outline" size={18} color="gray" />
      </View>
    </View>
  );
};

const Post = ({ item }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleDislike = () => {
    Alert.alert('Disliked', 'You have disliked this post');
    setShowOptions(false);
  };

  const handleReport = () => {
    Alert.alert('Reported', 'You have reported this post');
    setShowOptions(false);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    // Here you would typically update the like count on the server
  };

  return (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <Text style={styles.username}>{item.username} <Text style={styles.handle}>@{item.handle}</Text></Text>
        <Popover
          isVisible={showOptions}
          onRequestClose={() => setShowOptions(false)}
          from={(
            <TouchableOpacity onPress={() => setShowOptions(true)} style={styles.moreIconContainer}>
              <Ionicons name="ellipsis-horizontal" size={16} color="#CCCCCC" />
            </TouchableOpacity>
          )}
          popoverStyle={styles.popover}
        >
          <MoreOptions onDislike={handleDislike} onReport={handleReport} />
        </Popover>
      </View>
      <Text style={styles.postContent}>
        {item.content.slice(0, 150)}
      </Text>
      <View style={styles.toolBar}>
        <View style={styles.toolItem}>
          <Ionicons name="chatbubble-outline" size={18} color="gray" />
          <Text style={styles.toolCount}>{item.comments}</Text>
        </View>
        <View style={styles.toolItem}>
          <Ionicons name="repeat" size={18} color="gray" />
          <Text style={styles.toolCount}>{item.reposts}</Text>
        </View>
        <TouchableOpacity style={styles.toolItem} onPress={handleLike}>
          <Ionicons 
            name={isLiked ? "heart" : "heart-outline"} 
            size={18} 
            color={isLiked ? "white" : "gray"} 
          />
          <Text style={styles.toolCount}>{item.likes}</Text>
        </TouchableOpacity>
        <Ionicons name="share-outline" size={18} color="gray" />
      </View>
    </View>
  );
};

const ForYouPage = ({ navigation }) => {
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
        // Adjust this probability to control the ratio of posts to articles
        const isArticle = Math.random() > 0.6; // 20% chance of being an article
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

  const renderItem = ({ item }) => {
    if (item.type === 'article') {
      return <ArticlePreview item={item} />;
    } else {
      return <Post item={item} />;
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
        ListFooterComponent={loading ? <Text>Loading...</Text> : null}
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
    paddingHorizontal: 16, // Add horizontal padding to the entire scroll content
  },
  postContainer: {
    paddingVertical: 12,    // Combine top and bottom padding
    paddingHorizontal: 4,   // Reduce horizontal padding as we've added it to scrollContent
    marginBottom: 4,        // Kept the reduced margin between posts
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  moreIconContainer: {
    padding: 4,
    marginTop: -4,
    marginRight: -8, // Adjusted to account for the new padding
  },
  title: {
    fontFamily: 'Athelas',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    marginRight: 8,
    marginBottom: 2,
  },
  username: {
    fontFamily: 'SFProText-Regular',
    fontSize: 16,
    color: '#fff',
    marginBottom: 4,
  },
  handle: {
    fontFamily: 'SFProText-Regular',
    fontSize: 16,
    color: '#687684',
  },
  previewBoxContainer: {
    marginTop: 8,
    marginBottom: 8,
    marginHorizontal: 0,
  },
  previewBoxShadow: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: -4,
    bottom: -4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Slightly transparent white
    borderRadius: 12,
  },
  previewBox: {
    backgroundColor: '#333', // Dark grey background
    padding: 16,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  previewContent: {
    fontFamily: 'SFProText',
    fontSize: 16,
    lineHeight: 22,
    color: '#fff',
  },
  moreButton: {
    color: '#000000', // Explicitly set to black
    fontWeight: 'bold',
    fontSize: 16,
  },
  underline: {
    textDecorationLine: 'underline',
  },
  toolBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginLeft: 4, // Adjusted to align with the content
  },
  toolItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  toolCount: {
    marginLeft: 4,
    fontSize: 14,
    color: '#687684',
    lineHeight: 18,
  },
  popover: {
    backgroundColor: '#333',
    borderRadius: 8,
  },
  moreOptionsContainer: {
    backgroundColor: 'transparent',
  },
  moreOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  moreOptionText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
  },
  postContent: {
    fontFamily: 'SFProText',
    fontSize: 16,
    lineHeight: 22,
    color: '#fff',
    marginBottom: 0,
    paddingLeft: 4,  // Reduced left padding to align with new container padding
  },
  searchBarContainer: {
    padding: 10,
    paddingHorizontal: 16, // Increased horizontal padding
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
    left: 26, // Adjusted to account for the new padding
    top: 18,
  },
});

export default ForYouPage;