import { Alert, Platform } from 'react-native';

export const mostrarAlerta = (titulo, mensagem) => {
  if (Platform.OS === 'web') {
    window.alert(`${titulo}\\n\\n${mensagem}`);
    return;
  }
  Alert.alert(titulo, mensagem);
};