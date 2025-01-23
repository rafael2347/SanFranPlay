import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, FlatList, Dimensions } from 'react-native';
import { superBase } from '../../config/conexionBd'; 

const { width } = Dimensions.get('window');
const isTablet = width >= 768;
const isLargeScreen = width >= 1280;

const HomeScreen = () => {
  const [inputValue, setInputValue] = useState('');
  const [canciones, setCanciones] = useState<{ id: any; title: any; textoCancion: any }[]>([]);
  const [textoCancion, setTextoCancion] = useState('');
  const [error, setError] = useState('');

  const buscarCancion = async () => {
    try {
      const isNumber = !isNaN(Number(inputValue));
      const numberValue = isNumber ? Number(inputValue) : null;

      // Consulta a la base de datos
      const { data, error } = await superBase
        .from('canciones')
        .select('id, title, textoCancion')
        .or(
          isNumber
            ? `numeroCancion.eq.${numberValue}`
            : `title.ilike.%${inputValue}%`
        );

      if (error) throw error;

      if (data && data.length > 0) {
        setCanciones(data); // Guarda todas las coincidencias
        setTextoCancion(''); // Limpia el texto de la canción seleccionada
        setError('');
      } else {
        setCanciones([]);
        setTextoCancion('');
        setError('No se encontró la canción.');
      }
    } catch (error) {
      console.error('Error al buscar la canción:', error);
      setError('Hubo un problema al buscar la canción.');
    }
  };

  const seleccionarCancion = (cancion: { textoCancion: string }) => {
    setTextoCancion(cancion.textoCancion); // Muestra el texto de la canción seleccionada
    setCanciones([]); // Limpia la lista de opciones
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Escribe el título o número de la canción"
        value={inputValue}
        onChangeText={setInputValue}
      />
      <TouchableOpacity style={styles.butonCarga} onPress={buscarCancion}>
        <Text style={styles.butonText}>Buscar Canción</Text>
      </TouchableOpacity>

      {canciones.length > 0 && (
        <FlatList
          data={canciones}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.cancionItem}
              onPress={() => seleccionarCancion(item)}
            >
              <Text style={styles.cancionTitle}>{item.title}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {textoCancion ? <Text style={styles.resultado}>{textoCancion}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fff',
  },
  butonCarga: {
    backgroundColor: '#aec4db',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 4,
    marginTop: 20,
  },
  butonText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'white',
  },
  cancionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
  },
  cancionTitle: {
    fontSize: 16,
    color: '#000',
  },
  resultado: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
    marginVertical: 20,
  },
  error: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});

export default HomeScreen;
