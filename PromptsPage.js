import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TOPICS = [
  "Technology", "Science", "Politics", "Economics", "Philosophy",
  "Art", "Literature", "History", "Mathematics", "Psychology"
];

const PROMPT_BOXES = [
  { id: '1', title: '<Bitcoin discussion>' },
  { id: '2', title: '<Opinions on NVIDIA stock?>' },
  { id: '3', title: '<New discovery in quantum physics?>' },
  { id: '4', title: '<Best way to learn Python?>' },
  { id: '5', title: '<What do you guys think of "Dune"?>' },
  { id: '6', title: '<Future of renewable energy?>' },
  // Add more prompts as needed
];

const PromptBox = ({ item }) => (
  <View style={styles.promptBox}>
    <Text style={styles.promptTitle}>{item.title}</Text>
    <Text style={styles.promptBody}>Discuss this topic with the community...</Text>
  </View>
);

const TopicButton = ({ topic }) => (
  <TouchableOpacity style={styles.topicButton}>
    <Text style={styles.topicButtonText}>{topic}</Text>
  </TouchableOpacity>
);

const PromptSection = ({ title, data }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {data.map((item) => (
        <PromptBox key={item.id} item={item} />
      ))}
    </ScrollView>
  </View>
);

const Prompts = () => {
  const [sections, setSections] = useState([]);

  useEffect(() => {
    // Simulating fetching data
    const fetchedSections = [
      { id: '1', title: 'Recommended for you', data: PROMPT_BOXES },
      { id: '2', title: 'More like Technology', data: PROMPT_BOXES },
      { id: '3', title: 'Trending Prompts', data: PROMPT_BOXES },
      // Add more sections as needed
    ];
    setSections(fetchedSections);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Explore prompts by topic</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.topicsScroll}>
        {TOPICS.map((topic, index) => (
          <TopicButton key={index} topic={topic} />
        ))}
      </ScrollView>
      <FlatList
        data={sections}
        renderItem={({ item }) => <PromptSection title={item.title} data={item.data} />}
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  topicsScroll: {
    marginBottom: 16,
  },
  topicButton: {
    backgroundColor: '#333',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  topicButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  promptBox: {
    width: 250,
    height: 120,
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
  },
  promptTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  promptBody: {
    fontSize: 14,
    color: '#ccc',
  },
});

export default Prompts;
