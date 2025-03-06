import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../../config/conexionBd';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const [inputValue, setInputValue] = useState('');
  const [canciones, setCanciones] = useState<{ id: string; title: string; textoCancion: string }[]>([]);
  const [cancionesIniciales, setCancionesIniciales] = useState<{ id: string; title: string; textoCancion: string }[]>([]);
  const [tituloCancion, setTituloCancion] = useState('');
  const [textoCancion, setTextoCancion] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarCancionesIniciales = async () => {
      try {
        const cancionesRef = collection(db, 'canciones');
        const q = query(cancionesRef, orderBy('title'), limit(20));
        const querySnapshot = await getDocs(q);
        const resultados: { id: string; title: string; textoCancion: string }[] = [];

        querySnapshot.forEach((doc) => {
          resultados.push({ id: doc.id, ...doc.data() } as any);
        });

        setCanciones(resultados);
        setCancionesIniciales(resultados);
      } catch (error) {
        console.error('Error al cargar canciones:', error);
        setError('Hubo un problema al cargar las canciones.');
      }
    };

    cargarCancionesIniciales();
  }, []);

  const buscarOCancelar = async () => {
    if (tituloCancion) {
      // Si hay una canción abierta, volver al estado inicial
      setTituloCancion('');
      setTextoCancion('');
      setCanciones(cancionesIniciales);
      setInputValue('');
      return;
    }

    try {
      setTituloCancion('');
      setTextoCancion('');

      if (!inputValue.trim()) {
        setCanciones(cancionesIniciales);
        return;
      }

      const isNumber = !isNaN(Number(inputValue));
      const cancionesRef = collection(db, 'canciones');
      const q = query(
        cancionesRef,
        isNumber
          ? where('numeroCancion', '==', Number(inputValue))
          : where('title', '>=', inputValue),
        orderBy('title'),
        limit(20)
      );

      const querySnapshot = await getDocs(q);
      const resultados: { id: string; title: string; textoCancion: string }[] = [];

      querySnapshot.forEach((doc) => {
        resultados.push({ id: doc.id, ...doc.data() } as any);
      });

      if (resultados.length > 0) {
        setCanciones(resultados);
        setError('');
      } else {
        setCanciones(cancionesIniciales);
        setError('No se encontraron canciones.');
      }
    } catch (error) {
      console.error('Error al buscar la canción:', error);
      setError('Hubo un problema al buscar la canción.');
    }
  };

  const seleccionarCancion = (cancion: { title: string; textoCancion: string }) => {
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
        <TouchableOpacity style={styles.butonCarga} onPress={buscarOCancelar}>
          <Text style={styles.butonText}>
            {tituloCancion ? 'Volver a Inicio' : 'Buscar Canción'}
          </Text>
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
        ) : null}

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
