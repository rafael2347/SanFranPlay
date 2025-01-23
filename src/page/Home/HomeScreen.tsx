import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Dimensions } from 'react-native';
import { superBase } from '../../config/conexionBd'; 

const { width } = Dimensions.get('window');
const isTablet = width >= 768;
const isLargeScreen = width >= 1280;

const HomeScreen = () => {
  const [inputValue, setInputValue] = useState('');
  const [textoCancion, setTextoCancion] = useState('');
  const [error, setError] = useState('');

  const buscarCancion = async () => {
    try {
      const isNumber = !isNaN(Number(inputValue)); // Verifica si es un número
      const numberValue = isNumber ? Number(inputValue) : null; // Convierte a número si es necesario

      // Construye la consulta según el tipo de entrada
      const { data, error } = await superBase
        .from('canciones') // Nombre de la tabla
        .select('textoCancion') // Seleccionamos solo la columna 
        .or(
          isNumber
            ? `numeroCancion.eq.${numberValue}` // Si es número, busca en la columna numeroCancion
            : `title.ilike.%${inputValue}%` // Si es texto, busca en el título
        );

      if (error) throw error;

      if (data && data.length > 0) {
        setTextoCancion(data[0].textoCancion); // Toma el texto de la primera coincidencia
        setError('');
      } else {
        setTextoCancion('');
        setError('No se encontró la canción.');
      }
    } catch (error) {
      console.error('Error al buscar la canción:', error);
      setError('Hubo un problema al buscar la canción.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Escribe el título o número de la canción"
        value={inputValue}
        onChangeText={setInputValue}
        keyboardType="default" // Cambiar a "numeric" si solo se espera números
      />
      <TouchableOpacity style={styles.butonCarga} onPress={buscarCancion}>
        <Text style={styles.butonText}>Cargar Canción</Text>
      </TouchableOpacity>
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
  scrollContainer: {
    flex: 1,
    width: '100%',
    marginTop: 20,
  },
  scrollContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  resultado: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
    marginBottom: 20,
  },
  error: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  tabBar: {
    backgroundColor: '#82A6C3',
  },
  header: {
    backgroundColor: '#82A6C3',
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 20,
  },
});

export default HomeScreen;