import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TOPICS = [
  "Anime & Cosplay", "Art", "Business & Finance", "Collectibles",
  "Home & Garden", "Humanities & Law", "Internet Culture",
  "Pop Culture", "Q&As & Stories", "Reading & Writing", "Science",
  "Technology", "Travel", "Video Games",
  // Additional 15 topics
  "Fashion & Beauty", "Food & Drinks", "Sports", "Music",
  "Photography", "DIY & Crafts", "Fitness", "Movies & TV",
  "Pets & Animals", "Education", "History", "Nature",
  "Automotive", "Parenting", "Cryptocurrency"
];

const TOPIC_BOXES = [
  { id: '1', title: '/ P Diddy Arrested' },
  { id: '2', title: '/ NVIDIA going to $150?' },
  { id: '3', title: '/ Laver Cup: Fed Coaching' },
  { id: '4', title: '/ Arcane S2 Trailer' },
  { id: '5', title: '/ MLB' },
  { id: '6', title: '/ I hate my life bro' },
  { id: '7', title: '/ Dead Internet Theory' },
  { id: '8', title: '/ Bitcoin discussion' },
];

const TopicBox = ({ item }) => {
  const randomPosts = (Math.random() * (10000 - 500) + 500).toFixed(2);
  const formattedPosts = (randomPosts / 1000).toFixed(2) + 'k';

  return (
    <TouchableOpacity style={styles.topicBox}>
      <View style={styles.topicSlashContainer}>
        <Text style={styles.topicSlash}>/</Text>
      </View>
      <Text style={styles.topicTitle}>{item.title.substring(2)}</Text>
      <View style={styles.postsContainer}>
        <Text style={styles.postsCount}>{formattedPosts} posts</Text>
      </View>
    </TouchableOpacity>
  );
};

const TopicButton = ({ topic }) => (
  <TouchableOpacity style={styles.topicButton}>
    <Text style={styles.topicButtonText}>{topic}</Text>
  </TouchableOpacity>
);

const TopicSection = ({ title, data }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {data.reduce((pairs, item, index) => {
        if (index % 2 === 0) {
          pairs.push(
            <View key={index} style={styles.topicBoxPair}>
              <TopicBox item={item} />
              {data[index + 1] && <TopicBox item={data[index + 1]} />}
            </View>
          );
        }
        return pairs;
      }, [])}
    </ScrollView>
  </View>
);

const TopicButtonsSection = () => {
  const rows = 2;
  const buttonHeight = 36; // Adjust this value based on your button height
  const containerHeight = rows * buttonHeight + (rows - 1) * 8; // 8 is the vertical margin between buttons

  return (
    <View style={[styles.topicsScrollContainer, { height: containerHeight }]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={[styles.topicButtonsContainer, { height: containerHeight }]}>
          {TOPICS.map((topic, index) => (
            <TopicButton key={index} topic={topic} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const Topics = () => {
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const fetchedSections = [
      { id: '1', title: 'Recommended for you', data: TOPIC_BOXES },
      { id: '2', title: 'Trending Topics', data: TOPIC_BOXES },
      { id: '3', title: 'Science', data: TOPIC_BOXES },
    ];
    setSections(fetchedSections);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Explore topics</Text>
      <TopicButtonsSection />
      <FlatList
        data={sections}
        renderItem={({ item }) => <TopicSection title={item.title} data={item.data} />}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    fontFamily: 'System',
  },
  topicsScrollContainer: {
    marginBottom: 24,
  },
  topicButtonsContainer: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    height: 80,
    alignContent: 'flex-start',
  },
  topicButton: {
    backgroundColor: 'rgba(255, 182, 193, 0.1)', // Light pink with opacity
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    margin: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 182, 193, 0.3)',
  },
  topicButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'SFProText-Regular',
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 14,
    fontFamily: 'SFProText-Regular',
  },
  topicBoxPair: {
    width: 280,
    marginRight: 16,
  },
  topicBox: {
    width: '100%',
    height: 45,
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 0,
    borderColor: 'rgba(255, 182, 193, 0.2)',
    overflow: 'hidden',
  },
  topicSlashContainer: {
    width: 30,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 0,
    borderRightColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: -12,
  },
  topicSlash: {
    fontSize: 18,
    fontWeight: '500',
    color: '#666',
  },
  topicTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
    color: '#fff',
    fontFamily: 'SFProText-Regular',
    paddingLeft: 10,
  },
  postsContainer: {
    width: 60,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 0,
    borderLeftColor: 'rgba(255, 255, 255, 0.1)',
  },
  postsCount: {
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.6)',
  },
});

export default Topics;
