import React from "react";
import { View, Text, StyleSheet,} from "react-native";

export default function Footer() {
  return (
    <View style={styles.footer}>

      <Text style={styles.footerMarca}>
        CLAEX
      </Text>

      <View style={styles.footerColunas}>

        <View style={styles.footerColuna}>
          <Text style={styles.footerTitulo}>
            Sobre
          </Text>

          <Text style={styles.footerLink}>
            Quem Somos
          </Text>

          <Text style={styles.footerLink}>
            Contato
          </Text>
        </View>

        <View style={styles.footerColuna}>
          <Text style={styles.footerTitulo}>
            Legal
          </Text>

          <Text style={styles.footerLink}>
            Termos de Uso
          </Text>

          <Text style={styles.footerLink}>
            Política de Privacidade
          </Text>
        </View>

      </View>

      <Text style={styles.footerBottom}>
        © 2025 CLAEX. Todos os direitos reservados.
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    width: "100%",
    backgroundColor: "#1a237e",
    paddingHorizontal: 25,
    paddingVertical: 30,
    alignItems: "center",
  },

  footerMarca: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },

  footerColunas: {
    width: "100%",
    maxWidth: 450,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: 60,
    marginBottom: 20,
  },

  footerColuna: {
    alignItems: "center",
    minWidth: 130,
  },

  footerTitulo: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },

  footerLink: {
    color: "#e0e0e0",
    fontSize: 14,
    marginBottom: 7,
    textAlign: "center",
  },

  footerBottom: {
    width: "100%",
    color: "#c5cae9",
    marginTop: 10,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.15)",
    textAlign: "center",
    fontSize: 12,
  },
});

