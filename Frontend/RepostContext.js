import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const RepostContext = createContext();

const API_BASE_URL = 'http://localhost:8082'; // Replace with your actual API URL

export const RepostProvider = ({ children }) => {
  const [reposts, setReposts] = useState([]);

  const addRepost = async (post, userId, token, authorities, name, username) => {
    try {
      const repostData = {
        userId: userId,
        postFormat: 'Repost',  // Changed from 'post_format' to 'postFormat' and value to 'REPOST'
        originalPostId: post.postId,  // Changed from 'post_id' to 'postId'
        name: name,
        username: username,
        content: '',
      };

      const response = await axios.post(`${API_BASE_URL}/api/posts`, repostData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'authorities': authorities,
        }
      });

      if (response.status === 201) {
        const newRepost = {
          ...response.data,
          type: 'repost',
          originalPost: post,
          timestamp: Date.now(),
        };
        setReposts(prevReposts => [newRepost, ...prevReposts]);
        return newRepost;
      } else {
        throw new Error('Failed to create repost');
      }
    } catch (error) {
      console.error('Error creating repost:', error);
      throw error;
    }
  };

  return (
    <RepostContext.Provider value={{ reposts, addRepost }}>
      {children}
    </RepostContext.Provider>
  );
};

export const useReposts = () => useContext(RepostContext);