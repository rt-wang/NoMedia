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
      <Text style={styles.notePreview}>{preview}</Text>
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

  // Dummy data for demonstration
  const notes = [
    { id: '1', content: 'First note content', createdTime: '10:00 AM' },
    { id: '2', content: 'Second note with a longer content for preview', createdTime: '11:30 AM' },
    { id: '3', content: 'Third note', createdTime: '2:45 PM' },
  ];

  const renderNote = ({ item }) => {
    const title = item.content.split('\n')[0];
    const preview = item.content.length > 70 ? item.content.substring(0, 70) + '...' : item.content;
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
