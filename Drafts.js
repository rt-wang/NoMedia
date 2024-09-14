import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

const Drafts = () => {
  const [drafts, setDrafts] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    loadDrafts();
  }, []);

  const loadDrafts = async () => {
    try {
      const storedDrafts = await AsyncStorage.getItem('drafts');
      if (storedDrafts) {
        setDrafts(JSON.parse(storedDrafts).sort((a, b) => b.timestamp - a.timestamp));
      }
    } catch (error) {
      console.error('Error loading drafts:', error);
    }
  };

  const deleteDraft = async (draftToDelete) => {
    try {
      const updatedDrafts = drafts.filter(draft => draft.timestamp !== draftToDelete.timestamp);
      await AsyncStorage.setItem('drafts', JSON.stringify(updatedDrafts));
      setDrafts(updatedDrafts);
    } catch (error) {
      console.error('Error deleting draft:', error);
    }
  };

  const confirmDelete = (draft) => {
    Alert.alert(
      "Delete Draft",
      "Are you sure you want to delete this draft?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => deleteDraft(draft), style: "destructive" }
      ]
    );
  };

  const renderRightActions = (draft) => {
    return (
      <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete(draft)}>
        <Ionicons name="trash-outline" size={24} color="#fff" />
      </TouchableOpacity>
    );
  };

  const renderDraftItem = ({ item }) => (
    <Swipeable renderRightActions={() => renderRightActions(item)}>
      <TouchableOpacity 
        style={styles.draftItem}
        onPress={() => navigation.navigate('Create', { draft: item })}
      >
        <Text style={styles.draftTitle}>{item.title || 'Untitled'}</Text>
        <Text style={styles.draftPreview}>{item.body.slice(0, 50)}...</Text>
        <Text style={styles.draftDate}>{new Date(item.timestamp).toLocaleDateString()}</Text>
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Drafts</Text>
      </View>
      <FlatList
        data={drafts}
        renderItem={renderDraftItem}
        keyExtractor={(item) => item.timestamp.toString()}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 16,
  },
  listContent: {
    padding: 16,
  },
  draftItem: {
    backgroundColor: '#111',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  draftTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  draftPreview: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  draftDate: {
    fontSize: 12,
    color: '#666',
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
});

export default Drafts;