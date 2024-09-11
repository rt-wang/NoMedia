import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, FlatList, Dimensions, SafeAreaView, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const CONTENT_INDENT = '    ';
const IMAGE_ASPECT_RATIO = 4 / 3;
const IMAGE_WIDTH = width * 0.8;
const IMAGE_HEIGHT = Math.min(IMAGE_WIDTH / IMAGE_ASPECT_RATIO, height - 400);

const EXAMPLE_IMAGE = 'https://source.unsplash.com/800x600/?nature';

const DEFAULT_CONTENT = [
  "Welcome to this sample thread! This is the first page of default content. As you can see, we've expanded this text to reach approximately 250 characters. This gives you a better idea of how a longer piece of content might look when displayed in the thread view. It's a good way to test layout and scrolling behavior.",
  "Here's the second page of our default content. It's not much, but it's honest work. We've also extended this page to about 250 characters to maintain consistency. This allows you to see how multiple pages of content will appear and how the navigation between pages functions. It's a great way to ensure everything is working as expected.",
  "And finally, the third page of our default content. Thanks for reading! Once again, we've stretched this to around 250 characters. This final page gives you a sense of how the end of a thread might look. It's also useful for testing any 'end of content' behavior you might have implemented, such as navigating to a 'Read Next' screen or showing a completion message.",
];

const Thread = ({ content, pageNumber, totalPages, image }) => {
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);

  return (
    <View style={styles.threadContainer}>
      <Text style={styles.pageCounter}>{`${pageNumber}/${totalPages}`}</Text>
      <View style={styles.contentWrapper}>
        <Text style={styles.threadContent}>{CONTENT_INDENT + content}</Text>
        {image && (
          <>
            <ActivityIndicator style={styles.loader} animating={loading} />
            <Image 
              source={{ uri: image }} 
              style={[styles.threadImage, { display: loading ? 'none' : 'flex' }]}
              resizeMode="cover"
              onLoadStart={() => setLoading(true)}
              onLoadEnd={() => setLoading(false)}
              onError={() => {
                setImageError(true);
                setLoading(false);
              }}
            />
            {imageError && <Text style={styles.errorText}>Failed to load image</Text>}
          </>
        )}
      </View>
    </View>
  );
};

const Toolbox = ({ likes, comments, reposts }) => (
  <View style={styles.toolbox}>
    <View style={styles.toolItem}>
      <Ionicons name="heart-outline" size={18} color="#fff" />
      <Text style={styles.toolText}>{likes}</Text>
    </View>
    <View style={styles.toolItem}>
      <Ionicons name="chatbubble-outline" size={18} color="#fff" />
      <Text style={styles.toolText}>{comments}</Text>
    </View>
    <View style={styles.toolItem}>
      <Ionicons name="repeat-outline" size={18} color="#fff" />
      <Text style={styles.toolText}>{reposts}</Text>
    </View>
    <View style={styles.toolItem}>
      <Ionicons name="share-outline" size={18} color="#fff" />
    </View>
  </View>
);

const Threads = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { item = {} } = route.params || {};
  const flatListRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);

  const threads = item.threads && item.threads.length > 0
    ? item.threads
    : DEFAULT_CONTENT.map((content, index) => ({ 
        content, 
        pageNumber: index + 1,
        image: index === 1 ? EXAMPLE_IMAGE : null
      }));

  const handleViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentPage(viewableItems[0].index);
    }
  };

  const handleMomentumScrollEnd = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const page = Math.round(offsetX / width);
    if (page >= threads.length) {
      navigation.navigate('ReadNext', { item });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{item.title || 'Sample Thread'}</Text>
      </View>
      <View style={styles.authorInfo}>
        <Text style={styles.username}>{item.username || 'John Doe'}</Text>
        <Text style={styles.handle}> @{item.handle || 'johndoe'}</Text>
      </View>
      <FlatList
        ref={flatListRef}
        data={[...threads, { isLastItem: true }]}
        renderItem={({ item, index }) => 
          item.isLastItem ? 
            <View style={{ width }} /> : 
            <Thread
              content={item.content || ''}
              pageNumber={index + 1}
              totalPages={threads.length}
              image={item.image}
            />
        }
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        keyExtractor={(item, index) => index.toString()}
      />
      <Toolbox 
        likes={item.likes || 0}
        comments={item.comments || 0}
        reposts={item.reposts || 0}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  titleContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
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
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  username: {
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  handle: {
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
    fontSize: 16,
    color: '#687684',
  },
  threadContainer: {
    width: width,
    padding: 16,
    justifyContent: 'center',
    alignContent: 'center',
  },
  pageCounter: {
    position: 'absolute',
    top: 16,
    right: 16,
    color: '#687684',
    fontSize: 14,
  },
  contentWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  threadContent: {
    fontFamily: Platform.OS === 'ios' ? 'Athelas' : 'Roboto',
    fontSize: 17,
    color: '#fff',
    lineHeight: 20,
    marginBottom: 16,
  },
  threadImage: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    maxWidth: width-150,
    borderRadius: 8,
    alignSelf: 'center',
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -20,
    marginTop: -20,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
  toolbox: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    alignItems: 'flex-start',
  },
  toolItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  toolText: {
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
    color: '#fff',
    marginLeft: 4,
    fontSize: 14,
  },
});

export default Threads;
