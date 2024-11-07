import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Post from './Post';

const SentimentMatchingDemo = ({ navigation }) => {
  const mainPost = {
    content: "I think AI will primarily augment human capabilities rather than replace them entirely. The key is finding the right balance between automation and human insight.",
    username: "techphilosopher",
    name: "Tech Philosopher",
    time: "2m",
    comments: 5,
    likes: 12,
    reposts: 3,
  };

  const relatedPosts = [
    {
      content: "While AI automation is powerful, the **human insight** and **creative thinking** will always be essential for meaningful progress.",
      username: "innovator_mind",
      name: "Innovator Mind",
      time: "1h",
      comments: 2,
      likes: 8,
      reposts: 1,
      matchScore: "93% match"
    },
    {
      content: "The future isn't about AI vs humans, it's about **finding the right balance** between computational power and human wisdom.",
      username: "future_thinker",
      name: "Future Thinker",
      time: "3h",
      comments: 1,
      likes: 6,
      reposts: 1,
      matchScore: "89% match"
    },
    {
      content: "**Augmentation** is the key word here. AI tools should enhance our natural abilities, not replace them.",
      username: "tech_optimist",
      name: "Tech Optimist",
      time: "5h",
      comments: 3,
      likes: 10,
      reposts: 2,
      matchScore: "85% match"
    },
    {
      content: "Agreed on **balancing automation with human input**. We need both technical efficiency and human judgment.",
      username: "digital_sage",
      name: "Digital Sage",
      time: "6h",
      comments: 4,
      likes: 11,
      reposts: 2,
      matchScore: "82% match"
    },
    {
      content: "The most promising AI applications are those that **augment human capabilities** rather than trying to replicate them entirely.",
      username: "ai_researcher",
      name: "AI Researcher",
      time: "7h",
      comments: 2,
      likes: 9,
      reposts: 1,
      matchScore: "78% match"
    }
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.postContainer}>
          <Post
            item={mainPost}
            onCommentPress={() => {}}
            commentCount={mainPost.comments}
          />
        </View>
        {relatedPosts.map((post, index) => (
          <View key={index} style={styles.postContainer}>
            <Post
              item={{
                ...post,
                content: post.content,
              }}
              onCommentPress={() => {}}
              commentCount={post.comments}
              matchScore={post.matchScore}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  postContainer: {
    paddingHorizontal: 8,
    borderBottomWidth: 0,
    borderBottomColor: '#333',
  },
});

export default SentimentMatchingDemo;