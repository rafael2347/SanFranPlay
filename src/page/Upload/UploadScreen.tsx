import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, Alert, Keyboard, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../config/conexionBd';

const UploadScreen = () => {
  const [title, setTitle] = useState('');
  const [number, setNumber] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handlePickImage = async () => {
    Alert.alert('Seleccionar Imagen', 'Elige una opción', [
      { text: 'Tomar Foto', onPress: handleTakePhoto },
      { text: 'Seleccionar de Galería', onPress: handleSelectFromGallery },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  const handleSelectFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitas permisos para acceder a la galería.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3], // Relación de aspecto para evitar bordes
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitas permisos para usar la cámara.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3], // Relación de aspecto para evitar bordes
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleUploadPost = async () => {
    if (!title.trim() || !number.trim()) {
      Alert.alert('Error', 'Por favor, ingresa el título y número de la canción.');
      return;
    }

    setUploading(true);
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      Alert.alert('Error', 'Debes estar autenticado para subir una publicación.');
      setUploading(false);
      return;
    }

    try {
      let imageUrl = null;
      if (image) {
        const response = await fetch(image);
        const blob = await response.blob();
        const storage = getStorage();
        const storageRef = ref(storage, `songs/${user.uid}/${Date.now()}.jpg`);
        await uploadBytes(storageRef, blob);
        imageUrl = await getDownloadURL(storageRef);
      }

      const songsCollection = collection(db, 'songs');
      await addDoc(songsCollection, {
        title,
        number,
        image: imageUrl,
        createdAt: Timestamp.now(),
        userId: user.uid,
      });

      Alert.alert('Éxito', 'Canción subida con éxito');
      setTitle('');
      setNumber('');
      setImage(null);
    } catch (error) {
      console.error('Error al subir la canción:', error);
      const errorMessage = (error as Error).message;
      Alert.alert('Error', `Hubo un problema al subir la canción: ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>Añadir Canción</Text>
        <TextInput
          style={styles.input}
          placeholder="Título de la canción"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Número de la canción"
          keyboardType="numeric"
          value={number}
          onChangeText={setNumber}
        />
        <TouchableOpacity style={styles.button} onPress={handlePickImage}>
          <Text style={styles.buttonText}>Seleccionar Imagen</Text>
        </TouchableOpacity>
        {image && <Image source={{ uri: image }} style={styles.image} />}
        <TouchableOpacity style={styles.uploadButton} onPress={handleUploadPost} disabled={uploading}>
          <Text style={styles.uploadButtonText}>
            {uploading ? 'Subiendo...' : 'Subir Canción'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
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
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginVertical: 16,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  uploadButton: {
    backgroundColor: '#aec4db',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 16,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default UploadScreen;
