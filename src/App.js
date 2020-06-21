import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    api.get('repositories').then(response => {
      setRepositories(response.data)
    })
  }, [])

  async function handleLikeRepository(id) { 
    const response = await api.post(`repositories/${id}/like`)

    const repository = response.data;

    const indexOldRepo = repositories.findIndex(repository => {
      return repository.id === id
    });

    repositories[indexOldRepo] = repository

    setRepositories([...repositories])

  }
  
  async function handleAddRepository() {
    
    const response = await api.post('repositories', {      
        title: "Desafio React2",
        url: "https://github.com/GuilhermeErthal",
        techs: ["Python", "Django"]      
    });

    const repository = response.data;

    setRepositories([ ...repositories, repository])

  }

  async function handleRemoveRepository(id) {
    await api.delete(`repositories/${id}`);

    const response = repositories.filter(repository => repository.id !== id);

    setRepositories(response);

  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>

        <FlatList
          data={repositories}
          keyExtractor={repository => repository.id}
          renderItem={({ item: repository }) => (
              
            <View style={styles.repositoryContainer}>       
  
              <Text style={styles.repository}>{repository.title}</Text>              

              <View style={styles.techsContainer}>
                {repository.techs.map(tech => (
                  <Text key={tech} style={styles.tech}>
                    {tech}
                  </Text>
                ))} 
              </View>

              <View style={styles.likesContainer}>
                <Text
                  style={styles.likeText}                  
                  testID={`repository-likes-${repository.id}`}
                >
                  {`${repository.likes} curtidas`}
                </Text>
              </View>

              <View style={styles.containerButtons}>
                <TouchableOpacity
                  style={styles.buttonLike}
                  onPress={() => handleLikeRepository(repository.id)}                
                  testID={`like-button-${repository.id}`}
                >
                  <Text style={styles.buttonText}>Curtir</Text>
                  
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.buttonLike}
                  onPress={() => handleLikeRepository(repository.id)}                
                  testID={`like-button-${repository.id}`}
                >                  
                  <Text style={styles.buttonTextUnlike}>Descutir</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.buttonLike}
                  onPress={() => handleRemoveRepository(repository.id)}                
                  testID={`like-button-${repository.id}`}
                >                  
                  <Text style={styles.buttonTextUnlike}>Remover Projeto</Text>
                </TouchableOpacity>
              </View>

            </View>

            
          )}
        />

        <TouchableOpacity 
            activeOpacity={0.6} 
            style={styles.buttonAdd} 
            onPress={handleAddRepository}
            >
              <Text style={styles.buttonTextAdd}>Adicionar projeto</Text>
        </TouchableOpacity>
                  
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
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  containerButtons: {
    marginTop: 10,
    flexDirection: "row",
  },
  buttonLike: {
    flexDirection: "row",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
  buttonTextUnlike: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#ff0000",
    padding: 15,
  },
  buttonAdd: {
    backgroundColor: '#44e500',
    margin: 20,
    height: 50,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonTextAdd: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
