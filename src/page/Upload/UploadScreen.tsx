import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';


const UploadScreen = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Busca y carga una imagen</Text>
      <Button title="Buscar imagen"  />
      {selectedImage && (
        <Image
          source={{ uri: selectedImage }}
          style={styles.image}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 18,
    marginBottom: 16,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 16,
    borderRadius: 8,
  },
});

export default UploadScreen;
