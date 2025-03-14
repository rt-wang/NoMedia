import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { useReposts } from './RepostContext';
import axios from 'axios';

const PostContext = createContext();
const API_BASE_URL = 'http://localhost:8082';

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const { addRepost } = useReposts();
  
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const username = await AsyncStorage.getItem('username');
        const name = await AsyncStorage.getItem('name');
        const token = await AsyncStorage.getItem('token');
        const authorities = await AsyncStorage.getItem('authorities');

        if (userId && username && name && token && authorities) {
          setCurrentUser({
            id: userId,
            username,
            name,
            token,
            authorities
          });
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, []);

  console.log("PostProvider rendered");

  const addPost = (newPost, isRealPost = false) => {
    setPosts(prevPosts => {
      const updatedPost = {
        ...newPost,
        id: newPost.id || `generated_${Date.now()}_${prevPosts.length}`,
        isRealPost: isRealPost,
      };
      
      if (isRealPost) {
        // Add real posts to the beginning of the array
        return [updatedPost, ...prevPosts];
      } else {
        // Add generated posts to the end of the array
        return [...prevPosts, updatedPost];
      }
    });
  };

  const addComment = (postId, commentContent, parentCommentId = null) => {
    const newComment = {
      id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'comment', // Explicitly set type to 'comment'
      username: currentUser.username,
      content: commentContent,
      timestamp: Date.now(),
      comments: [],
      reposts: 0,
      likes: 0,
    };

    const addNestedComment = (comments) => {
      return comments.map(comment => {
        if (comment.id === parentCommentId) {
          return {
            ...comment,
            comments: [newComment, ...comment.comments],
          };
        } else if (comment.comments.length > 0) {
          return {
            ...comment,
            comments: addNestedComment(comment.comments),
          };
        }
        return comment;
      });
    };

    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id === postId) {
        if (parentCommentId === null) {
          return {
            ...post,
            comments: [newComment, ...post.comments],
          };
        } else {
          return {
            ...post,
            comments: addNestedComment(post.comments),
          };
        }
      }
      return post;
    }));
  };

  const updateCurrentUser = (user) => {
    setCurrentUser(user);
  };

  const toggleLike = (postId) => {
    const updateLikes = (postArray) => {
      return (postArray || []).map(post => {
        if (post.id === postId) {
          const isLiked = post.likedBy?.includes(currentUser.handle);
          return {
            ...post,
            likes: isLiked ? post.likes - 1 : post.likes + 1,
            likedBy: isLiked 
              ? post.likedBy.filter(handle => handle !== currentUser.handle)
              : [...(post.likedBy || []), currentUser.handle],
          };
        } else if (post.comments) {
          return {
            ...post,
            comments: updateLikes(post.comments),
          };
        }
        return post;
      });
    };

    setPosts(updateLikes);
    setUserPosts(updateLikes);
  };

  const toggleRepost = async (postId) => {
    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      const isReposted = post.repostedBy?.includes(currentUser.username);
      
      if (isReposted) {
        // TODO: Implement unrepost functionality on the backend
        console.log('Unrepost functionality not implemented');
        return;
      }

      const newRepost = await addRepost(post, currentUser.id, currentUser.token, currentUser.authorities, currentUser.name, currentUser.username);

      setPosts(prevPosts => prevPosts.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            reposts: (p.reposts || 0) + 1,
            repostedBy: [...(p.repostedBy || []), currentUser.username],
          };
        }
        return p;
      }));

      addPost(newRepost, true);

    } catch (error) {
      console.error('Error toggling repost:', error);
      Alert.alert('Error', 'Failed to repost. Please try again.');
    }
  };

  const quotePost = async (originalPost, quoteText) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');
      const username = await AsyncStorage.getItem('username');
      const name = await AsyncStorage.getItem('name');
      const authorities = await AsyncStorage.getItem('authorities');
      if (!token || !userId) {
        Alert.alert('Error', 'You must be logged in to quote a post.');
        return;
      }

      const quoteData = {
        userId: userId,
        postFormat: 'Quote',
        originalPostId: originalPost.postId,  // Changed from 'id' to 'postId'
        content: quoteText,
        name: name,
        username: username,
      };

      const response = await axios.post(`${API_BASE_URL}/api/posts`, quoteData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'authorities': authorities,
        }
      });

      if (response.status === 201) {
        const newQuote = {
          ...response.data,
          type: 'quote',
          originalPost: originalPost,
          quoteText: quoteText,
          timestamp: Date.now(),
        };
        addPost(newQuote, true);
        return newQuote;
      } else {
        throw new Error('Failed to create quote');
      }
    } catch (error) {
      console.error('Error creating quote:', error);
      Alert.alert('Error', 'Failed to create quote. Please try again.');
      throw error;
    }
  };

  return (
    <PostContext.Provider value={{ 
      posts, 
      userPosts,
      addPost, 
      addComment,
      currentUser, 
      updateCurrentUser,
      toggleLike,
      toggleRepost,
      quotePost
    }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => useContext(PostContext);