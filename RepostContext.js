import React, { createContext, useState, useContext } from 'react';

const RepostContext = createContext();

export const RepostProvider = ({ children }) => {
  const [reposts, setReposts] = useState([]);

  const addRepost = (post, userId, quoteText = '') => {
    const repost = {
      id: `repost-${post.id}-${Date.now()}`,
      type: quoteText ? 'quote' : 'repost',
      originalPost: post,
      userId: userId,
      timestamp: Date.now(),
      quoteText: quoteText,
    };
    setReposts(prevReposts => [repost, ...prevReposts]);
  };

  return (
    <RepostContext.Provider value={{ reposts, addRepost }}>
      {children}
    </RepostContext.Provider>
  );
};

export const useReposts = () => useContext(RepostContext);