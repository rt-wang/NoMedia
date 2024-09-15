import React, { createContext, useState, useContext } from 'react';

const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
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
    };
    setPosts(prevPosts => [postWithId, ...prevPosts]);
  };

  const addComment = (postId, commentContent) => {
    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id === postId) {
        const newComment = {
          id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          username: currentUser.username,
          content: commentContent,
          timestamp: Date.now(),
          replies: [],
        };
        return {
          ...post,
          comments: [newComment, ...post.comments],
        };
      }
      return post;
    }));
  };

  const addCommentsToPost = (postId, newComments) => {
    setPosts(prevPosts => prevPosts.map(post => 
      post.id === postId 
        ? { ...post, comments: [...post.comments, ...newComments] }
        : post
    ));
  };

  const updateCurrentUser = (user) => {
    setCurrentUser(user);
  };

  return (
    <PostContext.Provider value={{ 
      posts, 
      addPost, 
      addComment, 
      addCommentsToPost, // Add this new method
      currentUser, 
      updateCurrentUser 
    }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => useContext(PostContext);