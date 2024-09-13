import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Animated, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Post from './Post';

const { width, height } = Dimensions.get('window');

const ReadNextBox = React.memo(({ item, onPress }) => (
  <View style={styles.readNextBoxWrapper}>
    <View style={styles.readNextBoxShadow} />
    <TouchableOpacity style={styles.readNextBox} onPress={onPress}>
      <View style={styles.readNextContent}>
        <Text style={styles.readNextTitle} numberOfLines={2} ellipsizeMode="tail">{item.title}</Text>
        <Text style={styles.readNextUsername} numberOfLines={1} ellipsizeMode="tail">{item.username} <Text style={styles.readNextHandle}>@{item.handle}</Text></Text>
      </View>
    </TouchableOpacity>
  </View>
));

const Comment = React.memo(({ comment }) => (
  <View style={styles.commentContainer}>
    <View style={styles.commentLine} />
    <View style={styles.commentContent}>
      <Post item={comment} />
    </View>
  </View>
));

const ReadNext = ({ route, navigation }) => {
  const { article } = route.params || {};
  const [readNextItems, setReadNextItems] = useState([]);
  const [comments, setComments] = useState([]);
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);

  useEffect(() => {
    // Ensure article exists and has necessary properties
    if (article && article.title) {
      // Populate readNextItems (replace with actual API calls later)
      setReadNextItems(Array(4).fill().map((_, index) => ({
        id: `article-${index}`,
        title: `Sample Article ${index + 1}`,
        username: `User${index + 1}`,
        handle: `handle${index + 1}`,
        content: ["This is the first page of article " + (index + 1), "This is the second page", "This is the third page"],
      })));

      // Populate comments (replace with actual API calls later)
      setComments(Array(10).fill().map((_, index) => ({
        id: `comment-${index}`,
        type: 'post',
        username: `Commenter${index + 1}`,
        handle: `commenter${index + 1}`,
        content: `This is a sample comment ${index + 1}. It demonstrates how comments are displayed in the ReadNext page.`,
        comments: Math.floor(Math.random() * 50),
        reposts: Math.floor(Math.random() * 50),
        likes: Math.floor(Math.random() * 500),
      })));
    }
  }, [article]);

  const headerHeight = 60;
  const stickyHeaderY = 240; // Adjusted to a fixed value

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const navigateToThread = useCallback((readNextItem) => {
    navigation.navigate('Threads', { 
      item: {
        ...readNextItem,
        threads: readNextItem.content.map((content, index) => ({ 
          content, 
          pageNumber: index + 1,
          image: readNextItem.image // if available
        })),
        likes: readNextItem.likes,
        comments: readNextItem.comments,
        reposts: readNextItem.reposts
      }
    });
  }, [navigation]);

  const getItemLayout = useCallback((data, index) => ({
    length: 150, // Approximate height of each item
    offset: 150 * index,
    index,
  }), []);

  const renderItem = useCallback(({ item }) => {
    if (item.type === 'readNext') {
      return (
        <ReadNextBox
          item={item}
          onPress={() => navigateToThread(item)}
        />
      );
    } else if (item.type === 'comment') {
      return <Comment comment={item} />;
    }
  }, [navigateToThread]);

  const keyExtractor = useCallback((item) => {
    return item.id.toString();
  }, []);

  if (!article || !article.title) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Article not found</Text>
      </View>
    );
  }

  const listData = [
    { type: 'stickyHeader', id: 'stickyHeader' },
    ...comments.map(item => ({ ...item, type: 'comment', id: `comment-${item.id}` })),
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.goBackButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={scrollToTop}>
          <Text style={styles.readNextHeader}>Read Next...</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={listData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={21}
        removeClippedSubviews={true}
        ListHeaderComponent={() => (
          <View style={styles.readNextSection}>
            <View style={styles.readNextBoxesContainer}>
              {readNextItems.map((readNextItem) => (
                <ReadNextBox
                  key={`header-${readNextItem.id}`}
                  item={readNextItem}
                  onPress={() => navigateToThread(readNextItem)}
                />
              ))}
            </View>
          </View>
        )}
        stickyHeaderIndices={[readNextItems.length + 1]}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  goBackButton: {
    marginRight: 16,
  },
  readNextHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: Platform.OS === 'ios' ? 'Athelas' : 'Roboto',
  },
  readNextSection: {
    height: 240, // Fixed height to accommodate all boxes
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  readNextBoxesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  readNextBoxWrapper: {
    width: (width - 48) / 2, // Adjusted width
    height: 100, // Fixed height
    marginBottom: 16,
    position: 'relative',
  },
  readNextBoxShadow: {
    position: 'absolute',
    top: 3, // Adjust for desired shadow offset
    left: 3, // Adjust for desired shadow offset
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Slightly off-white, adjust alpha for intensity
    borderRadius: 8,
  },
  readNextBox: {
    width: '100%',
    height: '100%',
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  readNextContent: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  readNextTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Athelas' : 'Roboto',
    marginBottom: 4,
  },
  readNextUsername: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  readNextHandle: {
    color: '#687684',
  },
  stickyHeader: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  stickyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  stickyUsername: {
    fontSize: 16,
    color: '#fff',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  stickyHandle: {
    color: '#687684',
  },
  commentsSection: {
    paddingHorizontal: 0,
  },
  commentContainer: {
    flexDirection: 'row',
    marginBottom: 5,
    paddingHorizontal: 20,
  },
  commentLine: {
    width: 2,
    backgroundColor: '#333',
    marginRight: 6,
    marginTop: 12,
    height: '83%',
  },
  commentContent: {
    flex: 1,
    marginLeft: 0, // This creates the indentation
  },
  errorText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
});

export default ReadNext;
