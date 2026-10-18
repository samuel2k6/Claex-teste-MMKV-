import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions,} from "react-native";

const { width } = Dimensions.get("window");

export default function Sidebar({
  navigation,
  onClose,
}) {
  return (
    <>-
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      />

      <View style={styles.menu}>

        <TouchableOpacity
          style={styles.fecharMenu}
          onPress={onClose}
        >
          <Text style={styles.fecharTexto}>
            ✕
          </Text>
        </TouchableOpacity>

        <Text style={styles.titulo}>
          Menu
        </Text>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            onClose();
            navigation.navigate("Home");
          }}
        >
          <Text style={styles.menuTexto}>
            🏠 Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            onClose();
            navigation.navigate("listar_sala");
          }}
        >
          <Text style={styles.menuTexto}>
            📚 Salas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            onClose();
            navigation.navigate("form_login");
          }}
        >
          <Text style={styles.menuTexto}>
            🔑 Login
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            onClose();
            navigation.navigate("form_nova_sala");
          }}
        >
          <Text style={styles.menuTexto}>
            ➕ Nova sala
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            onClose();

            alert("Configurações da sala.");
          }}
        >
          <Text style={styles.menuTexto}>
            ⚙️ Config sala
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            onClose();

            alert("Tabela de professores.");
          }}
        >
          <Text style={styles.menuTexto}>
            👥 Tabela de profs
          </Text>
        </TouchableOpacity>

      </View>
    </>
  );
}

const styles = StyleSheet.create({

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    backgroundColor: "rgba(0, 0, 0, 0.30)",

    zIndex: 1000,
  },

  menu: {
    position: "absolute",

    top: 0,
    bottom: 0,
    left: 0,

    width: Math.min(width * 0.82, 300),

    backgroundColor: "#ffffff",

    paddingTop: 45,
    paddingHorizontal: 20,

    elevation: 20,

    shadowColor: "#000",
    shadowOffset: {
      width: 4,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,

    zIndex: 1100,
  },

  fecharMenu: {
    alignSelf: "flex-end",
    padding: 10,
  },

  fecharTexto: {
    fontSize: 25,
    color: "#1a237e",
    fontWeight: "bold",
  },

  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1a237e",

    marginTop: 10,
    marginBottom: 20,
  },

  menuItem: {
    paddingVertical: 18,

    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
  },

  menuTexto: {
    fontSize: 17,
    color: "#333",
  },
});
