import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const NotificationType = {
  NEW_FOLLOWER: 'NEW_FOLLOWER',
  LIKE_POST: 'LIKE_POST',
  LIKE_COMMENT: 'LIKE_COMMENT',
  MULTIPLE_LIKES: 'MULTIPLE_LIKES',
  COMMENT: 'COMMENT',
  RETWEET: 'RETWEET',
};

const NotificationItem = ({ item }) => {
  const renderIcon = () => {
    switch (item.type) {
      case NotificationType.NEW_FOLLOWER:
        return <Ionicons name="person-add" size={24} color="#1DA1F2" />;
      case NotificationType.LIKE_POST:
      case NotificationType.LIKE_COMMENT:
      case NotificationType.MULTIPLE_LIKES:
        return <Ionicons name="heart" size={24} color="#E0245E" />;
      case NotificationType.COMMENT:
        return <Ionicons name="chatbubble" size={24} color="#1DA1F2" />;
      case NotificationType.RETWEET:
        return <Ionicons name="repeat" size={24} color="#17BF63" />;
      default:
        return null;
    }
  };

  const renderContent = () => {
    switch (item.type) {
      case NotificationType.NEW_FOLLOWER:
        return (
          <Text style={styles.notificationText}>
            <Text style={styles.username}>{item.username}</Text> followed you
          </Text>
        );
      case NotificationType.LIKE_POST:
        return (
          <Text style={styles.notificationText}>
            <Text style={styles.username}>{item.username}</Text> liked your post
          </Text>
        );
      case NotificationType.LIKE_COMMENT:
        return (
          <Text style={styles.notificationText}>
            <Text style={styles.username}>{item.username}</Text> liked your comment
          </Text>
        );
      case NotificationType.MULTIPLE_LIKES:
        return (
          <Text style={styles.notificationText}>
            <Text style={styles.username}>{item.username}</Text> and {item.otherCount} others liked your post
          </Text>
        );
      case NotificationType.COMMENT:
        return (
          <Text style={styles.notificationText}>
            <Text style={styles.username}>{item.username}</Text> commented on your post
          </Text>
        );
      case NotificationType.RETWEET:
        return (
          <Text style={styles.notificationText}>
            <Text style={styles.username}>{item.username}</Text> retweeted your post
          </Text>
        );
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity style={styles.notificationItem}>
      <View style={styles.iconContainer}>{renderIcon()}</View>
      <View style={styles.contentContainer}>
        {renderContent()}
        {item.content && <Text style={styles.contentPreview}>{item.content}</Text>}
        {item.handle && <Text style={styles.handle}>@{item.handle}</Text>}
      </View>
    </TouchableOpacity>
  );
};

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = () => {
    setLoading(true);
    // Simulating API call
    setTimeout(() => {
      const newNotifications = Array(10).fill().map((_, index) => {
        const notificationTypes = Object.values(NotificationType);
        const type = notificationTypes[index % notificationTypes.length];
        return {
          id: Date.now() + index,
          type,
          username: `User${Math.floor(Math.random() * 1000)}`,
          handle: `handle${Math.floor(Math.random() * 1000)}`,
          content: type === NotificationType.COMMENT ? 'This is a sample comment content.' : undefined,
          otherCount: type === NotificationType.MULTIPLE_LIKES ? Math.floor(Math.random() * 10) + 2 : undefined,
        };
      });
      setNotifications(prevNotifications => [...prevNotifications, ...newNotifications]);
      setLoading(false);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>
      <FlatList
        data={notifications}
        renderItem={({ item }) => <NotificationItem item={item} />}
        keyExtractor={item => item.id.toString()}
        onEndReached={fetchNotifications}
        onEndReachedThreshold={0.1}
        ListFooterComponent={loading ? <Text style={styles.loadingText}>Loading...</Text> : null}
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
    padding: 8,
  },
  headerTitle: {
    fontFamily: 'Athelas',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  iconContainer: {
    marginRight: 16,
  },
  contentContainer: {
    flex: 1,
  },
  notificationText: {
    fontFamily: 'SFProText-Regular',
    fontSize: 16,
    color: '#fff',
    marginBottom: 4,
  },
  username: {
    fontFamily: 'SFProText-Bold',
    fontWeight: 'bold',
  },
  handle: {
    fontFamily: 'SFProText-Regular',
    fontSize: 16,
    color: '#687684',
  },
  contentPreview: {
    fontFamily: 'SFProText-Regular',
    fontSize: 16,
    color: '#687684',
    marginTop: 4,
  },
  loadingText: {
    color: '#fff',
    textAlign: 'center',
    padding: 16,
  },
});

export default NotificationsPage;