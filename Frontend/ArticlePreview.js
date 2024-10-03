import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Alert, Dimensions, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Popover from 'react-native-popover-view';
import { useNavigation } from '@react-navigation/native';
import { usePosts } from './PostContext';

const LIGHT_GREY = '#CCCCCC';
const REPOST_PINK = '#FFB6C1';
const USERNAME_COLOR = '#FFE4E8';

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

const OptionsMenu = ({ onClose, onNotInterested, onReport }) => (
  <View style={styles.optionsMenuContainer}>
    <TouchableOpacity style={styles.optionItem} onPress={onNotInterested}>
      <Ionicons name="eye-off-outline" size={16} color="white" />
      <Text style={styles.optionText}>Not interested</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.optionItem} onPress={onReport}>
      <Ionicons name="flag-outline" size={16} color="white" />
      <Text style={styles.optionText}>Report</Text>
    </TouchableOpacity>
  </View>
);

const ArticlePreview = ({ item, onCommentPress, onArticlePress, isReposted, commentCount }) => {
  const navigation = useNavigation();
  const { posts, currentUser, toggleLike, toggleRepost } = usePosts();
  const [showRepostMenu, setShowRepostMenu] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [isNotInterested, setIsNotInterested] = useState(false);
  const repostButtonRef = useRef();
  const optionsButtonRef = useRef();

  const post = posts.find(p => p.id === item.id) || item;
  const isLiked = post.likedBy?.includes(currentUser.handle);

  const handleLike = () => {
    toggleLike(item.id);
  };

  const handleRepostPress = () => {
    setShowRepostMenu(true);
  };

  const handleRepost = () => {
    toggleRepost(item.id);
    setShowRepostMenu(false);
  };

  const handleQuote = () => {
    navigation.navigate('Quote', { post: item });
    setShowRepostMenu(false);
  };

  const handleOptionsPress = () => {
    setShowOptionsMenu(true);
  };

  const handleNotInterested = () => {
    setShowOptionsMenu(false);
    setIsNotInterested(true);
    // You might want to add logic here to inform your backend about this preference
  };

  const handleReport = () => {
    setShowOptionsMenu(false);
    Alert.alert('Report', 'Thank you for your report. We will review this article.');
  };

  const indentedContent = '  ' + post.content;
  const truncatedContent = indentedContent.length > 150 
    ? indentedContent.slice(0, 147) + '...' 
    : indentedContent;

  const handleMorePress = () => {
    onArticlePress(post);
  };

  const handleNamePress = () => {
    navigation.navigate('UserAccountPage', { username: item.username });
  };

  if (isNotInterested) {
    return (
      <View style={[styles.container, styles.notInterestedContainer]}>
        <View style={styles.notInterestedContent}>
          <Text style={styles.notInterestedTitle}>Not Interested</Text>
          <Text style={styles.notInterestedText}>
            Content like this will be shown less frequently in your feed.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.container} onPress={onArticlePress}>
      {isReposted && (
        <Text style={styles.repostIndicator}>
          <Ionicons name="repeat" size={14} color={REPOST_PINK} /> Reposted
        </Text>
      )}
      <View style={styles.postHeader}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
            {post.title}
          </Text>
          <View style={styles.userInfo}>
            <View style={styles.nameAndPageContainer}>
              <TouchableOpacity onPress={handleNamePress}>
                <View style={styles.nameContainer}>
                  <Text style={styles.name}>{post.name}</Text>
                  <Text style={styles.username}> @{post.username}</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.pageCounterContainer}>
                <Text style={styles.pageCounter}>{post.pageCount || 31} page{post.pageCount !== 1 ? 's' : ''}</Text>
              </View>
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={handleOptionsPress} ref={optionsButtonRef} style={styles.optionsButton}>
          <Ionicons name="ellipsis-horizontal" size={18} color="gray" />
        </TouchableOpacity>
      </View>
      <View style={styles.previewBoxContainer}>
        <View style={styles.previewBoxShadow} />
        <View style={styles.previewBox}>
          <Text style={styles.previewContent}>
            {truncatedContent}
            {post.content.length > 150 && (
              <Text style={styles.moreButton} onPress={handleMorePress}> more</Text>
            )}
          </Text>
        </View>
      </View>
      <View style={styles.toolBar}>
        <TouchableOpacity style={styles.toolItem} onPress={onCommentPress}>
          <Ionicons name="chatbubble-outline" size={18} color="gray" />
          <Text style={styles.toolCount}>{commentCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolItem} onPress={handleRepostPress}>
          <Ionicons name="repeat" size={18} color={isReposted ? REPOST_PINK : "gray"} />
          <Text style={[styles.toolCount, isReposted && styles.repostedText]}>{item.reposts}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolItem} onPress={handleLike}>
          <Ionicons name={isLiked ? "heart" : "heart-outline"} size={18} color={isLiked ? "red" : "gray"} />
          <Text style={styles.toolCount}>{item.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolItem}>
          <Ionicons name="share-outline" size={18} color="gray" />
        </TouchableOpacity>
      </View>
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
      <Popover
        isVisible={showOptionsMenu}
        onRequestClose={() => setShowOptionsMenu(false)}
        from={optionsButtonRef}
        popoverStyle={styles.optionsMenuPopover}
        placement="bottom" // Add this line
        arrowSize={{ width: 0, height: 0 }} // Optional: removes the arrow
      >
        <OptionsMenu 
          onNotInterested={handleNotInterested}
          onReport={handleReport}
          onClose={() => setShowOptionsMenu(false)}
        />
      </Popover>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
  },
  articleContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontFamily: 'Athelas',
    fontSize: 22,
    color: '#fff',
    lineHeight: 26, // Add this to ensure proper spacing between lines
  },
  userInfo: {
    marginTop: 4,
  },
  nameAndPageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // This will allow the name container to take up available space
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  username: {
    fontSize: 14,
    color: USERNAME_COLOR,
  },
  pageCounterContainer: {
    marginLeft: 'auto', // This pushes the container to the right
    paddingLeft: 12, // This adds some space between the username and page count
  },
  pageCounter: {
    fontFamily: 'SFProText-Regular',
    fontSize: 14,
    color: '#687684',
    textAlign: 'right', // This ensures the text itself is right-aligned
  },
  optionsButton: {
    padding: 5,
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
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 12,
  },
  previewBox: {
    backgroundColor: '#333',
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
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  toolBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
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
  optionsMenuPopover: {
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 0,
  },
  optionsMenuContainer: {
    width: 180,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  optionText: {
    color: 'white',
    marginLeft: 12,
    fontSize: 14,
  },
  notInterestedContainer: {
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    borderRadius: 12,
    borderWidth: 0,
    overflow: 'hidden',
    height: 200, // Maintain the same height as the original ArticlePreview
    marginTop: 16,
    marginBottom: 16, // Match the marginBottom of the original article preview container
  },
  notInterestedContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  notInterestedTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 8,
    fontFamily: 'SFProText-Regular',
  },
  notInterestedText: {
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    fontFamily: 'SFProText-Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  shareButton: {
    marginTop: -3.5, // This will move the share button up by 3 pixels
  },
  repostIndicator: {
    color: REPOST_PINK,
    fontSize: 14,
    marginBottom: 8,
    marginLeft: 8,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
});

export default ArticlePreview;