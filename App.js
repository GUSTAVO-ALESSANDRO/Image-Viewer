import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './pages/Home';
import PageButton from './pages/PageButton';
import PageList from './pages/PageList';

// Configura o stack de navegação
const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            {/* Stack Navigator gerencia as rotas */}
            <Stack.Navigator>
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="PageButton" component={PageButton} />
                <Stack.Screen name="PageList" component={PageList} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}