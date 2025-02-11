import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { superBase } from '../../config/conexionBd'; 
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const [inputValue, setInputValue] = useState('');
  const [canciones, setCanciones] = useState<{ id: any; title: any; textoCancion: any }[]>([]);
  const [tituloCancion, setTituloCancion] = useState('');
  const [textoCancion, setTextoCancion] = useState('');
  const [error, setError] = useState('');
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  const buscarCancion = async () => {
    try {
      const isNumber = !isNaN(Number(inputValue));
      const numberValue = isNumber ? Number(inputValue) : null;

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
        setCanciones(data);
        setTextoCancion('');
        setTituloCancion('');
        setError('');
      } else {
        setCanciones([]);
        setTextoCancion('');
        setTituloCancion('');
      }
    } catch (error) {
      console.error('Error al buscar la canción:', error);
      setError('Hubo un problema al buscar la canción.');
    }
  };

  const seleccionarCancion = (cancion: { title: string, textoCancion: string }) => {
    setTituloCancion(cancion.title);
    setTextoCancion(cancion.textoCancion);
    setCanciones([]);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
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
          <View style={styles.listaContainer}>
            {canciones.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.cancionItem}
                onPress={() => seleccionarCancion(item)}
              >
                <Text style={styles.cancionTitle}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {tituloCancion ? (
          <View>
            <Text style={styles.titulo}>{tituloCancion}</Text>
            <Text style={styles.resultado}>{textoCancion}</Text>
          </View>
        ) : (
          <Text style={styles.resultado}></Text>
        )}

        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fff',
    fontFamily: 'Poppins_400Regular',
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
    fontFamily: 'Poppins_700Bold',
  },
  listaContainer: {
    width: '100%',
    marginTop: 20,
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
    fontFamily: 'Poppins_700Bold',
  },
  titulo: {
    fontSize: 30,
    color: 'black',
    textAlign: 'left',
    marginVertical: 20,
    fontFamily: 'Poppins_700Bold',
  },
  resultado: {
    fontSize: 18,
    color: 'black',
    textAlign: 'left',
    marginVertical: 20,
    fontFamily: 'Poppins_400Regular',
  },
  error: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular',
  },
});

export default HomeScreen;
