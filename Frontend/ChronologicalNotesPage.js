import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const THEME_PINK = '#FFC6D1';

const NoteItem = ({ title, preview, createdTime }) => (
  <View style={styles.noteItem}>
    <View style={styles.noteContent}>
      <Text style={styles.noteTitle}>{title}</Text>
      <Text 
        style={styles.notePreview}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {preview}
      </Text>
    </View>
    <Text style={styles.noteTime}>{createdTime}</Text>
  </View>
);

const ChronologicalNotesPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const folderId = route.params?.folderId;

  const handleGoBack = () => {
    navigation.navigate('FoldersPage');
  };

  // Updated realistic notes data
  const notes = [
    {
      id: '1',
      content: "Warriors vs Celtics Analysis\nThe Warriors' offensive strategy this season shows a clear evolution from their 2015-2018 dynasty years. While the motion offense remains, there's less reliance on off-ball screens and more emphasis on isolation plays. Interesting to see if this adapts as the season progresses.",
      createdTime: '2:15 PM'
    },
    {
      id: '2',
      content: "Remote Work Revelation\nMet someone today who changed my perspective on remote work. They've been digital nomading for 5 years and built a 7-figure business. Key insight: consistency matters more than location. Need to rethink my approach to productivity.",
      createdTime: '11:30 AM'
    },
    {
      id: '3',
      content: "Philosophy 301 - Kant\nKant's Categorical Imperative discussion today was mind-bending. The idea that moral laws should be universal, like 'what if everyone did this?' makes sense, but gets complex with real-world applications. Example from class about lying to protect someone raised good counter-arguments.",
      createdTime: '10:45 AM'
    },
    {
      id: '4',
      content: "Consciousness Theory\nIf consciousness is an emergent property of complex systems, at what exact point does a system become complex enough to be conscious? Is there a gradual spectrum of consciousness rather than a binary state? Need to research more on integrated information theory.",
      createdTime: '9:20 AM'
    },
    {
      id: '5',
      content: "App Idea - MindMap\nAI-powered journal that identifies patterns in your daily entries and suggests actionable insights. Could help with personal growth and mental health. Key features: sentiment analysis, habit tracking, and personalized recommendations.",
      createdTime: 'Yesterday'
    }
  ];

  const renderNote = ({ item }) => {
    const title = item.content.split('\n')[0];
    const preview = item.content.split('\n')[1];
    return <NoteItem title={title} preview={preview} createdTime={item.createdTime} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={24} color={THEME_PINK} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('NotesEditorPage', { folderId })}>
          <Ionicons name="create-outline" size={24} color={THEME_PINK} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={notes}
        renderItem={renderNote}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    marginTop: -75,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingRight: 24,
  },
  noteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  noteContent: {
    flex: 1,
  },
  noteTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  notePreview: {
    color: '#CCCCCC',
    fontSize: 14,
    lineHeight: 18,
  },
  noteTime: {
    color: '#999999',
    fontSize: 12,
    marginLeft: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#333333',
    marginHorizontal: 16,
  },
});

export default ChronologicalNotesPage;
