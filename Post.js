import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Popover from 'react-native-popover-view';
import { useNavigation } from '@react-navigation/native';
import { useReposts } from './RepostContext';
import { usePosts } from './PostContext';

const LIGHT_GREY = '#CCCCCC';
const REPOST_PINK = '#FFB6C1';

const RepostMenu = ({ onRepost, onQuote, onClose }) => (
  <View style={styles.repostMenuContainer}>
    <TouchableOpacity style={styles.repostMenuItem} onPress={onRepost}>
      <Ionicons name="repeat" size={16} color="white" />
      <Text style={styles.repostMenuText}>Repost</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.repostMenuItem} onPress={onQuote}>
      <Ionicons name="create-outline" size={16} color="white" />
      <Text style={styles.repostMenuText}>Quote</Text>
    </TouchableOpacity>
  </View>
);

const Post = ({ item, onCommentPress, isQuoteRepost = false }) => {
  const navigation = useNavigation();
  const { reposts, addRepost } = useReposts();
  const { posts, currentUser } = usePosts();
  const [isReposted, setIsReposted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showRepostMenu, setShowRepostMenu] = useState(false);
  const repostButtonRef = useRef();

  const post = posts.find(p => p.id === item.id) || item;
  const commentCount = post.comments ? post.comments.length : 0;

  useEffect(() => {
    setIsReposted(reposts.some(repost => repost.originalPost.id === item.id && repost.userId === currentUser.handle));
  }, [reposts, item.id, currentUser.handle]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    // Here you would typically update the like count on the server
  };

  const handleRepostPress = () => {
    setShowRepostMenu(true);
  };

  const handleRepost = () => {
    addRepost(item, currentUser.handle);
    setShowRepostMenu(false);
    setIsReposted(true);
  };

  const handleQuote = () => {
    navigation.navigate('Quote', { post: item });
    setShowRepostMenu(false);
  };

  const handleCommentPress = () => {
    if (onCommentPress) {
      onCommentPress(item);
    }
  };

  const handlePostPress = () => {
    navigation.navigate('CommentSection', { postId: item.id });
  };

  const renderContent = () => {
    if (item.type === 'quote') {
      return (
        <View>
          <Text style={styles.content}>{item.quoteText}</Text>
          <View style={styles.quotedPostContainer}>
            <Post item={item.originalPost} isQuoteRepost={true} />
          </View>
        </View>
      );
    }
    return <Text style={styles.content}>{item.content}</Text>;
  };

  return (
    <View style={styles.container}>
      {item.type === 'repost' && (
        <Text style={styles.repostIndicator}>
          <Ionicons name="repeat" size={14} color={REPOST_PINK} /> You Reposted
        </Text>
      )}
      <TouchableOpacity onPress={handlePostPress}>
        <View style={styles.postHeader}>
          <Text style={styles.username}>
            {item.username}
            {item.type !== 'comment' && item.handle && (
              <Text style={styles.handle}> @{item.handle}</Text>
            )}
          </Text>
        </View>
        {renderContent()}
        <View style={styles.toolBar}>
          <TouchableOpacity style={styles.toolItem} onPress={handleCommentPress}>
            <Ionicons name="chatbubble-outline" size={18} color="gray" />
            <Text style={styles.toolCount}>{commentCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.toolItem} 
            onPress={handleRepostPress}
            ref={repostButtonRef}
          >
            <Ionicons 
              name="repeat" 
              size={18} 
              color={isReposted ? REPOST_PINK : "gray"} 
            />
            <Text style={[styles.toolCount, isReposted && styles.repostedText]}>
              {item.reposts}
            </Text>
          </TouchableOpacity>
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
      </TouchableOpacity>
      <Popover
        isVisible={showRepostMenu}
        onRequestClose={() => setShowRepostMenu(false)}
        from={repostButtonRef}
        popoverStyle={styles.repostMenuPopover}
      >
        <RepostMenu 
          onRepost={handleRepost}
          onQuote={handleQuote}
          onClose={() => setShowRepostMenu(false)}
        />
      </Popover>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    marginBottom: 4,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    left: 4,
    marginBottom: 2,
  },
  username: {
    fontFamily: 'SFProText-Regular',
    fontSize: 16,
    color: '#fff',
  },
  handle: {
    fontFamily: 'SFProText-Regular',
    fontSize: 16,
    color: '#687684',
  },
  content: {
    fontFamily: 'SFProText',
    fontSize: 16,
    lineHeight: 22,
    color: '#fff',
    marginBottom: 12,
    paddingLeft: 4,
  },
  toolBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 0,
    marginLeft: 4,
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
  repostMenuPopover: {
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 0,
  },
  repostMenuContainer: {
    width: 120,
  },
  repostMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  repostMenuText: {
    color: 'white',
    marginLeft: 12,
    fontSize: 14,
  },
  repostedText: {
    color: REPOST_PINK,
  },
  repostIndicator: {
    color: REPOST_PINK,
    fontSize: 14,
    marginBottom: 8,
    marginLeft: 8,
  },
  quotedPostContainer: {
    marginTop: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#333',
    paddingLeft: 8,
  },
});

export default Post;
