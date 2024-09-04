import { StyleSheet, View } from 'react-native';
import React from 'react';
import { registerRootComponent } from 'expo';
import ForYouPage from './ForYouPage';

function App() {
  return <ForYouPage />;
}

registerRootComponent(App);

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
