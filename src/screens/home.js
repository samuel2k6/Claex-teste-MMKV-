import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions,} from 'react-native';

const { width } = Dimensions.get('window');
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';

export default function Home({ navigation }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [slide, setSlide] = useState(0);

  const slides = [
    {
      title: 'Otimização de Tempo',
      color: '#5765ff',
    },
    {
      title: 'Gestão de Conflitos',
      color: '#2c37b7',
    },
    {
      title: 'Relatórios Detalhados',
      color: '#1a237e',
    },
  ];

  return (
    <View style={styles.container}>

      {menuOpen && (
        <View style={styles.sideMenu}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setMenuOpen(false)}
          >
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          <Text style={styles.menuTitle}>CLAEX</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setMenuOpen(false);
              navigation.navigate('Home');
            }}
          >
            <Text style={styles.menuText}>🏠 Início</Text>
          </TouchableOpacity>

          <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {setMenuOpen(false);
          navigation.navigate('FormLogin');}}
            >
            <Text style={styles.menuText}>🔑 Login</Text>
            </TouchableOpacity>

          <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('listar_sala')} >
          <Text style={styles.menuText}>📚 Salas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>➕ Nova sala</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>⚙️ Configurações</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.header}>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setMenuOpen(true)}
          >
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>

          <Text style={styles.logo}>CLAEX</Text>

          <View style={styles.headerButtons}>
             <TouchableOpacity
             style={styles.loginButton}
             onPress={() => navigation.navigate('form_login')}>
             <Text style={styles.loginText}>Login</Text>
              </TouchableOpacity>
            <TouchableOpacity
            style={styles.registerButton}
            onPress={() => navigation.navigate('form_cadastro')}>
            <Text style={styles.registerText}>Cadastre-se</Text>
            </TouchableOpacity>
          </View>

        </View>

        <View style={styles.hero}>

          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>
              Organizar grades horárias nunca foi tão simples
            </Text>

            <TouchableOpacity
              style={styles.startButton}
              onPress={() => navigation.navigate('form_cadastro')}
            >
              <Text style={styles.startText}>
                Comece já!
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.heroImageContainer}>
            <Image
              source={{
                uri: 'https://img.icons8.com/?size=100&id=TDMY9h1UHdNW&format=png&color=000000',
              }}
              style={styles.heroImage}
            />
          </View>

        </View>

        <View style={styles.carouselContainer}>

          <View
            style={[
              styles.slide,
              { backgroundColor: slides[slide].color },
            ]}
          >
            <Text style={styles.slideTitle}>
              {slides[slide].title}
            </Text>
          </View>

          <View style={styles.dots}>

            {slides.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSlide(index)}
              >
                <View
                  style={[
                    styles.dot,
                    index === slide && styles.activeDot,
                  ]}
                />
              </TouchableOpacity>
            ))}

          </View>

        </View>

        <View style={styles.section}>

          <Text style={styles.sectionTitle}>
            Como funciona
          </Text>

          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              O funcionamento do CLAEX baseia-se no cadastro de
              instituições, professores, disciplinas e horários
              disponíveis. A partir dessas informações, o sistema
              realiza a geração automática da grade horária,
              considerando regras previamente definidas pela
              instituição.
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              Um dos principais diferenciais do projeto é a
              capacidade de integrar diferentes escolas em uma
              única plataforma. Dessa forma, quando um professor
              atua em mais de uma instituição, o sistema verifica
              automaticamente sua disponibilidade, evitando
              conflitos de horários.
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              Além disso, o CLAEX permite que gestores solicitem
              alterações ou trocas de horários por meio da própria
              plataforma, reduzindo falhas de comunicação e
              aumentando a agilidade nos processos administrativos.
            </Text>
          </View>

        </View>

        <View style={styles.section}>

          <Text style={styles.sectionTitle}>
            Sobre nós
          </Text>

          <View style={styles.teamCard}>

            <Text style={styles.teamName}>
              Daniel
            </Text>

            <Text style={styles.teamDescription}>
              Dev Back-End, responsável pelas implementações
              construídas em Java e Spring Boot.
            </Text>

            <TouchableOpacity style={styles.linkedinButton}>
              <Text style={styles.linkedinText}>
                LinkedIn
              </Text>
            </TouchableOpacity>

          </View>

          <View style={styles.teamCard}>

            <Text style={styles.teamName}>
              Vini
            </Text>

            <Text style={styles.teamDescription}>
              Dev responsável pelo Front-End e Back-End com
              implementações Java e Spring Boot do projeto.
            </Text>

            <TouchableOpacity style={styles.linkedinButton}>
              <Text style={styles.linkedinText}>
                LinkedIn
              </Text>
            </TouchableOpacity>

          </View>

          <View style={styles.teamCard}>

            <Text style={styles.teamName}>
              Samuel
            </Text>

            <Text style={styles.teamDescription}>
              Desenvolvedor Full-Stack colaborando na produção
              geral.
            </Text>

            <TouchableOpacity style={styles.linkedinButton}>
              <Text style={styles.linkedinText}>
                LinkedIn
              </Text>
            </TouchableOpacity>

          </View>

        </View>

        <Footer />

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },

  header: {
    height: 75,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    elevation: 4,
  },

  menuButton: {
    padding: 8,
  },

  menuIcon: {
    fontSize: 30,
    color: '#1a237e',
  },

  logo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a237e',
  },

  headerButtons: {
    flexDirection: 'row',
    gap: 6,
  },

  loginButton: {
    backgroundColor: '#1a237e',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 6,
  },

  loginText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  registerButton: {
    backgroundColor: '#5765ff',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 6,
  },

  registerText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  hero: {
    minHeight: 430,
    backgroundColor: '#e9ebff',
    padding: 25,
    justifyContent: 'center',
  },

  heroContent: {
    alignItems: 'center',
  },

  heroTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#1a237e',
    textAlign: 'center',
    marginBottom: 25,
  },

  startButton: {
    backgroundColor: '#5765ff',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
  },

  startText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },

  heroImageContainer: {
    alignItems: 'center',
    marginTop: 30,
  },

  heroImage: {
    width: 100,
    height: 100,
  },

  carouselContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },

  slide: {
    width: '100%',
    height: 180,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  slideTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },

  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
    gap: 8,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#bbb',
  },

  activeDot: {
    backgroundColor: '#1a237e',
    width: 12,
    height: 12,
  },

  section: {
    padding: 20,
  },

  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a237e',
    textAlign: 'center',
    marginBottom: 20,
  },

  infoCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
  },

  infoText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },

  teamCard: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 3,
  },

  teamName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 10,
  },

  teamDescription: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 23,
    color: '#444',
    marginBottom: 15,
  },

  linkedinButton: {
    backgroundColor: '#0077B5',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 6,
  },

  linkedinText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  sideMenu: {
    position: 'absolute',
    zIndex: 100,
    left: 0,
    top: 0,
    bottom: 0,
    width: 280,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
    elevation: 10,
  },

  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
  },

  closeText: {
    fontSize: 25,
    color: '#1a237e',
  },

  menuTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 30,
  },

  menuItem: {
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  menuText: { 
    fontSize: 17,
    color: '#333',
  },
});

