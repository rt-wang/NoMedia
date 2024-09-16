import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Popover from 'react-native-popover-view';
import { useNavigation } from '@react-navigation/native';
import { useReposts } from './RepostContext';
import { usePosts } from './PostContext';

const LIGHT_GREY = '#CCCCCC';
const REPOST_PINK = '#FFB6C1';

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
  const { posts } = usePosts();
  const [isReposted, setIsReposted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showRepostMenu, setShowRepostMenu] = useState(false);
  const repostButtonRef = useRef();

  const post = posts.find(p => p.id === item.id) || item;
  const commentCount = post.comments ? post.comments.length : 0;

  useEffect(() => {
    setIsReposted(reposts.some(repost => repost.originalPost.id === item.id));
  }, [reposts, item.id]);

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

  const handleRepostPress = () => {
    setShowRepostMenu(true);
  };

  const handleRepost = () => {
    addRepost(item);
    setShowRepostMenu(false);
    setIsReposted(true);
  };

  const handleQuote = () => {
    navigation.navigate('Quote', { post: item });
    setShowRepostMenu(false);
    setIsReposted(true);
  };

  const handleCommentPress = () => {
    if (onCommentPress) {
      onCommentPress(item);
    }
  };

  const handlePostPress = () => {
    navigation.navigate('CommentSection', { postId: item.id });
  };

  return (
    <View style={styles.container}>
      {item.isRepost && (
        <Text style={styles.repostIndicator}>
          <Ionicons name="repeat" size={14} color={REPOST_PINK} /> You Reposted
        </Text>
      )}
      <TouchableOpacity onPress={handlePostPress}>
        <View style={styles.postHeader}>
          <Text style={styles.username}>{item.username} <Text style={styles.handle}>@{item.handle}</Text></Text>
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
        <Text style={styles.content}>{item.content}</Text>
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
              color={isLiked ? "red" : "gray"} 
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
    paddingHorizontal: 4,
    marginBottom: 4,
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
    marginRight: -8,
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
  repostMenuPopover: {
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 0,
  },
  repostMenuContainer: {
    width: 120, // Reduced width
  },
  repostMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12, // Reduced padding
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  repostMenuText: {
    color: 'white',
    marginLeft: 12,
    fontSize: 14, // Reduced font size
  },
  repostedText: {
    color: REPOST_PINK,
  },
  cancelButton: {
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
  },
  repostIndicator: {
    color: REPOST_PINK,
    fontSize: 14,
    marginBottom: 8,
  },
});

export default Post;
