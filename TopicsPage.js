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
  { id: '3', title: '/ New discovery in quantum physics' },
  { id: '4', title: '/ Best way to learn Python' },
  { id: '5', title: '/ Thoughts on "Dune"' },
  { id: '6', title: '/ Future of renewable energy' },
  { id: '7', title: '/ AI in healthcare' },
  { id: '8', title: '/ Bitcoin discussion' },
];

const TopicBox = ({ item }) => (
  <TouchableOpacity style={styles.topicBox}>
    <Text style={styles.topicTitle}>{item.title}</Text>
  </TouchableOpacity>
);

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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    fontFamily: 'System',
  },
  topicsScrollContainer: {
    marginBottom: 20,
  },
  topicButtonsContainer: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    height: 80, // Adjust this value to fit two rows of buttons
    alignContent: 'flex-start',
  },
  topicButton: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 20,
    margin: 4,
    borderWidth: 1,
    borderColor: '#333',
  },
  topicButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'System',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    fontFamily: 'System',
  },
  topicBoxPair: {
    width: 280,
    marginRight: 16,
  },
  topicBox: {
    width: '100%',
    height: 60,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 10,
    marginBottom: 6,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  topicTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'System',
  },
});

export default Topics;
