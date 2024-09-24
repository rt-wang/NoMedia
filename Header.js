import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const Header = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const showBackButton = ['UserAccountPage', 'CommentSection'].includes(route.name);

  return (
    <View style={styles.header}>
      {showBackButton && (
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      )}
      <Text style={[styles.headerText, !showBackButton && styles.headerTextCentered]}>NoMedia.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingHorizontal: 16,
  },
  headerText: {
    fontFamily: 'Athelas',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  headerTextCentered: {
    textAlign: 'center',
  },
  backButton: {
    marginRight: 16,
  },
});

export default Header;