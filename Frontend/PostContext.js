import React, { createContext, useState, useContext } from 'react';

const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState({
    username: 'John Doe',
    handle: 'johndoe',
  });

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
      return postArray.map(post => {
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

  const toggleRepost = (postId) => {
    const updateReposts = (postArray) => {
      return postArray.map(post => {
        if (post.id === postId) {
          const isReposted = post.repostedBy?.includes(currentUser.handle);
          return {
            ...post,
            reposts: isReposted ? post.reposts - 1 : post.reposts + 1,
            repostedBy: isReposted 
              ? post.repostedBy.filter(handle => handle !== currentUser.handle)
              : [...(post.repostedBy || []), currentUser.handle],
          };
        } else if (post.comments) {
          return {
            ...post,
            comments: updateReposts(post.comments),
          };
        }
        return post;
      });
    };

    setPosts(updateReposts);
    setUserPosts(updateReposts);
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

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePosts must be used within a PostProvider');
  }
  return context;
};