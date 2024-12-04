import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppRoutes from './src/routes/appRoutes'; // Solo AppRoutes maneja las rutas

export default function App() {
  return (
    <View style={styles.container}>
      {/* Solo incluir AppRoutes aquí, que manejará la navegación */}
      <AppRoutes />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
