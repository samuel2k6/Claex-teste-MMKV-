import React, { useState } from "react";
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator,} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { mostrarAlerta } from "./utils/mensagem";

const CHAVE_SALAS = "claex_salas";
const CHAVE_MATERIAS = "claex_materias";
const CHAVE_PROFESSORES = "claex_professores";

const MATERIAS_PADRAO = [
  { id_materia: "1", nome_materia: "Matemática" },
  { id_materia: "2", nome_materia: "Português" },
  { id_materia: "3", nome_materia: "Ciências" },
  { id_materia: "4", nome_materia: "História" },
  { id_materia: "5", nome_materia: "Geografia" },
];
const PROFESSORES_PADRAO = [
  { id_professor: "1", nome_professor: "Professor 1" },
  { id_professor: "2", nome_professor: "Professor 2" },
];

export default function FormNovaSala({ navigation }) {
  const [nomeSala, setNomeSala] = useState("");
  const [duracaoAula, setDuracaoAula] = useState("");
  const [duracaoIntervalo, setDuracaoIntervalo] = useState("");
  const [inicioAula, setInicioAula] = useState("");
  const [quantAulas, setQuantAulas] = useState("");

  const [materias, setMaterias] = useState([]);
  const [professores, setProfessores] = useState([]);

  const [aulas, setAulas] = useState([]);

  const [carregando, setCarregando] = useState(false);
  const [carregandoDados, setCarregandoDados] = useState(false);

  // Matérias e professores iniciais são locais; listas salvas pelo app têm prioridade.
  React.useEffect(() => {
    async function carregarDadosLocais() {
      try {
        setCarregandoDados(true);
        const materiasSalvas = await AsyncStorage.getItem(CHAVE_MATERIAS);
        const professoresSalvos = await AsyncStorage.getItem(CHAVE_PROFESSORES);
        const listaMaterias = materiasSalvas ? JSON.parse(materiasSalvas) : MATERIAS_PADRAO;
        const listaProfessores = professoresSalvos ? JSON.parse(professoresSalvos) : PROFESSORES_PADRAO;
        setMaterias(Array.isArray(listaMaterias) ? listaMaterias : MATERIAS_PADRAO);
        setProfessores(Array.isArray(listaProfessores) ? listaProfessores : PROFESSORES_PADRAO);
        if (!materiasSalvas) await AsyncStorage.setItem(CHAVE_MATERIAS, JSON.stringify(MATERIAS_PADRAO));
        if (!professoresSalvos) await AsyncStorage.setItem(CHAVE_PROFESSORES, JSON.stringify(PROFESSORES_PADRAO));
      } catch (error) {
        console.error("Erro ao carregar dados locais:", error);
        mostrarAlerta("Erro", "Não foi possível carregar matérias e professores salvos no dispositivo.");
      } finally {
        setCarregandoDados(false);
      }
    }
    carregarDadosLocais();
  }, []);

  function adicionarMateria() {
    setAulas([
      ...aulas,
      {
        id_materia: "",
        id_professor: "",
      },
    ]);
  }

  function alterarMateria(index, valor) {
    const novasAulas = [...aulas];
    novasAulas[index].id_materia = valor;
    setAulas(novasAulas);
  }

  function alterarProfessor(index, valor) {
    const novasAulas = [...aulas];
    novasAulas[index].id_professor = valor;
    setAulas(novasAulas);
  }

  function removerAula(index) {
    const novasAulas = aulas.filter(
      (_, i) => i !== index
    );

    setAulas(novasAulas);
  }

  async function criarSala() {
    if (!nomeSala.trim()) return mostrarAlerta("Atenção", "Digite o nome da sala.");
    if (!duracaoAula) return mostrarAlerta("Atenção", "Informe a duração da aula.");
    if (!duracaoIntervalo) return mostrarAlerta("Atenção", "Informe a duração do intervalo.");
    if (!inicioAula) return mostrarAlerta("Atenção", "Informe o horário de início da aula.");
    if (!quantAulas) return mostrarAlerta("Atenção", "Informe a quantidade de aulas.");

    const materiaInvalida = aulas.find((aula) => !aula.id_materia);
    if (materiaInvalida) return mostrarAlerta("Atenção", "Selecione uma matéria para cada aula adicionada.");

    try {
      setCarregando(true);
      const salasSalvas = await AsyncStorage.getItem(CHAVE_SALAS);
      const salas = salasSalvas ? JSON.parse(salasSalvas) : [];
      if (!Array.isArray(salas)) throw new Error("Os dados locais de salas estão inválidos.");

      const idSala = `sala_${Date.now()}`;
      const novaSala = {
        id_sala: idSala,
        nome_sala: nomeSala.trim(),
        duracao_aula: Number(duracaoAula),
        duracao_intervalo: Number(duracaoIntervalo),
        inicio_aula: inicioAula,
        quant_aula: Number(quantAulas),
        escola: { id: 26 },
        materias: aulas.map((aula) => ({
          id_materia: aula.id_materia,
          nome_materia: materias.find((m) => String(m.id_materia) === String(aula.id_materia))?.nome_materia ?? "Matéria",
          id_professor: aula.id_professor || null,
          nome_professor: professores.find((p) => String(p.id_professor) === String(aula.id_professor))?.nome_professor ?? null,
        })),
        criadoEm: new Date().toISOString(),
      };

      salas.push(novaSala);
      await AsyncStorage.setItem(CHAVE_SALAS, JSON.stringify(salas));

      mostrarAlerta("Sucesso", "Sala salva localmente neste dispositivo.");
      setNomeSala("");
      setDuracaoAula("");
      setDuracaoIntervalo("");
      setInicioAula("");
      setQuantAulas("");
      setAulas([]);
      navigation.navigate("listar_sala");
    } catch (error) {
      console.error("Erro ao salvar sala localmente:", error);
      mostrarAlerta("Erro", "Não foi possível salvar a sala neste dispositivo.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >

        <View style={styles.header}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("listar_sala")
            }
          >
            <Text style={styles.voltar}>
              ←
            </Text>
          </TouchableOpacity>

          <Text style={styles.headerTitulo}>
            Nova sala
          </Text>

          <View style={{ width: 35 }} />
        </View>

        <View style={styles.card}>

          <Text style={styles.titulo}>
            Criar nova sala
          </Text>

          <Text style={styles.label}>
            Nome da sala
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Nome da sala"
            value={nomeSala}
            onChangeText={setNomeSala}
          />

          <Text style={styles.label}>
            Duração de uma aula
          </Text>

          <TextInput
            style={styles.input}
            placeholder="50"
            keyboardType="numeric"
            value={duracaoAula}
            onChangeText={setDuracaoAula}
          />

          <Text style={styles.label}>
            Duração do intervalo
          </Text>

          <TextInput
            style={styles.input}
            placeholder="20"
            keyboardType="numeric"
            value={duracaoIntervalo}
            onChangeText={setDuracaoIntervalo}
          />

          <Text style={styles.label}>
            Hora que começa a aula
          </Text>

          <TextInput
            style={styles.input}
            placeholder="07:00"
            value={inicioAula}
            onChangeText={setInicioAula}
            maxLength={5}
          />

          <Text style={styles.label}>
            Quantidade de aulas por dia
          </Text>

          <TextInput
            style={styles.input}
            placeholder="6"
            keyboardType="numeric"
            value={quantAulas}
            onChangeText={setQuantAulas}
          />

        </View>

        <View style={styles.card}>

          <View style={styles.materiaHeader}>

            <Text style={styles.tituloMateria}>
              Matérias
            </Text>

            <TouchableOpacity
              style={styles.botaoAdicionar}
              onPress={adicionarMateria}
              disabled={carregandoDados}
            >
              <Text style={styles.botaoAdicionarTexto}>
                + Adicionar matéria
              </Text>
            </TouchableOpacity>

          </View>

          {carregandoDados ? (

            <ActivityIndicator
              size="small"
              color="#1a237e"
              style={styles.loading}
            />

          ) : aulas.length === 0 ? (

            <Text style={styles.semMaterias}>
              Nenhuma matéria adicionada.
            </Text>

          ) : (

            aulas.map((aula, index) => (

              <View
                key={index}
                style={styles.aulaCard}
              >

                <View style={styles.aulaTituloContainer}>

                  <Text style={styles.aulaTitulo}>
                    Aula {index + 1}
                  </Text>

                  <TouchableOpacity
                    onPress={() =>
                      removerAula(index)
                    }
                  >
                    <Text style={styles.remover}>
                      ✕
                    </Text>
                  </TouchableOpacity>

                </View>

                <Text style={styles.label}>
                  Matéria
                </Text>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.opcoesScroll}
                >

                  {materias.map((materia) => (

                    <TouchableOpacity
                      key={materia.id_materia}
                      style={[
                        styles.opcao,
                        aula.id_materia ==
                          materia.id_materia &&
                          styles.opcaoSelecionada,
                      ]}
                      onPress={() =>
                        alterarMateria(
                          index,
                          String(
                            materia.id_materia
                          )
                        )
                      }
                    >

                      <Text
                        style={[
                          styles.opcaoTexto,
                          aula.id_materia ==
                            materia.id_materia &&
                            styles.opcaoTextoSelecionada,
                        ]}
                      >
                        {materia.nome_materia}
                      </Text>

                    </TouchableOpacity>

                  ))}

                </ScrollView>

                <Text style={styles.label}>
                  Professor
                </Text>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.opcoesScroll}
                >

                  <TouchableOpacity
                    style={[
                      styles.opcao,
                      aula.id_professor === "" &&
                        styles.opcaoSelecionada,
                    ]}
                    onPress={() =>
                      alterarProfessor(
                        index,
                        ""
                      )
                    }
                  >
                    <Text
                      style={[
                        styles.opcaoTexto,
                        aula.id_professor === "" &&
                          styles.opcaoTextoSelecionada,
                      ]}
                    >
                      Sem professor
                    </Text>
                  </TouchableOpacity>

                  {professores.map(
                    (professor) => (

                      <TouchableOpacity
                        key={
                          professor.id_professor
                        }
                        style={[
                          styles.opcao,
                          aula.id_professor ==
                            professor.id_professor &&
                            styles.opcaoSelecionada,
                        ]}
                        onPress={() =>
                          alterarProfessor(
                            index,
                            String(
                              professor.id_professor
                            )
                          )
                        }
                      >

                        <Text
                          style={[
                            styles.opcaoTexto,
                            aula.id_professor ==
                              professor.id_professor &&
                              styles.opcaoTextoSelecionada,
                          ]}
                        >
                          {professor.nome_professor}
                        </Text>

                      </TouchableOpacity>

                    )
                  )}

                </ScrollView>

              </View>

            ))

          )}

        </View>

        <TouchableOpacity
          style={[
            styles.botaoCriar,
            carregando &&
              styles.botaoDesativado,
          ]}
          onPress={criarSala}
          disabled={carregando}
        >

          {carregando ? (

            <ActivityIndicator
              color="#fff"
            />

          ) : (

            <Text style={styles.botaoCriarTexto}>
              Criar sala
            </Text>

          )}

        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
  },

  scroll: {
    paddingBottom: 40,
  },

  header: {
    height: 70,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    elevation: 4,
  },

  voltar: {
    fontSize: 32,
    color: "#1a237e",
  },

  headerTitulo: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#1a237e",
  },

  card: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 20,
    borderRadius: 15,
    elevation: 3,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },

  titulo: {
    fontSize: 23,
    fontWeight: "bold",
    color: "#1a237e",
    marginBottom: 20,
  },

  label: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 7,
    marginTop: 12,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },

  materiaHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  tituloMateria: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a237e",
    flex: 1,
  },

  botaoAdicionar: {
    backgroundColor: "#5765ff",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },

  botaoAdicionarTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },

  aulaCard: {
    backgroundColor: "#f5f6fa",
    padding: 15,
    borderRadius: 12,
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },

  aulaTituloContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  aulaTitulo: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#1a237e",
  },

  remover: {
    fontSize: 20,
    color: "#d71920",
    padding: 5,
  },

  opcoesScroll: {
    flexGrow: 0,
  },

  opcao: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 13,
    marginRight: 8,
  },

  opcaoSelecionada: {
    backgroundColor: "#1a237e",
    borderColor: "#1a237e",
  },

  opcaoTexto: {
    color: "#333",
    fontSize: 13,
  },

  opcaoTextoSelecionada: {
    color: "#fff",
    fontWeight: "bold",
  },

  semMaterias: {
    color: "#777",
    textAlign: "center",
    marginVertical: 20,
  },

  loading: {
    marginVertical: 20,
  },

  botaoCriar: {
    backgroundColor: "#5765ff",
    marginHorizontal: 15,
    marginTop: 5,
    minHeight: 55,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },

  botaoDesativado: {
    opacity: 0.6,
  },

  botaoCriarTexto: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
});