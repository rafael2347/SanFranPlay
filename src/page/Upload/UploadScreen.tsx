import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  StyleSheet,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../config/conexionBd';

const UploadScreen = () => {
  const [title, setTitle] = useState('');
  const [number, setNumber] = useState('');
  const [textoCancion, setTextoCancion] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleUploadPost = async () => {
    if (!title.trim() || !number.trim() || !textoCancion.trim()) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    setUploading(true);

    try {
      const newCancion = {
        title: title.trim(),
        // Convertimos a número para que coincida con la consulta en HomeScreen
        numeroCancion: Number(number.trim()),
        textoCancion: textoCancion.trim(),
        created_at: new Date().toISOString()
      };

      await addDoc(collection(db, 'canciones'), newCancion);

      Alert.alert('Éxito', 'Canción subida con éxito.');
      setTitle('');
      setNumber('');
      setTextoCancion('');
    } catch (error: any) {
      console.error('Error al subir la canción:', error);
      Alert.alert('Error', `Hubo un problema al subir la canción: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <Text style={styles.title}>Añadir Canción</Text>
          <TextInput
            style={styles.input}
            placeholder="Número de la canción"
            keyboardType="numeric"
            value={number}
            onChangeText={setNumber}
          />
          <TextInput
            style={styles.input}
            placeholder="Título de la canción"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.textArea}
            placeholder="Descripción de la canción"
            multiline
            numberOfLines={4}
            value={textoCancion}
            onChangeText={setTextoCancion}
          />
          <TouchableOpacity
            style={[styles.uploadButton, uploading && styles.uploadButtonDisabled]}
            onPress={handleUploadPost}
            disabled={uploading}
          >
            {uploading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.uploadButtonText}>Subir Canción</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  scrollContent: {
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: 'bold',
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  textArea: {
    height: 500,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    textAlignVertical: 'top',
  },
  uploadButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 16,
  },
  uploadButtonDisabled: {
    backgroundColor: '#ccc',
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});


export default UploadScreen;
