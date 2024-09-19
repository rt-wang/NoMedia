import React, { createContext, useState, useContext } from 'react';

const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState({
    username: 'John Doe',
    handle: 'johndoe',
  });

  const addPost = (newPost) => {
    const postWithId = {
      ...newPost,
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      username: currentUser.username,
      handle: currentUser.handle,
      timestamp: Date.now(),
      comments: [],
      type: newPost.type || 'post', // Ensure type is set, default to 'post'
    };
    if (newPost.isUserPost) {
      setUserPosts(prevPosts => [postWithId, ...prevPosts]);
    } else {
      setPosts(prevPosts => [postWithId, ...prevPosts]);
    }
  };

  const addComment = (postId, commentContent) => {
    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id === postId) {
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
        return {
          ...post,
          comments: [newComment, ...post.comments],
        };
      }
      return post;
    }));
  };

  const updateCurrentUser = (user) => {
    setCurrentUser(user);
  };

  return (
    <PostContext.Provider value={{ 
      posts, 
      userPosts,
      addPost, 
      addComment,
      currentUser, 
      updateCurrentUser 
    }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => useContext(PostContext);