import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

// Página que exibe botões para acessar imagens e renderiza WebView
export default function PageButton() {
    const [images, setImages] = useState([]); // Lista de imagens do servidor
    const [selectedImage, setSelectedImage] = useState(null); // Imagem selecionada
    const [isWebViewActive, setIsWebViewActive] = useState(false); // Controle do scroll

    useEffect(() => {
        // Busca a lista de imagens no servidor usando localhost
        fetch('http://192.168.2.111:3333/list-images') //Trocando pelo meu ip da rede para funcionar no expo go 
        //fetch('http://localhost:3333/list-images')
            .then((response) => response.json())
            .then((data) => setImages(data))
            .catch((error) => console.error('Erro ao buscar imagens:', error));
    }, []);

    // Alterna entre exibir e ocultar uma imagem selecionada
    const toggleImage = (image) => {
        if (selectedImage === image) {
            setSelectedImage(null); // Deselect
        } else {
            setSelectedImage(image); // Select
        }
    };

    return (
        <ScrollView
            style={styles.container}
            scrollEnabled={!isWebViewActive} // Permite/desabilita scroll dependendo da interação com WebView
        >
            {images.map((image, index) => (
                <View key={index} style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={() => toggleImage(image)}
                        style={styles.button}
                    >
                        {/* Exibe o nome da imagem */}
                        <Text style={styles.buttonText}>{image}</Text>
                    </TouchableOpacity>
                    {/* Renderiza a imagem selecionada em uma WebView */}
                    {selectedImage === image && (
                        <WebView
                            source={{ uri: `http://192.168.2.111:3333/?image=${image}` }} //Trocando pelo meu ip da rede para funcionar no expo go
                            //source={{ uri: `http://localhost:3333/?image=${image}` }}
                            style={styles.webview}
                            scrollEnabled={false} // Desativa scroll interno do WebView
                            onTouchStart={() => setIsWebViewActive(true)} // Controla o scroll geral
                            onTouchEnd={() => setIsWebViewActive(false)}
                        />
                    )}
                </View>
            ))}
        </ScrollView>
    );
}

// Estilos para a tela de botões
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8', // Fundo claro
    },
    buttonContainer: {
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    webview: {
        height: 300, // Altura fixa para o WebView
        marginVertical: 10,
    },
});