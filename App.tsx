import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Alert, SafeAreaView, Dimensions, ScrollView, Linking, Pressable } from 'react-native';
import { canciones } from './src/utils/canciones';
import { useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import { Button, SearchBar } from '@rneui/themed';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';


export default function App() {
  const [cancionSeleccionada, cambiarCancionSeleccionada] = useState<any>(null)
  const [busqueda, cambiarBusqueda] = useState('');
  const [listaCanciones, cambiarListaCanciones] = useState(canciones)
  const [estaReproduciendo, setEstaReproduciendo] = useState(false)
  const [tiempoCancion, setTiempoCancion] = useState(0)
  const [intervalo, setIntervalo] = useState<any>(null);
  const [cambiarNumBusqueda, setCambiarNumBusqueda] = useState(false)

  function ordenarLista() {
    return listaCanciones.sort((a, b) => {
      if (cambiarNumBusqueda) {
        return a.id - b.id;
      } else {
        return b.id - a.id;
      }
    }
    )
  }

  function esNumero(busqueda: string) {
    return /^\d+$/.test(busqueda);
  }

  function reproducirCancion(segundosCancion = 0) {
    if (segundosCancion != 0 || !estaReproduciendo) {
      setEstaReproduciendo(true)
      clearInterval(intervalo)
      setTiempoCancion(segundosCancion)
      const interval = setInterval(() => {
        setTiempoCancion((prev) => prev + 0.01)
      }, 10);
      setIntervalo(interval)
    } else {
      setEstaReproduciendo(false)
      //console.log('pausa')
      // reproducirAudio(frase.audio)
      clearInterval(intervalo)
      setIntervalo(null)
      setTiempoCancion(0)
    }
  }

  function buscar(busqueda: string) {
    if (busqueda === '') {
      cambiarListaCanciones(canciones)
      return
    }

    const cancionesFiltradas = canciones.filter(cancion => {
      if (esNumero(busqueda) === true) {
        return cancion.id == parseInt(busqueda);
      }
      return cancion.nombre.toLowerCase().includes(busqueda.toLowerCase())
    })
    if (cancionesFiltradas.length == 0) {
      cambiarListaCanciones([
        {
          id: -1,
          nombre: 'No se encontró canción',
          contenido: 'No se encontró la canción con el ID o nombre ingresado.'
        }
      ])
      return
    }
    cambiarListaCanciones(cancionesFiltradas)

  }
  if (cancionSeleccionada) {
    return (
      <>
        <SafeAreaView style={{ flex: 0, backgroundColor: '#aec4db' }} />
        <SafeAreaView style={styles.header}>
          <View style={styles.container}>
            <StatusBar backgroundColor='#aec4db' />
            {/* <Text style={styles.titulo}>SanFranPlay</Text> */}
            <View style={styles.botonAtras}>
              <Text onPress={() => {
                buscar('')
                cambiarBusqueda('');
                cambiarCancionSeleccionada(null)
                setEstaReproduciendo(false)
                setTiempoCancion(0)
                clearInterval(intervalo)
              }} style={styles.irAtras} suppressHighlighting={true}>&lt;</Text>

              <Text style={styles.nombreCancion}>{cancionSeleccionada.id}. {cancionSeleccionada.nombre}</Text>
              <ScrollView style={styles.barraScroll}>
                {
                  cancionSeleccionada.frasesCancionConTiempo != undefined ? (
                    cancionSeleccionada.frasesCancionConTiempo.map((frase: any, indice: number) => {
                      return (
                        <Text key={indice} style={[styles.contenidoCancionSeparada,
                        (tiempoCancion >= frase.entrada && tiempoCancion <= frase.salida && tiempoCancion != 0)
                          ? styles.fraseCancionRojo : null]} onPress={() => {
                            reproducirCancion(frase.entrada)
                          }} suppressHighlighting={true}>{frase?.letra}</Text>
                      )
                    })
                  )
                    : (

                      <Text style={styles.contenidoCancion}>{cancionSeleccionada.contenido}</Text>


                    )
                }
              </ScrollView>

              {
                cancionSeleccionada.frasesCancionConTiempo != undefined ? (

                  <Pressable style={styles.botonPlay} onPress={() => {
                    reproducirCancion()
                  }} >

                    <Icon name={estaReproduciendo ? "pause" : "play"} size={30} color="white" onPress={() => {
                      reproducirCancion()
                    }} suppressHighlighting={true} />

                  </Pressable>
                ) : null
              }

            </View>

          </View>
        </SafeAreaView>
      </>
    );

  }


  return (
    <>
      <SafeAreaView style={{ flex: 0, backgroundColor: '#aec4db' }} />
      <SafeAreaView style={styles.header}>
        <View style={styles.container}>
          <Text style={styles.titulo}>SanFranPlay</Text>
   
            

          <TouchableOpacity
            onPress={() => {
              setCambiarNumBusqueda(!cambiarNumBusqueda);
              ordenarLista();
            }}
            style={{ backgroundColor: '#aec4cb', padding: 10, borderRadius: 5, flexDirection: 'row', alignItems: 'center' }}
          >
            <Icon
              name={cambiarNumBusqueda ? 'arrow-down' : 'arrow-up'}
              suppressHighlighting={true}
              style={styles.botonFlecha}
            />
            <Text style={{ color: 'white', marginLeft: 5 }}>Ordenar</Text>
          </TouchableOpacity>


          <StatusBar backgroundColor='#aec4db' />
          <View style={{ height: '100%', width: Dimensions.get("screen").width }}>
            <FlashList
              data={listaCanciones}
              renderItem={({ item }) => (
                <TouchableOpacity key={item?.id} onPress={() => {
                  if (item?.id != -1) {
                    cambiarCancionSeleccionada(item)
                  }
                }} onLongPress={() => {
                  Alert.alert(
                    'Atiende macho',
                    'Tú que haces pulsando largo. Seve se va a disgustar, anda y atiende en misa',
                    [//cada corchete es un botón
                      {
                        text: 'Pagame porfa', onPress: async () => {
                          const url = 'https://www.paypal.com/paypalme/rafael2347';
                          const supported = await Linking.canOpenURL(url);
                          if (supported) {
                            Linking.openURL(url);
                          } else {
                            Alert.alert(':(', 'No se pudo abrir PayPal');
                          }
                        }
                      },
                      {
                        text: 'Venga atiendo y soy un ratón',
                      },
                    ]
                  )

                }} style={styles.listItem}>
                  <Text style={{ fontSize: 20 }}>{item?.id != -1 ? item?.id + ". " + item?.nombre : item?.nombre}</Text>
                </TouchableOpacity>
              )}
              estimatedItemSize={50}
            />
          </View>
          {/* {
        canciones && canciones.map((cancion, indice) => {

          return (
            <TouchableOpacity key={indice} onPress={() => {
             
              cambiarCancionSeleccionada(cancion)
            }} onLongPress={() => {
              Alert.alert("Has pulsado largo")
            }}>
               <Text>{cancion?.nombre}</Text> 
            </TouchableOpacity>
          )
        })
      } */}

        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  titulo: {
    fontSize: 28,
    marginTop: 100,
    backgroundColor: '#aec4db',
    width: '100%',
    textAlign: 'center',
    paddingVertical: 20,
    color: '#000',
  },
  header: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  listItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
    height: 55,
    backgroundColor: '#e8eef3',
    justifyContent: 'center',
  },
  searchBar: {
    width: '100%',
  },
  nombreCancion: {
    fontSize: 20,
    marginBottom: 10,
    width: '100%',
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333',
    alignSelf: 'center',
  },
  contenidoCancion: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 40,
    width: '100%',
    textAlign: 'left',
    alignSelf: 'center',
    paddingHorizontal: 10,
  },
  contenidoCancionSeparada: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 10,
    width: '100%',
    textAlign: 'left',
    alignSelf: 'center',
    paddingHorizontal: 5,
  },

  irAtras: {
    color: "white",
    backgroundColor: '#aec4db',
    width: Dimensions.get('window').width, // Ancho dinámico según el dispositivo
    overflow: 'hidden',
    fontSize: 50,
    textAlign: 'left',
    marginBottom: 10,
    alignSelf: 'flex-start',
    paddingLeft: 10,
    fontWeight: 'bold',
  },
  barraScroll: {
    alignSelf: "center",
  },
  botonAtras: {
    flex: 1,
    display: 'flex',

  },
  botonPlay: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#aec4db',
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
  fraseCancionRojo: {
    color: 'red',
  },
  botonOrdenar:{
    backgroundColor: '#aec4db',
  },
  botonFlecha:{
    fontSize: 20,
    color: 'white',
    marginLeft: 5,
  }

});
