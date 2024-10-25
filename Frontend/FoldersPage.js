import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const THEME_PINK = '#FFC6D1';

const FolderItem = ({ name, isNested }) => (
  <View style={[styles.folderItem, isNested && styles.nestedFolder]}>
    <Ionicons name="folder-outline" size={24} color={THEME_PINK} />
    <Text style={styles.folderName}>{name}</Text>
  </View>
);

const FoldersPage = () => {
  const navigation = useNavigation();
  const [folders, setFolders] = useState([
    { id: '1', name: 'Memo', isNested: false },
    { id: '2', name: 'Work', isNested: false },
    { id: '3', name: 'Personal', isNested: false },
    { id: '4', name: 'Projects', isNested: false },
    { id: '5', name: 'Subproject 1', isNested: true },
    { id: '6', name: 'Subproject 2', isNested: true },
  ]);

  const renderFolder = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('ChronologicalNotes', { folderId: item.id })}>
      <FolderItem name={item.name} isNested={item.isNested} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {/* Implement create folder functionality */}}>
          <Ionicons name="create-outline" size={24} color={THEME_PINK} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('NotesEditorPage')}>
          <Ionicons name="folder-outline" size={24} color={THEME_PINK} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={folders}
        renderItem={renderFolder}
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
    paddingRight: 20,
  },
  folderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  nestedFolder: {
    marginLeft: 32,
  },
  folderName: {
    color: '#FFFFFF',
    fontSize: 18,
    marginLeft: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#333333',
    marginHorizontal: 16,
  },
});

export default FoldersPage;
