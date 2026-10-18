import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './src/screens/home';
import FormLogin from './src/screens/form_login';
import FormCadastro from './src/screens/form_cadastro';
import ListarSala from './src/screens/listar_sala';
import FormNovaSala from './src/screens/form_nova_sala';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={Home} />

        <Stack.Screen name="form_login" component={FormLogin} />

        <Stack.Screen name="form_cadastro" component={FormCadastro} />

        <Stack.Screen name="listar_sala" component={ListarSala} />

        <Stack.Screen name="form_nova_sala" component={FormNovaSala} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
