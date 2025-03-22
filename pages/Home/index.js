import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Componente principal da tela inicial
export default function Home({ navigation }) {
    return (
        <View style={styles.container}>
            {/* Exibe o título "Bem-vindo!" */}
            <Text style={styles.title}>Bem-vindo!</Text>

            {/* Botão para navegar para a página PageButton */}
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PageButton')}>
                <Text style={styles.buttonText}>Ir para PageButton</Text>
            </TouchableOpacity>

            {/* Botão para navegar para a página PageList */}
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PageList')}>
                <Text style={styles.buttonText}>Ir para PageList</Text>
            </TouchableOpacity>
        </View>
    );
}

// Estilos para a tela inicial
const styles = StyleSheet.create({
    container: {
        flex: 1, // Ocupa todo o espaço disponível
        justifyContent: 'center', // Centraliza o conteúdo verticalmente
        alignItems: 'center', // Centraliza o conteúdo horizontalmente
    },
    title: {
        fontSize: 20,
        marginBottom: 20, // Espaço abaixo do título
    },
    button: {
        width: 200,
        height: 50,
        backgroundColor: '#007BFF', // Cor azul
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5, // Bordas arredondadas
        marginBottom: 10, // Espaço entre os botões
    },
    buttonText: {
        color: '#fff', 
        fontSize: 16,
    },
});