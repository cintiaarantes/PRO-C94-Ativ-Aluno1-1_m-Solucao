import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, StatusBar, Alert, FlatList, Image, ImageBackground, Dimensions } from 'react-native';
import axios from 'axios';

export default class MeteorScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      meteors: {},
    };
  }

  componentDidMount() {
    this.getMeteors();
  }

  getMeteors = () => {
    axios
      .get(
        'https://api.nasa.gov/neo/rest/v1/feed?&api_key=5bXVptYdKh2p7Y6KTxRxgbvL0df4X89FiMjsdh8B'
      )
      .then((response) => {
        this.setState({ meteors: response.data.near_earth_objects });
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  //Aula 93: Construção da função renderItem, responsável por mostrar na tela, as imagens dos meteoros, de acordo com a pontuação de ameaça
  renderItem = ({ item }) => {
    let meteor = item;
    let bg_img, speed, size;
    if (meteor.threat_score <= 30) {
      bg_img = require('../assets/meteor_bg1.png');
      speed = require('../assets/meteor_speed1.gif');
      size = 100;
    } else if (meteor.threat_score <= 75) {
      bg_img = require('../assets/meteor_bg2.png');
      speed = require('../assets/meteor_speed2.gif');
      size = 150;
    } else {
      bg_img = require('../assets/meteor_bg3.png');
      speed = require('../assets/meteor_speed3.gif');
      size = 200;
    }

    //Aula 94: Desafios: Escrever um código, na função render para exibir os dados dos meteoros
    return (
      //Desafio 01: Você precisa de um componente para visualizar as informações
      //Desafio 02: Você precisa de um componente para as imagens de fundo com estilizações
      //Desafio 03: Você precisa de um componente para visualizar os gifs
      //Desafio 04: Você precisa de um componente para exibir os textos (info) de cada meteoro.
      /*            No componente de texto, você terá que ter um para cada texto exibido.
      */
      <View>
        <ImageBackground source={bg_img} style={styles.backgroundImage}>
          <View style={styles.gifContainer}>
            <Image source={speed} style={{width: size, height: size, alignSelf: 'center'}}></Image>
            <View style={styles.listContainer}>
              <Text
                style={[styles.cardTitle, { marginTop: 130, marginLeft: 20 }]}>
                {item.name}
              </Text>
              <Text
                style={[styles.cardText, { marginTop: 20, marginLeft: 20 }]}>
                Mais Próximo da Terra -{' '}
                {item.close_approach_data[0].close_approach_date_full}
              </Text>
              <Text style={[styles.cardText, { marginTop: 5, marginLeft: 20 }]}>
                Diâmetro Mínimo (KM) -{' '}
                {item.estimated_diameter.kilometers.estimated_diameter_min}
              </Text>
              <Text style={[styles.cardText, { marginTop: 5, marginLeft: 20 }]}>
                Diâmetro Máximo (KM) -{' '}
                {item.estimated_diameter.kilometers.estimated_diameter_max}
              </Text>
              <Text style={[styles.cardText, { marginTop: 5, marginLeft: 20 }]}>
                Velocidade (KM/H) -{' '}
                {item.close_approach_data[0].relative_velocity.kilometers_per_hour}
              </Text>
              <Text style={[styles.cardText, { marginTop: 5, marginLeft: 20 }]}>
                Distância da Terra (KM) -{' '}
                {item.close_approach_data[0].miss_distance.kilometers}
              </Text>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  };

  render() {
    if (Object.keys(this.state.meteors).length === 0) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>Carregando...</Text>
        </View>
      );
    } else {
      let meteor_arr = Object.keys(this.state.meteors).map((meteor_date) => {
        return this.state.meteors[meteor_date];
      });
      console.log(meteor_arr);
      
      let meteors = [].concat.apply([], meteor_arr);
      console.log(meteors);

      meteors.forEach(function (element) {
        let diameter =
          (element.estimated_diameter.kilometers.estimated_diameter_min +
            element.estimated_diameter.kilometers.estimated_diameter_max) /
          2;
        
        let threatScore = (diameter / element.close_approach_data[0].miss_distance.kilometers) * 1000000000;
        element.threat_score = threatScore;
      });

      //Aula 93 - Classificação dos meteoros dentro do vetor "meteors" com base na pontuação de ameaça
      meteors.sort(function (a, b) {
        return b.threat_score - a.threat_score; //comparação descrescente
      });
      meteors = meteors.slice(0, 5);

      //Aula 93: E para mostrar na tela, temos 1º o View (com estilos de contêiner)
      //Aula 93: 2º o SafeAreaView (para evitar problemas de Interface de Usuário em diferentes sistemas operacionais)
      //Aula 93: 3º o FlatList para exibir os dados dos meteoros estruturados
      return (
        <View style={styles.container}>
          <SafeAreaView style={styles.androidSafeArea} />
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            data={meteors}
            renderItem={this.renderItem}
            horizontal={true}
          />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  androidSafeArea: {
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  //Aula 94: Estilos adicionados para os meteoros
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  listContainer: {
    backgroundColor: 'rgba(52, 52, 52, 0.5)',
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    borderRadius: 10,
    padding: 10,
  },
  cardTitle: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  cardText: {
    color: 'white',
  },
  gifContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});
