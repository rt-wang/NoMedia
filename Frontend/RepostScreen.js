import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useReposts } from './RepostContext';
import { usePosts } from './PostContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RepostScreen = ({ route }) => {
  const { post } = route.params;
  const navigation = useNavigation();
  const { addRepost } = useReposts();
  const { addPost } = usePosts();

  const handleRepost = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');
      const authorities = await AsyncStorage.getItem('authorities');
      const name = await AsyncStorage.getItem('name');
      const username = await AsyncStorage.getItem('username');

      if (!token || !userId) {
        console.error('User not authenticated');
        Alert.alert('Error', 'You must be logged in to repost.');
        return;
      }

      const newRepost = await addRepost(post, userId, token, authorities, name, username);
      addPost(newRepost, true);
      navigation.goBack();
    } catch (error) {
      console.error('Error creating repost:', error);
      Alert.alert('Error', 'An error occurred while creating the repost. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
    </SafeAreaView>
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