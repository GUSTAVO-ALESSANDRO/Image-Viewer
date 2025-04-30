import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { WebView } from 'react-native-webview';

// Página que permite selecionar imagens usando Picker
export default function PageList() {
  const [images, setImages] = useState([]); // Lista de imagens
  const [selectedImage, setSelectedImage] = useState(null); // Imagem selecionada

  useEffect(() => {
    // Busca as imagens no servidor
    fetch('http://192.168.2.111:3333/list-images') // Trocando pelo meu IP da rede para funcionar no Expo Go
      .then((response) => response.json())
      .then((data) => {
        setImages(data);
        // Não definimos nenhuma imagem padrão para iniciar com "Selecione uma imagem..."
      })
      .catch((error) => console.error('Erro ao buscar imagens:', error));
  }, []);

  return (
    <View style={styles.container}>
      {/* Título da página */}
      <Text style={styles.title}>Selecione uma Imagem</Text>

      {/* Picker para exibição da lista de imagens */}
      <Picker
        selectedValue={selectedImage}
        onValueChange={(itemValue) => setSelectedImage(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Selecione uma imagem..." value={null} />
        {images.map((image, index) => (
          <Picker.Item key={index} label={image} value={image} />
        ))}
      </Picker>

      {/* Exibe uma mensagem ou a imagem selecionada na WebView */}
      {selectedImage ? (
        <WebView
          source={{ uri: `http://192.168.2.111:3333/?image=${selectedImage}` }}
          style={styles.webview}
        />
      ) : (
        <Text style={styles.placeholderText}>Nenhuma imagem selecionada</Text>
      )}
    </View>
  );
}

// Estilos para a tela com Picker
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8', // Fundo claro
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  picker: {
    height: 55,
    width: '100%',
    backgroundColor: '#ddd', // Fundo cinza claro
    borderRadius: 5,
  },
  webview: {
    flex: 1,
    marginVertical: 10,
  },
  placeholderText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
    marginTop: 20,
  },
});
