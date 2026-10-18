import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions,} from "react-native";

const { width } = Dimensions.get("window");

export default function Header({
  onMenuPress,
  onProfilePress,
  perfilAberto = false,
}) {
  return (
    <View style={styles.header}>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={onMenuPress}
        activeOpacity={0.7}
      >
        <Text style={styles.menuIcon}>☰</Text>
      </TouchableOpacity>

      <View style={styles.perfilContainer}>
        <TouchableOpacity
          style={[
            styles.perfilButton,
            perfilAberto && styles.perfilButtonAtivo,
          ]}
          onPress={onProfilePress}
          activeOpacity={0.8}
        >
          <Image
            style={styles.fotoPerfil}
            source={{
              uri: "https://bkpsitecpsnew.blob.core.windows.net/uploadsitecps/sites/197/2024/12/centro-paula-souza.jpg",
            }}
          />
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 65,
    width: "100%",
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: width < 400 ? 8 : 15,
    elevation: 4,
    zIndex: 20,
  },

  menuButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },

  menuIcon: {
    fontSize: 30,
    color: "#1a237e",
    fontWeight: "bold",
    lineHeight: 34,
  },

  perfilContainer: {
    position: "relative",
    zIndex: 100,
  },

  perfilButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  perfilButtonAtivo: {
    backgroundColor: "#eef0ff",
  },

  fotoPerfil: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
