import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Popover from 'react-native-popover-view';
import { useNavigation } from '@react-navigation/native';
import { useReposts } from './RepostContext';
import { usePosts } from './PostContext';

const LIGHT_GREY = '#CCCCCC';
const REPOST_PINK = '#FFB6C1';
const USERNAME_COLOR = '#FFE4E8'; // This is a very light pink

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

const OptionsMenu = ({ onClose, onDelete, onReport, isOwnPost }) => (
  <View style={styles.optionsMenuContainer}>
    {isOwnPost ? (
      <TouchableOpacity style={styles.optionItem} onPress={onDelete}>
        <Ionicons name="trash-outline" size={16} color="white" />
        <Text style={styles.optionText}>Delete</Text>
      </TouchableOpacity>
    ) : (
      <>
        <TouchableOpacity style={styles.optionItem} onPress={onNotInterested}>
          <Ionicons name="eye-off-outline" size={16} color="white" />
          <Text style={styles.optionText}>Not interested</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionItem} onPress={onReport}>
          <Ionicons name="flag-outline" size={16} color="white" />
          <Text style={styles.optionText}>Report</Text>
        </TouchableOpacity>
      </>
    )}
  </View>
);

const Post = ({ item, onCommentPress, isQuoteRepost = false, commentCount, isOwnPost = false, matchScore }) => {
  console.log('Post item:', item); // Add this line for debugging
  const navigation = useNavigation();
  const { reposts, addRepost } = useReposts();
  const { posts, currentUser, toggleLike, toggleRepost } = usePosts();
  const [showRepostMenu, setShowRepostMenu] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [isNotInterested, setIsNotInterested] = useState(false);
  const repostButtonRef = useRef();
  const optionsButtonRef = useRef();

  const post = posts.find(p => p.id === item.id) || item;
  const isLiked = post.likedBy?.includes(currentUser.username);
  const isReposted = post.repostedBy?.includes(currentUser.username);

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
    const postToQuote = item.type === 'repost' ? item.originalPost : item;
    navigation.navigate('Quote', { 
      post: postToQuote
    });
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

  const handleReply = () => {
    // Handle reply functionality
    console.log('Reply to comment:', item.id);
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
    // Implement report logic
    setShowOptionsMenu(false);
    Alert.alert('Report', 'Thank you for your report. We will review this post.');
  };

  const handleNamePress = () => {
    navigation.navigate('UserAccountPage', { username: item.username });
  };

  const handleDelete = () => {
    // Implement delete functionality later
    console.log('Delete post:', item.id);
    setShowOptionsMenu(false);
  };

  const renderRepostIndicator = () => (
    <Text style={styles.repostIndicator}>
      <Ionicons name="repeat" size={14} color={REPOST_PINK} /> {item.name}
    </Text>
  );

  const renderContent = (content) => {
    if (!content) return null;
    
    // Split the content by the bold markers
    const parts = content.split(/(\*\*.*?\*\*)/g);
    
    return (
      <Text style={styles.content}>
        {parts.map((part, index) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            // Remove the ** markers and render the text in bold
            const boldText = part.slice(2, -2);
            return <Text key={index} style={[styles.content, styles.boldText]}>{boldText}</Text>;
          }
          return <Text key={index}>{part}</Text>;
        })}
      </Text>
    );
  };

  const renderPostContent = (postItem) => (
    <>
      {postItem.type === 'repost' && !isQuoteRepost && (
        <Text style={styles.repostIndicator}>
          <Ionicons name="repeat" size={14} color={REPOST_PINK} /> {postItem.name}
        </Text>
      )}
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          <TouchableOpacity onPress={() => handleNamePress(postItem.type === 'repost' && !isQuoteRepost ? postItem.originalPost.username : postItem.username)}>
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{postItem.type === 'repost' && !isQuoteRepost ? postItem.originalPost.name : postItem.name || 'Unknown'}</Text>
              <Text style={styles.username}> @{postItem.type === 'repost' && !isQuoteRepost ? postItem.originalPost.username : postItem.username || 'unknown'}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleOptionsPress} ref={optionsButtonRef} style={styles.optionsButton}>
          <Ionicons name="ellipsis-horizontal" size={18} color="gray" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => handlePostPress(postItem.id)}>
        {renderContent(postItem.type === 'repost' && !isQuoteRepost
          ? postItem.originalPost.content
          : postItem.content
        )}
      </TouchableOpacity>
      {isQuoteRepost && (
        <View style={styles.quoteContainer}>
          <View style={styles.originalPostHeader}>
            <Text style={styles.originalPostName}>{postItem.originalPost?.name || 'Unknown'}</Text>
            <Text style={styles.originalPostUsername}>@{postItem.originalPost?.username || 'unknown'}</Text>
          </View>
          <Text style={styles.originalPostContent}>{postItem.originalPost?.content || 'No content'}</Text>
        </View>
      )}
      {renderToolbar(postItem)}
    </>
  );

  const renderToolbar = (postItem) => (
    <View style={styles.toolBar}>
      <View style={styles.toolBarLeft}>
        <TouchableOpacity style={styles.toolItem} onPress={() => handleCommentPress(postItem)}>
          <Ionicons name="chatbubble-outline" size={18} color="gray" />
          <Text style={styles.toolCount}>
            {postItem.type === 'repost' && !isQuoteRepost ? postItem.originalPost.comments : postItem.comments}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolItem} onPress={handleRepostPress} ref={repostButtonRef}>
          <Ionicons name="repeat" size={18} color={isReposted ? REPOST_PINK : "gray"} />
          <Text style={[styles.toolCount, isReposted && styles.repostedText]}>
            {postItem.type === 'repost' && !isQuoteRepost ? postItem.originalPost.reposts : postItem.reposts}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolItem} onPress={() => handleLike(postItem.id)}>
          <Ionicons name={isLiked ? "heart" : "heart-outline"} size={18} color={isLiked ? "white" : "gray"} />
          <Text style={styles.toolCount}>
            {postItem.type === 'repost' && !isQuoteRepost ? postItem.originalPost.likes : postItem.likes}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.toolItem, styles.shareButton]}>
          <Ionicons name="share-outline" size={18} color="gray" />
        </TouchableOpacity>
      </View>
      {matchScore ? (
        <View style={styles.matchScoreContainer}>
          <Ionicons name="pulse" size={14} color="#FFB6C1" />
          <Text style={styles.matchScoreText}>{matchScore}</Text>
        </View>
      ) : (postItem.type === 'repost' && !isQuoteRepost ? postItem.originalPost.topic_id : postItem.topic_id) && (
        <View style={styles.nomContainer}>
          <Text style={styles.nomText}>/{postItem.type === 'repost' && !isQuoteRepost ? postItem.originalPost.topic_id : postItem.topic_id}</Text>
        </View>
      )}
    </View>
  );

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
    <View style={styles.container}>
      {renderPostContent(item)}
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
      >
        <OptionsMenu
          onClose={() => setShowOptionsMenu(false)}
          onDelete={handleDelete}
          onReport={handleReport}
          isOwnPost={isOwnPost}
        />
      </Popover>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  content: {
    fontSize: 16,
    lineHeight: 22,
    color: '#fff',
    marginBottom: 8,
  },
  toolBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    justifyContent: 'space-between', // This will push the Nom to the right
  },
  toolBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginBottom: 4,
    marginLeft: -12,
  },
  commentToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: -8,
  },
  commentText: {
    flex: 1,
    flexWrap: 'wrap',
    marginRight: -4,
    marginBottom: 18,
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
  optionsButton: {
    padding: 5,
  },
  notInterestedContainer: {
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    borderRadius: 12,
    borderWidth: 0,
    overflow: 'hidden',
    height: 120,
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  notInterestedContent: {
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
    marginTop: -3, // This will move the share button up by 3 pixels
  },
  nomContainer: {
    backgroundColor: 'rgba(104, 118, 132, 0.2)', // Increased opacity from 0.1 to 0.2
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  nomText: {
    color: '#8899A6', // Slightly lighter color for better contrast
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'SFProText-Regular',
  },
  quoteContainer: {
    borderWidth: 1,
    borderColor: '#333', // A dark gray color for the border
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    marginBottom: 12,
  },
  originalPostHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  originalPostName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    marginRight: 4,
  },
  originalPostUsername: {
    color: '#8899A6',
    fontSize: 15,
  },
  originalPostContent: {
    color: '#fff',
    fontSize: 15,
    lineHeight: 20,
  },
  matchScoreContainer: {
    backgroundColor: 'rgba(104, 118, 132, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  matchScoreText: {
    color: '#FFB6C1',
    fontSize: 12,
    marginLeft: 4,
    fontFamily: 'SFProText-Regular',
  },
  boldText: {
    fontWeight: 'bold',
    color: USERNAME_COLOR,
  },
});

export default Post;
