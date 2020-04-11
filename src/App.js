import React, { useState, useEffect } from "react";
import Icon from 'react-native-vector-icons/FontAwesome';

//Icon.loadFont();

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import api from './services/api';

export default function App() {

  const [repositories, setRepositories] = useState([]);
  const [ listLoading, setListLoading ] = useState(false);

  useEffect(() => {

    handleGetRepositories();

  }, []);

  function handleGetRepositories() {

    setListLoading(true);

    api.get('repositories')
      .then(response => {
        setRepositories(response.data)
        setListLoading(false);
      })
      .catch(error => {
        setListLoading(false);
        alert(`Error on get repositories:\n${error}`)
      });

  }

  async function handleLikeRepository(id) {

    try {

      const response = await api.post(`repositories/${id}/like`);
      const { likes } = response.data;

      // let repositoriesTemp = [ ...repositories ];
      // const repositoryIndex = repositoriesTemp.findIndex(item => item.id === id);
      // repositoriesTemp[repositoryIndex].likes = likes;

      const repositoriesTemp = repositories.map(item => item.id === id ? {...item, likes: likes} : item);

      setRepositories(repositoriesTemp);
      
    } catch (error) {
      alert(`Error on set likes in repositories:\n${error}`);
    }
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>

        <FlatList
          showsVerticalScrollIndicator={false}
          data={repositories}
          onRefresh={handleGetRepositories}
          refreshing={listLoading}
          keyExtractor={repository => repository.id}
          renderItem={({ item: repository }) => (

            <View style={styles.repositoryContainer}>
              <Text style={styles.repository}>{repository.title}</Text>

              <View style={styles.techsContainer}>
                {repository.techs.map((item, index) => (
                  <Text style={styles.tech} key={`${item}-${index}`}>{item}</Text>
                ))}
              </View>

              <View style={styles.likesContainer}>
                <Text
                  style={styles.likeText}
                  // Remember to replace "1" below with repository ID: {`repository-likes-${repository.id}`}
                  testID={`repository-likes-${repository.id}`}
                >
                  {repository.likes} curtidas
                </Text>
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={() => handleLikeRepository(repository.id)}
                // Remember to replace "1" below with repository ID: {`like-button-${repository.id}`}
                testID={`like-button-${repository.id}`}
              >
                
                <Text style={styles.buttonText}>
                  <Icon name="thumbs-up" size={20} /> Curtir
                </Text>
              </TouchableOpacity>

              {/* <View style={styles.iconButtonContainer}>
                <Icon.Button
                  name="thumbs-up"
                  backgroundColor="#7159c1"
                  iconStyle={styles.iconButton}
                  onPress={() => handleLikeRepository(repository.id)}
                  justifyContent="center"
                  // Remember to replace "1" below with repository ID: {`like-button-${repository.id}`}
                  testID={`like-button-${repository.id}`}
                >
                  <Text style={styles.iconButtonText}>
                    Curtir
                  </Text>
                </Icon.Button>
              </View> */}

            </View>
          )}
        />

      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
    borderRadius: 4
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  button: {
    marginTop: 10,
    backgroundColor: "#7159c1",
    padding: 10,
    width: 110,
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },


  // iconButtonContainer: {
  //   width: 100,
  // },
  // iconButton: {
  //   marginRight: 5,
  // },
  // iconButtonText: {
  //   fontFamily: 'Arial',
  //   fontSize: 16,
  //   color: "#fff",
  //   fontWeight: 'bold'
  // },

});
