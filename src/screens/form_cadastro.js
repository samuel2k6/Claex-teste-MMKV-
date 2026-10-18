import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView,
} from 'react-native';

import * as Crypto from 'expo-crypto';
import { storage } from '.src/storage/storage';

const CHAVE_USUARIOS = 'usuarios';

export default function Cadastro({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [tipo, setTipo] = useState('escola');

  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const cadastrar = async () => {
    setErro('');

    const nomeDigitado = nome.trim();
    const emailDigitado = email.trim().toLowerCase();
    const senhaDigitada = senha;

    if (
      !nomeDigitado ||
      !emailDigitado ||
      !senhaDigitada.trim()
    ) {
      setErro('Preencha todos os campos!');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailDigitado)) {
      setErro('Digite um e-mail válido!');
      return;
    }

    if (senhaDigitada.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres!');
      return;
    }

    setCarregando(true);

    try {
      // Recupera os usuários do storage.js.
      const usuariosSalvos = storage.getString(CHAVE_USUARIOS);

      let usuarios = [];

      try {
        usuarios = usuariosSalvos
          ? JSON.parse(usuariosSalvos)
          : [];
      } catch {
        setErro('Não foi possível ler os usuários salvos.');
        return;
      }

      if (!Array.isArray(usuarios)) {
        setErro('Os dados dos usuários estão inválidos.');
        return;
      }

      // Verifica se o e-mail já está cadastrado.
      const emailExiste = usuarios.some(
        (usuario) => usuario.email === emailDigitado
      );

      if (emailExiste) {
        setErro('Este e-mail já está cadastrado!');
        return;
      }

      // Gera um salt exclusivo e o hash da senha.
      const salt = Crypto.randomUUID();

      const senhaHash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        `${salt}:${senhaDigitada}`
      );

      const novoUsuario = {
        id: Crypto.randomUUID(),
        nome: nomeDigitado,
        email: emailDigitado,
        senhaSalt: salt,
        senhaHash,
        tipo,
        criadoEm: new Date().toISOString(),
      };

      usuarios.push(novoUsuario);

      storage.set(CHAVE_USUARIOS, JSON.stringify(usuarios));

      setNome('');
      setEmail('');
      setSenha('');

      if (tipo === 'escola') {
        navigation.navigate('ListarSala');
      } else {
        navigation.navigate('Login');
      }
    } catch (error) {
      console.error('Erro ao salvar cadastro:', error);
      setErro('Não foi possível salvar o cadastro no dispositivo!');
    } finally {
      setCarregando(false);
    }
  };

  const selecionarTipo = (novoTipo) => {
    setTipo(novoTipo);
    setErro('');
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

          <Text style={styles.title}>Criar conta</Text>

          <Text style={styles.subtitle}>
            Preencha seus dados para cadastrar
          </Text>

          <Text style={styles.label}>Nome</Text>

          <TextInput
            style={styles.input}
            placeholder="Digite seu nome"
            placeholderTextColor="#999"
            value={nome}
            onChangeText={(text) => {
              setNome(text);
              setErro('');
            }}
            editable={!carregando}
            autoCapitalize="words"
          />

          <Text style={styles.label}>E-mail</Text>

          <TextInput
            style={styles.input}
            placeholder="Digite seu e-mail"
            placeholderTextColor="#999"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setErro('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!carregando}
          />

          <Text style={styles.label}>Senha</Text>

          <TextInput
            style={styles.input}
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

          <Text style={styles.label}>Tipo de usuário</Text>

          <View style={styles.tipoContainer}>
            {[
              { valor: 'escola', texto: 'Escola' },
              { valor: 'professor', texto: 'Professor' },
              { valor: 'aluno', texto: 'Aluno' },
            ].map((item) => (
              <TouchableOpacity
                key={item.valor}
                style={[
                  styles.tipoButton,
                  tipo === item.valor && styles.tipoSelecionado,
                ]}
                onPress={() => selecionarTipo(item.valor)}
                disabled={carregando}
              >
                <Text
                  style={[
                    styles.tipoText,
                    tipo === item.valor && styles.tipoTextSelecionado,
                  ]}
                >
                  {item.texto}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

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
            onPress={cadastrar}
            disabled={carregando}
          >
            {carregando ? (
              <>
                <ActivityIndicator color="#fff" size="small" />
                <Text style={styles.submitText}>Salvando...</Text>
              </>
            ) : (
              <Text style={styles.submitText}>Cadastrar</Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>
              Já possui uma conta?
            </Text>

            <TouchableOpacity
              onPress={() => navigation.navigate('form_login')}
              disabled={carregando}
            >
              <Text style={styles.loginLink}>Entrar</Text>
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
    shadowOffset: { width: 0, height: 3 },
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

  tipoContainer: {
    gap: 8,
    marginBottom: 15,
  },

  tipoButton: {
    height: 45,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },

  tipoSelecionado: {
    backgroundColor: '#1a237e',
    borderColor: '#1a237e',
  },

  tipoText: {
    color: '#444',
    fontSize: 15,
  },

  tipoTextSelecionado: {
    color: '#fff',
    fontWeight: 'bold',
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

  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },

  loginText: {
    color: '#666',
    fontSize: 14,
  },

  loginLink: {
    color: '#1a237e',
    fontWeight: 'bold',
    marginLeft: 5,
    fontSize: 14,
  },
});
