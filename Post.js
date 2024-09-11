import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Popover from 'react-native-popover-view';

const LIGHT_GREY = '#CCCCCC';

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

const Post = ({ item, navigation, onCommentPress }) => {
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
    <View style={styles.container}>
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
      <Text style={styles.content}>
        {item.content}
      </Text>
      <View style={styles.toolBar}>
        <TouchableOpacity style={styles.toolItem} onPress={() => onCommentPress(item)}>
          <Ionicons name="chatbubble-outline" size={18} color="gray" />
          <Text style={styles.toolCount}>{item.comments}</Text>
        </TouchableOpacity>
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
});

export default Post;
