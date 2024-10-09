import React, { createContext, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { useReposts } from './RepostContext';

const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const { addRepost } = useReposts();
  
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

      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');
      const authorities = await AsyncStorage.getItem('authorities');

      const newRepost = await addRepost(post, userId, token, authorities, currentUser.name, currentUser.username);

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

  return (
    <PostContext.Provider value={{ 
      posts, 
      userPosts,
      addPost, 
      addComment,
      currentUser, 
      updateCurrentUser,
      toggleLike,
      toggleRepost
    }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => useContext(PostContext);