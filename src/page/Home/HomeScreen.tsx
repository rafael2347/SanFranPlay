import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;
const isLargeScreen = width >= 1280;

const HomeScreen = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [search, setSearch] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscar una Canción</Text>

      <TextInput
        style={styles.input}
        onChangeText={setSearch}
        placeholder="Ingresa número o título de la canción..."
        value={search} // Mantener el valor dentro del input
      />

      <TouchableOpacity style={styles.butonCarga} onPress={() => {}}>
        <Text style={styles.butonText}>Cargar Canción</Text>
      </TouchableOpacity>

      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 30,
  },
  title: {
    fontSize: isLargeScreen ? 22 : isTablet ? 20 : 18,
    marginBottom: 16,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 16,
    borderRadius: 8,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fff',
    textAlignVertical: 'center',
    position: 'absolute', // Mantiene la caja de texto fija
    top: 70, // Establece la posición del input desde la parte superior
  
   
  },
  butonCarga: {
    backgroundColor: '#aec4db',
    color: 'white',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 4,
    
    marginTop: 80, // Espacio desde el TextInput
  },
  butonText: {
    fontSize: 30,
    textAlign: 'center',
    color: 'white',
  },
});

export default HomeScreen;
