import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator,} from "react-native";

const API_URL = "https://lolooo-production.up.railway.app";

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

  useEffect(() => {
    buscarDados();
  }, []);

  async function buscarDados() {
    try {
      setCarregandoDados(true);

      const [responseMaterias, responseProfessores] =
        await Promise.all([
          fetch(`${API_URL}/materias/listar`),
          fetch(`${API_URL}/professores/listar`),
        ]);

      if (!responseMaterias.ok) {
        throw new Error("Erro ao buscar matérias");
      }

      if (!responseProfessores.ok) {
        throw new Error("Erro ao buscar professores");
      }

      const dadosMaterias = await responseMaterias.json();
      const dadosProfessores = await responseProfessores.json();

      setMaterias(dadosMaterias);
      setProfessores(dadosProfessores);
    } catch (error) {
      console.error(error);

      Alert.alert(
        "Erro",
        "Não foi possível carregar matérias e professores."
      );
    } finally {
      setCarregandoDados(false);
    }
  }

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
    if (!nomeSala.trim()) {
      Alert.alert("Atenção", "Digite o nome da sala.");
      return;
    }

    if (!duracaoAula) {
      Alert.alert(
        "Atenção",
        "Informe a duração da aula."
      );
      return;
    }

    if (!duracaoIntervalo) {
      Alert.alert(
        "Atenção",
        "Informe a duração do intervalo."
      );
      return;
    }

    if (!inicioAula) {
      Alert.alert(
        "Atenção",
        "Informe o horário de início da aula."
      );
      return;
    }

    if (!quantAulas) {
      Alert.alert(
        "Atenção",
        "Informe a quantidade de aulas."
      );
      return;
    }

    try {
      setCarregando(true);

      const sala = {
        nome_sala: nomeSala,
        duracao_aula: duracaoAula,
        duracao_intervalo: duracaoIntervalo,
        inicio_aula: inicioAula,
        quant_aula: quantAulas,
        escola: {
          id: 26,
        },
      };

      const response = await fetch(
        `${API_URL}/salas/salvar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sala),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao criar sala");
      }

      const dadosSala = await response.json();

      const idSala = dadosSala.id_sala;

      Alert.alert(
        "Sucesso",
        "Sala criada com sucesso!"
      );

      const materiasGrade = aulas.map((aula) => ({
        id_materia: {
          id_materia: aula.id_materia,
        },
        id_professor: {
          id_professor:
            aula.id_professor || null,
        },
      }));

      if (materiasGrade.length > 0) {
        const responseGrade = await fetch(
          `${API_URL}/grade/gerargrade/${idSala}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(materiasGrade),
          }
        );

        if (responseGrade.ok) {
          Alert.alert(
            "Sucesso",
            "Grade criada com sucesso!",
            [
              {
                text: "OK",
                onPress: () =>
                  navigation.navigate("listar_sala"),
              },
            ]
          );
        } else {
          Alert.alert(
            "Atenção",
            "A sala foi criada, mas ocorreu um erro ao criar a grade.",
            [
              {
                text: "OK",
                onPress: () =>
                  navigation.navigate("listar_sala"),
              },
            ]
          );
        }
      } else {
        Alert.alert(
          "Sucesso",
          "Sala criada sem matérias.",
          [
            {
              text: "OK",
              onPress: () =>
                navigation.navigate("listar_sala"),
            },
          ]
        );
      }
    } catch (error) {
      console.error(error);

      Alert.alert(
        "Erro",
        "Ocorreu um erro ao criar a sala. Tente novamente."
      );
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
