import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useReposts } from './RepostContext';

const RepostScreen = ({ route, navigation }) => {
  const { post } = route.params;
  const { addRepost } = useReposts();

  const handleRepost = () => {
    addRepost(post);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Repost</Text>
        <TouchableOpacity onPress={handleRepost}>
          <Text style={styles.repostButton}>Repost</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.postContainer}>
        <Text style={styles.username}>{post.username}</Text>
        <Text style={styles.postContent}>{post.content}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  repostButton: {
    color: '#1DA1F2',
    fontWeight: 'bold',
  },
  postContainer: {
    backgroundColor: '#222',
    padding: 16,
    borderRadius: 8,
  },
  username: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  postContent: {
    color: '#fff',
  },
});

export default RepostScreen;