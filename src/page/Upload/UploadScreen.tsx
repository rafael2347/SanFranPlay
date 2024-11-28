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
import { supabase } from '../../config/conexionBd';

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
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permiso denegado', 'Debes otorgar permisos para acceder a la galería.');
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Cambiado aquí para usar MediaTypeOptions
      allowsEditing: true,
      quality: 1,
    });
  
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  
  const handleTakePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permiso denegado', 'Debes otorgar permisos para usar la cámara.');
      return;
    }
  
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Cambiado aquí para usar MediaTypeOptions
      allowsEditing: true,
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

    try {
      let imageUrl = null;

      if (image) {
        if (!image.startsWith('file://')) {
          throw new Error('La URI de la imagen no es válida.');
        }

        const response = await fetch(image);
        const blob = await response.blob();

        // Verificamos que el blob tenga contenido
        if (!blob || blob.size === 0) {
          throw new Error('El archivo de imagen está vacío o no es válido.');
        }

        const fileName = `img/${Date.now()}.jpg`;

        const { error: uploadError } = await supabase.storage
          .from('canciones')
          .upload(fileName, blob, {
            contentType: 'image/jpeg',
          });

        if (uploadError) {
          throw new Error(`Error al subir la imagen: ${uploadError.message}`);
        }

        const { data: publicUrlData } = supabase.storage
          .from('canciones')
          .getPublicUrl(fileName);

        if (!publicUrlData?.publicUrl) {
          throw new Error('Error al obtener la URL pública de la imagen.');
        }

        imageUrl = publicUrlData.publicUrl;
      }

      const { error: insertError } = await supabase
        .from('canciones')
        .insert({
          title: title.trim(),
          number: number.trim(),
          image: imageUrl,
          created_at: new Date().toISOString(),
        });

      if (insertError) {
        throw insertError;
      }

      Alert.alert('Éxito', 'Canción subida con éxito.');
      setTitle('');
      setNumber('');
      setImage(null);
    } catch (error: any) {
      console.error('Error al subir la canción:', error.message);
      Alert.alert('Error', `Hubo un problema al subir la canción: ${error.message}`);
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
    height: 300,
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
