import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView,
} from 'react-native';

import * as Crypto from 'expo-crypto';
import { storage } from './storage';

const CHAVE_USUARIOS = 'usuarios';

export default function FormLogin({ navigation }) {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const mostrarErro = (mensagem) => {
    setErro(`❌ ${mensagem}`);
  };

  const entrar = async () => {
    const loginDigitado = login.trim().toLowerCase();
    const senhaDigitada = senha;

    setErro('');

    if (!loginDigitado || !senhaDigitada.trim()) {
      mostrarErro('Preencha o e-mail e a senha!');
      return;
    }

    setCarregando(true);

    try {
      const usuariosSalvos = storage.getString(CHAVE_USUARIOS);

      if (!usuariosSalvos) {
        mostrarErro('Nenhum usuário cadastrado!');
        return;
      }

      let usuarios;

      try {
        usuarios = JSON.parse(usuariosSalvos);
      } catch {
        mostrarErro('Os dados dos usuários estão inválidos!');
        return;
      }

      if (!Array.isArray(usuarios)) {
        mostrarErro('Os dados dos usuários estão inválidos!');
        return;
      }

      const usuario = usuarios.find(
        (item) =>
          item.email?.toLowerCase() === loginDigitado
      );

      if (!usuario) {
        mostrarErro('Usuário não cadastrado!');
        return;
      }

      if (!usuario.senhaSalt || !usuario.senhaHash) {
        mostrarErro('Este cadastro não possui credenciais válidas.');
        return;
      }

      const senhaHash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        `${usuario.senhaSalt}:${senhaDigitada}`
      );

      if (senhaHash !== usuario.senhaHash) {
        mostrarErro('Senha incorreta!');
        return;
      }

      setLogin('');
      setSenha('');

      if (usuario.tipo === 'escola') {
        navigation.navigate('ListarSala');
      } else {
        navigation.navigate('ListarSala');
      }
    } catch (error) {
      console.error('Erro ao realizar login:', error);
      mostrarErro('Não foi possível realizar o login!');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('Home')}
            disabled={carregando}
          >
            <Text style={styles.backButtonText}>
              ← Voltar para Home
            </Text>
          </TouchableOpacity>

          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: 'https://img.icons8.com/?size=100&id=TDMY9h1UHdNW&format=png&color=000000',
              }}
              style={styles.image}
            />

            <Text style={styles.welcome}>
              Bem-vindo a CLAEX!
            </Text>
          </View>

          <Text style={styles.title}>CLAEX</Text>

          <Text style={styles.subtitle}>
            Entre com seus dados para continuar
          </Text>

          <Text style={styles.label}>E-mail</Text>

          <TextInput
            style={[
              styles.input,
              erro !== '' && styles.inputError,
            ]}
            placeholder="Digite seu e-mail"
            placeholderTextColor="#999"
            value={login}
            onChangeText={(text) => {
              setLogin(text);
              setErro('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!carregando}
          />

          <Text style={styles.label}>Senha</Text>

          <TextInput
            style={[
              styles.input,
              erro !== '' && styles.inputError,
            ]}
            placeholder="Digite sua senha"
            placeholderTextColor="#999"
            value={senha}
            onChangeText={(text) => {
              setSenha(text);
              setErro('');
            }}
            secureTextEntry
            autoCapitalize="none"
            editable={!carregando}
          />

          {erro !== '' && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{erro}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.submit,
              carregando && styles.submitDisabled,
            ]}
            onPress={entrar}
            disabled={carregando}
          >
            {carregando ? (
              <>
                <ActivityIndicator
                  color="#fff"
                  size="small"
                />

                <Text style={styles.submitText}>
                  Verificando...
                </Text>
              </>
            ) : (
              <Text style={styles.submitText}>Entrar</Text>
            )}
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>
              Não possui uma conta?
            </Text>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate('form_cadastro')
              }
              disabled={carregando}
            >
              <Text style={styles.registerLink}>
                Clique aqui
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },

  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },

  formContainer: {
    width: '100%',
    maxWidth: 450,
    alignSelf: 'center',
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
    paddingVertical: 5,
  },

  backButtonText: {
    color: '#1a237e',
    fontSize: 15,
    fontWeight: 'bold',
  },

  imageContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },

  image: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 10,
  },

  welcome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1a237e',
    textAlign: 'center',
    marginBottom: 5,
  },

  subtitle: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginBottom: 25,
  },

  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 7,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#222',
    backgroundColor: '#fafafa',
    marginBottom: 15,
  },

  inputError: {
    borderColor: '#e74c3c',
    backgroundColor: '#fff8f7',
  },

  errorBox: {
    backgroundColor: '#fdecea',
    borderWidth: 1,
    borderColor: '#e74c3c',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },

  errorText: {
    color: '#c0392b',
    fontSize: 14,
    textAlign: 'center',
  },

  submit: {
    height: 52,
    backgroundColor: '#1a237e',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },

  submitDisabled: {
    opacity: 0.6,
  },

  submitText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },

  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },

  registerText: {
    color: '#666',
    fontSize: 14,
  },

  registerLink: {
    color: '#1a237e',
    fontWeight: 'bold',
    marginLeft: 5,
    fontSize: 14,
  },
});
