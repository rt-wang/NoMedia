import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Popover from 'react-native-popover-view';
import { useNavigation } from '@react-navigation/native'; // Add this import

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

const ArticlePreview = ({ item, navigation, onCommentPress }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleDislike = () => {
    Alert.alert('Disliked', 'You have disliked this article');
    setShowOptions(false);
  };

  const handleReport = () => {
    Alert.alert('Reported', 'You have reported this article');
    setShowOptions(false);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    // Here you would typically update the like count on the server
  };

  const handleMorePress = () => {
    navigation.navigate('Threads', { item });
  };

  const indentedContent = '  ' + item.content;
  const truncatedContent = indentedContent.length > 150 
    ? indentedContent.slice(0, 147) + '...' 
    : indentedContent;

  return (
    <TouchableOpacity onPress={() => navigation.navigate('ReadNext', { article: item })}>
      <View style={styles.container}>
        <View style={styles.postHeader}>
          <Text style={styles.title}>{item.title}</Text>
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
        <Text style={styles.username}>{item.username} <Text style={styles.handle}>@{item.handle}</Text></Text>
        <View style={styles.previewBoxContainer}>
          <View style={styles.previewBoxShadow} />
          <View style={styles.previewBox}>
            <Text style={styles.previewContent}>
              {truncatedContent}
              {item.content.length > 150 && (
                <Text style={styles.moreButton} onPress={handleMorePress}> more</Text>
              )}
            </Text>
          </View>
        </View>
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
    </TouchableOpacity>
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
  title: {
    fontFamily: 'Athelas',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    marginRight: 8,
    marginBottom: 2,
  },
  username: {
    fontFamily: 'SFProText-Regular',
    fontSize: 16,
    color: '#fff',
    marginBottom: 4,
  },
  handle: {
    fontFamily: 'SFProText-Regular',
    fontSize: 16,
    color: '#687684',
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
    color: '#000000', // Explicitly set to black
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

export default ArticlePreview;
