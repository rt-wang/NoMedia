import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, SafeAreaView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { usePosts } from './PostContext';

const { width, height } = Dimensions.get('window');

const CONTENT_INDENT = '    ';

const DEFAULT_CONTENT = [
  "Welcome to this sample thread! This is the first page of default content. As you can see, we've expanded this text to reach approximately 250 characters. This gives you a better idea of how a longer piece of content might look when displayed in the thread view. It's a good way to test layout and scrolling behavior.",
  "Here's the second page of our default content. It's not much, but it's honest work. We've also extended this page to about 250 characters to maintain consistency. This allows you to see how multiple pages of content will appear and how the navigation between pages functions. It's a great way to ensure everything is working as expected.",
  "And finally, the third page of our default content. Thanks for reading! Once again, we've stretched this to around 250 characters. This final page gives you a sense of how the end of a thread might look. It's also useful for testing any 'end of content' behavior you might have implemented, such as navigating to a 'Read Next' screen or showing a completion message.",
];

const Thread = ({ content, pageNumber, totalPages, title, username, likes, comments, reposts, onLike, onRepost, isLiked, isReposted }) => {
  const LIGHT_GREY = '#CCCCCC';
  const REPOST_PINK = '#FFB6C1';

  return (
    <View style={styles.threadContainer}>
      <View style={styles.headerContainer}>
        {pageNumber === 1 ? (
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
          </View>
        ) : null}
        <View style={[styles.authorInfo, pageNumber !== 1 && styles.authorInfoShift]}>
          <Text style={styles.username}>{username}</Text>
        </View>
      </View>
      <Text style={styles.pageCounter}>{`${pageNumber}/${totalPages}`}</Text>
      <ScrollView style={styles.contentScrollView} contentContainerStyle={styles.contentWrapper}>
        <Text style={styles.threadContent}>{CONTENT_INDENT + content}</Text>
      </ScrollView>
      <View style={styles.toolbox}>
        <TouchableOpacity style={styles.toolItem} onPress={onLike}>
          <Ionicons 
            name={isLiked ? "heart" : "heart-outline"} 
            size={30} 
            color={isLiked ? "white" : "gray"} 
          />
          <Text style={[styles.toolText, isLiked && styles.likedText]}>{likes}</Text>
        </TouchableOpacity>
        <View style={[styles.toolItem, styles.commentsButton]}>
          <Ionicons name="chatbubble-outline" size={30} color="gray" />
          <Text style={styles.toolText}>{comments}</Text>
        </View>
        <TouchableOpacity style={[styles.toolItem, styles.repostButton]} onPress={onRepost}>
          <Ionicons 
            name="repeat" 
            size={30} 
            color={isReposted ? REPOST_PINK : "gray"} 
          />
          <Text style={[styles.toolText, isReposted && styles.repostedText]}>{reposts}</Text>
        </TouchableOpacity>
        <View style={[styles.toolItem, styles.moreButton]}>
          <Ionicons name="ellipsis-horizontal" size={24} color="gray" />
        </View>
      </View>
    </View>
  );
};

const Threads = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { item = {} } = route.params || {};
  const flatListRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const { posts, toggleLike, toggleRepost } = usePosts();

  // Create 5 identical pages based on the first thread or default content
  const firstThread = item.threads && item.threads.length > 0 ? item.threads[0] : { 
    content: DEFAULT_CONTENT[0], 
    pageNumber: 1,
    likes: item.likes || 0,
    comments: item.comments?.length || 0,  // Use the length of comments array if available
    reposts: item.reposts || 0,
  };

  const [threads, setThreads] = useState(
    Array(5).fill(firstThread).map((thread, index) => ({
      ...thread,
      pageNumber: index + 1,
      likes: item.likes || 0,
      comments: item.comments?.length || 0,  // Use the length of comments array if available
      reposts: item.reposts || 0,
    }))
  );

  const handleViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentPage(viewableItems[0].index);
    }
  };

  const handleMomentumScrollEnd = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const page = Math.round(offsetY / height);
    if (page >= threads.length) {
      navigation.navigate('ReadNext', { article: item });
    }
  };

  const handleLike = () => {
    toggleLike(item.id);
    setThreads((prevThreads) =>
      prevThreads.map((thread) => ({
        ...thread,
        likes: posts.find(p => p.id === item.id).likes,
      }))
    );
  };

  const handleRepost = () => {
    toggleRepost(item.id);
    setThreads((prevThreads) =>
      prevThreads.map((thread) => ({
        ...thread,
        reposts: posts.find(p => p.id === item.id).reposts,
      }))
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={threads}
        renderItem={({ item, index }) => (
          <Thread
            content={item.content || ''}
            pageNumber={index + 1}
            totalPages={threads.length}
            title={item.title || 'Sample Thread'}
            username={item.username || 'John Doe'}
            likes={item.likes}
            comments={item.comments}
            reposts={item.reposts}
            onLike={handleLike}
            onRepost={handleRepost}
            isLiked={posts.find(p => p.id === item.id)?.isLiked}
            isReposted={posts.find(p => p.id === item.id)?.isReposted}
          />
        )}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50
        }}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        keyExtractor={(item, index) => index.toString()}
        getItemLayout={(data, index) => ({
          length: height,
          offset: height * index,
          index,
        })}
        snapToInterval={height}
        snapToAlignment="start"
        decelerationRate="fast"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  threadContainer: {
    height: height,
    width: width,
    justifyContent: 'space-between',
    paddingTop: 10, // Adjust this value if needed
  },
  headerContainer: {
    paddingHorizontal: 16,
  },
  titleContainer: {
    paddingBottom: 8,
  },
  title: {
    fontFamily: Platform.OS === 'ios' ? 'Athelas' : 'Roboto',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorInfoShift: {
    paddingTop: 8, // Adjust this value to match the title's padding
  },
  username: {
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  pageCounter: {
    position: 'absolute',
    top: 17, // Adjust this value if needed
    right: 16,
    color: '#687684',
    fontSize: 14,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  threadContent: {
    fontFamily: Platform.OS === 'ios' ? 'Athelas' : 'Roboto',
    fontSize: 17,
    color: '#fff',
    lineHeight: 20,
    marginBottom: 16,
    bottom: 100,
  },
  toolbox: {
    position: 'absolute',
    bottom: 130,
    right: 16,
    alignItems: 'flex-end',
  },
  toolItem: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 12,
  },
  toolText: {
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
    color: '#fff',
    marginLeft: 4,
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },
  moreButton: {
    marginRight: 1,
  },
  commentsButton: {
    marginRight: -1.5,
  },
  likedText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  repostedText: {
    color: '#FFB6C1',
    fontWeight: 'bold',
  },
  repostButton: {
    marginRight: -1,
  },
});

export default Threads;