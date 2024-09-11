import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from './Header';
import NavigationBar from './NavigationBar';
import { useFonts } from 'expo-font';

const { width, height } = Dimensions.get('window');

const CONTENT_INDENT = '    '; // Two spaces for indentation

const Thread = ({ content, pageNumber, totalPages, image }) => (
  <View style={styles.threadContainer}>
    <Text style={styles.pageCounter}>{`${pageNumber}/${totalPages}`}</Text>
    <Text style={styles.threadContent}>{CONTENT_INDENT + content}</Text>
    {image && <Image source={{ uri: image }} style={styles.threadImage} />}
  </View>
);

const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'm';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};

const Toolbox = ({ likes, comments, reposts }) => (
  <View style={styles.toolbox}>
    <TouchableOpacity style={styles.toolItem}>
      <Ionicons name="heart-outline" size={18} color="#fff" />
      <Text style={styles.toolText}>{formatNumber(likes)}</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.toolItem}>
      <Ionicons name="chatbubble-outline" size={18} color="#fff" />
      <Text style={styles.toolText}>{formatNumber(comments)}</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.toolItem}>
      <Ionicons name="repeat-outline" size={18} color="#fff" />
      <Text style={styles.toolText}>{formatNumber(reposts)}</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.toolItem}>
      <Ionicons name="share-outline" size={18} color="#fff" />
    </TouchableOpacity>
  </View>
);

const Threads = ({ route, navigation }) => {
  const { item } = route.params;

  const [currentPage, setCurrentPage] = useState(0);

  const threads = [
    { content: "This is the first page of our article. It contains the introduction and sets the stage for what's to come. We'll discuss various topics and provide insights into the subject matter. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." },
    { content: "On the second page, we delve deeper into our main points. We explore the nuances and provide examples to illustrate our arguments. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", image: "https://picsum.photos/400/300" },
    { content: "The third and final page wraps up our discussion. We summarize the key points and provide a conclusion that ties everything together. Thank you for reading! Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." },
  ];

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const page = Math.round(offsetX / width);
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    if (currentPage === threads.length) {
      console.log('Reached the end of the article');
      // Uncomment this when you have created the ReadNext screen
      // navigation.navigate('ReadNext');
    }
  }, [currentPage]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <View style={styles.container}>
        <View style={styles.articleHeader}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.username}>{item.username} <Text style={styles.handle}>@{item.handle}</Text></Text>
        </View>
        <View style={styles.threadWrapper}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {threads.map((thread, index) => (
              <Thread
                key={index}
                content={thread.content}
                pageNumber={index + 1}
                totalPages={threads.length}
                image={thread.image}
              />
            ))}
          </ScrollView>
        </View>
        <Toolbox likes={1000} comments={50} reposts={25} />
      </View>
      <NavigationBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  articleHeader: {
    padding: 16,
  },
  title: {
    fontFamily: Platform.OS === 'ios' ? 'Athelas' : 'Roboto',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  username: {
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
    fontSize: 16,
    color: '#fff',
  },
  handle: {
    color: '#687684',
  },
  threadWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  threadContainer: {
    width: width,
    padding: 16,
    justifyContent: 'center',
  },
  pageCounter: {
    position: 'absolute',
    top: 16,
    right: 16,
    color: '#687684',
    fontSize: 14,
  },
  threadContent: {
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
    fontSize: 18,
    color: '#fff',
    lineHeight: 24,
    marginBottom: 16,
  },
  threadImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  toolbox: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    alignItems: 'flex-end',
  },
  toolItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    width: 40, // Set a fixed width for alignment
  },
  toolText: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 10,
  },
});

export default Threads;
