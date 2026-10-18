import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, FlatList, Image, Alert, ActivityIndicator, Dimensions} from "react-native";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from './components/Footer';

const API_URL = "https://lolooo-production.up.railway.app";

const { width } = Dimensions.get("window");

export default function ListarSala({ navigation }) {
  const [menuAberto, setMenuAberto] = useState(false);
  const [perfilAberto, setPerfilAberto] = useState(false);
  const [salas, setSalas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  async function listarSalas() {
    try {
      setCarregando(true);

      const response = await fetch(`${API_URL}/salas/listar`);

      if (!response.ok) {
        throw new Error("Erro ao buscar salas");
      }

      const dados = await response.json();

      setSalas(dados);
    } catch (error) {
      console.error(error);

      Alert.alert(
        "Erro",
        "Não foi possível carregar as salas."
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    listarSalas();
  }, []);

  function abrirSala(sala) {
    Alert.alert(
      "Sala selecionada",
      `Você selecionou: ${sala.nome_sala}`
    );
  }

  function abrirMenu() {
    setPerfilAberto(false);
    setMenuAberto(true);
  }

  function fecharMenu() {
    setMenuAberto(false);
  }

  function abrirPerfil() {
    setMenuAberto(false);
    setPerfilAberto(!perfilAberto);
  }

  function sair() {
    setPerfilAberto(false);

    Alert.alert(
      "Sair",
      "Deseja realmente sair da sua conta?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sair",
          style: "destructive",
          onPress: () => {
            navigation.navigate("form_login");
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.container}>

      <Header
        onMenuPress={abrirMenu}
        onProfilePress={abrirPerfil}
        perfilAberto={perfilAberto}
      />

      {menuAberto && (
        <Sidebar
          navigation={navigation}
          onClose={fecharMenu}
        />
      )}

      {perfilAberto && (
        <View style={styles.menuPerfil}>

          <View style={styles.perfilCabecalho}>

            <Image
              style={styles.fotoPerfilGrande}
              source={{
                uri: "https://bkpsitecpsnew.blob.core.windows.net/uploadsitecps/sites/197/2024/12/centro-paula-souza.jpg",
              }}
            />

            <View style={styles.perfilInfo}>

              <Text style={styles.perfilNome}>
                Meu Perfil
              </Text>

              <Text style={styles.perfilSubtitulo}>
                Conta CLAEX
              </Text>

            </View>

          </View>

          <View style={styles.divisor} />

          <TouchableOpacity
            style={styles.perfilItem}
            onPress={() => {
              setPerfilAberto(false);

              Alert.alert(
                "Meu perfil",
                "Aqui você poderá visualizar seu perfil."
              );
            }}
          >
            <View style={styles.perfilIcone}>
              <Text style={styles.iconeTexto}>
                👤
              </Text>
            </View>

            <View style={styles.perfilItemTexto}>

              <Text style={styles.perfilTitulo}>
                Ver perfil
              </Text>

              <Text style={styles.perfilDescricao}>
                Visualizar seus dados
              </Text>

            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.perfilItem}
            onPress={() => {
              setPerfilAberto(false);

              Alert.alert(
                "Configurações",
                "Aqui você poderá alterar as configurações da conta."
              );
            }}
          >
            <View style={styles.perfilIcone}>
              <Text style={styles.iconeTexto}>
                ⚙️
              </Text>
            </View>

            <View style={styles.perfilItemTexto}>

              <Text style={styles.perfilTitulo}>
                Configurações
              </Text>

              <Text style={styles.perfilDescricao}>
                Configurar sua conta
              </Text>

            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.perfilItem,
              styles.itemSair,
            ]}
            onPress={sair}
          >
            <View
              style={[
                styles.perfilIcone,
                styles.iconeSair,
              ]}
            >
              <Text style={styles.iconeTexto}>
                🚪
              </Text>
            </View>

            <View style={styles.perfilItemTexto}>

              <Text
                style={[
                  styles.perfilTitulo,
                  styles.textoSair,
                ]}
              >
                Sair
              </Text>

              <Text style={styles.perfilDescricao}>
                Encerrar sessão
              </Text>

            </View>
          </TouchableOpacity>

        </View>
      )}

      <View style={styles.painel}>

        <Image
          style={styles.logo}
          source={{
            uri: "https://bkpsitecpsnew.blob.core.windows.net/uploadsitecps/sites/197/2024/12/centro-paula-souza.jpg",
          }}
        />

        <View style={styles.painelTexto}>

          <Text style={styles.ola}>
            Olá
          </Text>

          <Text style={styles.info}>
            Professores:
          </Text>

          <Text style={styles.info}>
            Salas: {salas.length}
          </Text>

        </View>

      </View>

      <View style={styles.conteudo}>

        <View style={styles.tituloContainer}>

          <Text style={styles.titulo}>
            Escolha uma sala
          </Text>

          <TouchableOpacity
            style={styles.botaoNovaSala}
            onPress={() =>
              navigation.navigate("form_nova_sala")
            }
          >
            <Text style={styles.botaoTexto}>
              + nova sala
            </Text>
          </TouchableOpacity>

        </View>

        {carregando ? (

          <ActivityIndicator
            size="large"
            color="#d71920"
            style={styles.loading}
          />

        ) : salas.length === 0 ? (

          <Text style={styles.semSalas}>
            Nenhuma sala cadastrada.
          </Text>

        ) : (

          <FlatList
            data={salas}
            keyExtractor={(item) =>
              String(item.id_sala)
            }
            contentContainerStyle={styles.lista}
            renderItem={({ item }) => (

              <TouchableOpacity
                style={styles.caixaSala}
                onPress={() =>
                  abrirSala(item)
                }
              >
                <Text style={styles.nomeSala}>
                  {item.nome_sala}
                </Text>
              </TouchableOpacity>

            )}
          />

        )}

      </View>

      <Footer />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
  },

  menuPerfil: {
    position: "absolute",
    top: 75,
    right: 15,
    width: Math.min(width - 30, 300),

    backgroundColor: "#ffffff",
    borderRadius: 14,

    paddingVertical: 8,

    elevation: 20,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,

    zIndex: 2000,
  },

  perfilCabecalho: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 14,
  },

  fotoPerfilGrande: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },

  perfilInfo: {
    marginLeft: 12,
    flex: 1,
  },

  perfilNome: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1a237e",
  },

  perfilSubtitulo: {
    fontSize: 13,
    color: "#777",
    marginTop: 3,
  },

  divisor: {
    height: 1,
    backgroundColor: "#eeeeee",
    marginHorizontal: 12,
  },

  perfilItem: {
    minHeight: 65,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 8,
  },

  perfilIcone: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#eef0ff",
    alignItems: "center",
    justifyContent: "center",
  },

  iconeSair: {
    backgroundColor: "#fdecea",
  },

  iconeTexto: {
    fontSize: 19,
  },

  perfilItemTexto: {
    flex: 1,
    marginLeft: 12,
  },

  perfilTitulo: {
    color: "#333",
    fontSize: 15,
    fontWeight: "bold",
  },

  perfilDescricao: {
    color: "#888",
    fontSize: 12,
    marginTop: 3,
  },

  itemSair: {
    marginTop: 2,
  },

  textoSair: {
    color: "#d71920",
  },

  painel: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },

  logo: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },

  painelTexto: {
    marginLeft: 20,
    flex: 1,
  },

  ola: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a237e",
    marginBottom: 8,
  },

  info: {
    fontSize: 16,
    color: "#333",
    marginTop: 4,
  },

  conteudo: {
    flex: 1,
    paddingHorizontal: 15,
  },

  tituloContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 15,
  },

  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1a237e",
    flex: 1,
  },

  botaoNovaSala: {
    backgroundColor: "#5765ff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    elevation: 2,
  },

  botaoTexto: {
    color: "#fff",
    fontWeight: "bold",
  },

  lista: {
    paddingBottom: 20,
  },

  caixaSala: {
    backgroundColor: "#1a237e",
    minHeight: 70,
    borderRadius: 12, 
    justifyContent: "center",
    paddingHorizontal: 20,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },

  nomeSala: {
    color: "#fff",
    fontSize: 19,
    fontWeight: "bold",
  },

  loading: {
    marginTop: 30,
  },

  semSalas: {
    textAlign: "center",
    marginTop: 30,
    color: "#777",
    fontSize: 16,
  },
});