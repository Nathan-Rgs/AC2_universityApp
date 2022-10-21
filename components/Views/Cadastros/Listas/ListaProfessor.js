import React, { useEffect, useState } from "react";
import { List, Avatar, Card } from "react-native-paper";
import { View, StyleSheet, ActivityIndicator, FlatList } from "react-native";
import { ScrollView } from "react-native-virtualized-view";
// FIREBASE AND DB
import { db } from "../../../Firebase/firebase";
import { getDocs, setDoc, query, collection, doc } from "firebase/firestore";

export default function ProfessoresList(props) {
  const [professoresList, setProfessoresList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get professores list from Firestore by Firebase
  useEffect(() => {
    // wrap your async call here
    const loadData = async () => {
      setLoading(true);
      await getProfessores();
      setLoading(false);
    };
    loadData();
  }, []);

  const getProfessores = async () => {
    try {
      const professores = await getDocs(query(collection(db, "Professor")));

      const formattedProfessoresList = [];
      professores?.forEach((doc) => {
        formattedProfessoresList.push({ ...doc.data(), id: doc.id });
      });
      setProfessoresList(formattedProfessoresList);
    } catch (error) {
      window.alert(error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3D43C6" />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <View style={styles.cardContainer}>
          <Card.Title
            title="Professores"
            titleStyle={styles.title}
            left={(props) => (
              <Avatar.Icon
                {...props}
                style={{ backgroundColor: "#3D43C6" }}
                icon="clipboard-list"
              />
            )}
          />
          <ScrollView>
            <View style={styles.cardContainerContent}>
              <FlatList
                data={professoresList}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  return (
                    <List.Item
                      title={item.nome}
                      right={(props) => (
                        <List.Icon {...props} icon="book-edit" />
                      )}
                      onPress={() =>
                        props.navigation.navigate("Cadastro professores")
                      }
                    ></List.Item>
                  );
                }}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  cardContainer: {
    margin: 20,
    borderRadius: 10,
    height: 700,
    backgroundColor: "white",
  },
  cardContainerContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    marginLeft: 45,
    paddingTop: 10,
    color: "black",
    fontSize: 25,
    textAlignVertical: "bottom",
  },
});
