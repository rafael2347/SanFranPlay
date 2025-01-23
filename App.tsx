import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppRoutes from './src/routes/appRoutes'; 

export default function App() {
  return (
    <View style={styles.container}>
     <AppRoutes/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});