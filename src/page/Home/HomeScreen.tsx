import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Dimensions } from 'react-native';
import { superBase } from '../../config/conexionBd'; // Asegúrate de que este archivo esté configurado correctamente

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
        .from('canciones') // Nombre de tu tabla
        .select('textoCancion') // Selecciona solo la columna que necesitas
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
    paddingTop: 30,
    paddingHorizontal: 16,
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
    top: 70,
  },
  butonCarga: {
    backgroundColor: '#aec4db',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 4,
    marginTop: 20,
  },
  butonText: {
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
  },
  resultado: {
    marginTop: 20,
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
  },
  error: {
    marginTop: 20,
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});

export default HomeScreen;
