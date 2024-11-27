import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../config/conexionBd';  // Asegúrate de que la ruta a la configuración de Firebase esté correcta

const UploadScreen = () => {
  const [title, setTitle] = useState('');
  const [number, setNumber] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Función para seleccionar una imagen (de la galería o cámara)
  const handlePickImage = async () => {
    Alert.alert('Seleccionar Imagen', 'Elige una opción', [
      { text: 'Tomar Foto', onPress: handleTakePhoto },
      { text: 'Seleccionar de Galería', onPress: handleSelectFromGallery },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  // Función para seleccionar una imagen desde la galería
  const handleSelectFromGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        'Permiso denegado',
        'Debes otorgar permisos para acceder a la galería. Ve a configuración.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1, // Calidad máxima
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Función para tomar una foto con la cámara
  const handleTakePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        'Permiso denegado',
        'Debes otorgar permisos para usar la cámara. Ve a configuración.'
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9], // Relación de aspecto panorámica
      quality: 1, // Calidad máxima
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Función para subir la canción
  const handleUploadPost = async () => {
    // Verificar si los campos están vacíos
    if (!title.trim() || !number.trim()) {
      Alert.alert('Error', 'Por favor, ingresa el título y número de la canción.');
      return;
    }

    setUploading(true);

    try {
      let imageUrl = null;

      // Subir imagen a Firebase Storage
      if (image) {
        const response = await fetch(image);
        const blob = await response.blob();
        const storage = getStorage();
        const storageRef = ref(storage, `canciones/${Date.now()}.jpg`);
        const uploadTask = await uploadBytes(storageRef, blob);
        imageUrl = await getDownloadURL(uploadTask.ref);  // Obtener URL de la imagen
      }

      // Subir la canción a la colección 'canciones' en Firestore
      const cancionesCollection = collection(db, 'canciones');
      await addDoc(cancionesCollection, {
        title: title.trim(),
        number: number.trim(),
        image: imageUrl,  // Guardar URL de la imagen si existe
        createdAt: Timestamp.now(),  // Añadir fecha de creación
      });

      // Limpiar campos después de la subida
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
        {image && <Image source={{ uri: image }} style={styles.largeImage} />}
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
  largeImage: {
    width: '100%',
    height: 300, // Tamaño más grande
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
