import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, SafeAreaView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';

// Load custom fonts
const loadFonts = async () => {
  await Font.loadAsync({
    'Athelas': require('./assets/fonts/Athelas-Regular.ttf'),
    'SFProText-Regular': require('./assets/fonts/SFProText-Regular.otf'),
    'SFProText-Bold': require('./assets/fonts/SFProText-Bold.otf'),
    'SFProText-Semibold': require('./assets/fonts/SFProText-Semibold.otf'),
  });
};

const Header = () => (
  <View style={styles.header}>
    <Text style={styles.headerText}>NoMedia</Text>
  </View>
);

const SearchBar = () => (
  <View style={styles.searchBarContainer}>
    <TextInput style={styles.searchBar} placeholder="Search NoMedia" />
  </View>
);

const NavigationBar = () => (
  <View style={styles.navBar}>
    <Ionicons name="home" size={24} color="black" />
    <Ionicons name="mic" size={24} color="black" />
    <View style={styles.createButton}>
      <Ionicons name="add" size={24} color="white" />
    </View>
    <Ionicons name="notifications" size={24} color="black" />
    <Ionicons name="person" size={24} color="black" />
  </View>
);

const ArticlePreview = ({ item }) => (
  <View style={styles.postContainer}>
    <Text style={styles.title}>{item.title}</Text>
    <Text style={styles.username}>{item.username} <Text style={styles.handle}>@{item.handle}</Text></Text>
    <View style={styles.previewBox}>
      <Text style={styles.content} numberOfLines={3}>{item.content}</Text>
      <TouchableOpacity>
        <Text style={styles.moreButton}>more</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.toolBar}>
      <View style={styles.toolItem}>
        <Ionicons name="chatbubble-outline" size={20} color="gray" />
        <Text style={styles.toolCount}>{item.comments}</Text>
      </View>
      <View style={styles.toolItem}>
        <Ionicons name="repeat" size={20} color="gray" />
        <Text style={styles.toolCount}>{item.reposts}</Text>
      </View>
      <View style={styles.toolItem}>
        <Ionicons name="heart-outline" size={20} color="gray" />
        <Text style={styles.toolCount}>{item.likes}</Text>
      </View>
      <Ionicons name="share-outline" size={20} color="gray" />
    </View>
  </View>
);

const Post = ({ item }) => (
  <View style={styles.postContainer}>
    <Text style={styles.username}>{item.username} <Text style={styles.handle}>@{item.handle}</Text></Text>
    <Text style={styles.content}>{item.content}</Text>
    <View style={styles.toolBar}>
      <View style={styles.toolItem}>
        <Ionicons name="chatbubble-outline" size={20} color="gray" />
        <Text style={styles.toolCount}>{item.comments}</Text>
      </View>
      <View style={styles.toolItem}>
        <Ionicons name="repeat" size={20} color="gray" />
        <Text style={styles.toolCount}>{item.reposts}</Text>
      </View>
      <View style={styles.toolItem}>
        <Ionicons name="heart-outline" size={20} color="gray" />
        <Text style={styles.toolCount}>{item.likes}</Text>
      </View>
      <Ionicons name="share-outline" size={20} color="gray" />
    </View>
  </View>
);

const ForYouPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
    fetchPosts();
  }, []);

  const fetchPosts = () => {
    setLoading(true);
    // Simulating API call
    setTimeout(() => {
      const newPosts = Array(10).fill().map((_, index) => ({
        id: Date.now() + index,
        type: Math.random() > 0.5 ? 'article' : 'post',
        title: 'Sample Article Title',
        username: `User${Math.floor(Math.random() * 1000)}`,
        handle: `handle${Math.floor(Math.random() * 1000)}`,
        content: 'This is a sample content for the post or article preview. It can be longer or shorter depending on the actual content.',
        comments: Math.floor(Math.random() * 100),
        reposts: Math.floor(Math.random() * 100),
        likes: Math.floor(Math.random() * 1000),
      }));
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

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <Header />
      <SearchBar />
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        onEndReached={fetchPosts}
        onEndReachedThreshold={0.1}
        ListFooterComponent={loading ? <Text>Loading...</Text> : null}
      />
      <NavigationBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerText: {
    fontFamily: 'Athelas',
    fontSize: 22,
  },
  searchBarContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 10,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 50,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  createButton: {
    backgroundColor: 'blue',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontFamily: 'SFProText-Semibold',
    fontSize: 18,
    marginBottom: 4,
  },
  username: {
    fontFamily: 'SFProText-Bold',
    fontSize: 16,
  },
  handle: {
    fontFamily: 'SFProText-Regular',
    fontSize: 16,
    color: '#687684',
  },
  previewBox: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    marginTop: 4,
    borderRadius: 5,
  },
  content: {
    fontFamily: 'SFProText-Regular',
    fontSize: 16,
  },
  moreButton: {
    color: 'blue',
    marginTop: 4,
  },
  toolBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 8,
  },
  toolItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16
  },
  toolCount: {
    marginLeft: 2,
    fontSize: 14,
    color: 'gray',
  },
});

export default ForYouPage;