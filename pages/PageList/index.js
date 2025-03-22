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
        //fetch('http://localhost:8000/list-images')
        fetch('http://192.168.2.110:8000/list-images') //Trocando pelo meu ip da rede para funcionar no expo go 
            .then((response) => response.json())
            .then((data) => {
                setImages(data);
                if (data.length > 0) {
                    setSelectedImage(data[0]); // Define a primeira imagem como padrão
                }
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
                {images.map((image, index) => (
                    <Picker.Item key={index} label={image} value={image} />
                ))}
            </Picker>

            {/* Renderiza a imagem selecionada em uma WebView */}
            {selectedImage && (
                <WebView
                    source={{ uri: `http://192.168.2.110:8000/?image=${selectedImage}` }} //Trocando pelo meu ip da rede para funcionar no expo go 
                    //source={{ uri: `http://localhost:8000/?image=${selectedImage}` }}
                    style={styles.webview}
                />
            )}
        </View>
    );
}

// Estilos para a tela com Picker
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
    },
    picker: {
        height: 50,
        width: '100%',
        backgroundColor: '#ddd', // Cor de fundo cinza claro
        borderRadius: 5,
    },
    webview: {
        flex: 1,
        marginVertical: 10,
    },
});