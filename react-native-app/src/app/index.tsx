import { Text, View, FlatList, Pressable, StyleSheet, Image, TextInput, Button, TouchableOpacity  } from "react-native";
import { Jugador } from '../jugador'
import { useEffect, useState } from "react";
import { Platform } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import { useRouter, useLocalSearchParams } from "expo-router";
import { defaultJugadorImage } from "../app.config";
import { indexStyles as listadoStyles, indexStyles } from "../styles/indexStyles";
import messaging from '@react-native-firebase/messaging';
import Cargando from "../componentes/Cargando";
import { Picker } from "@react-native-picker/picker";

async function getFCMToken() {
  try {
    const token = await messaging().getToken();
    console.log('FCM Registration Token:', token);
  } catch (error) {
    console.error('Error fetching FCM registration token:', error);
  }
}

export default function index() {
  const router = useRouter();
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [jugadoresFiltrados, setJugadoresFiltrados] = useState<Jugador[]>([]);
  const [nombreField, setNombreField] = useState<string>('');
  const [posicionField, setPosicionField] = useState<string>('');
  const { posicion, nombre } = useLocalSearchParams();

  useEffect(() => {
      getFCMToken();
      const unsubscribe = messaging().onTokenRefresh(token => {
        console.log('FCM Token refreshed:', token);
      });
      return unsubscribe;
    }, []);

    useEffect(() => {
      const unsubscribe = messaging().onMessage(async remoteMessage => {
        console.log('Received:', remoteMessage);
      });
  
      return unsubscribe;
    }, [])

  useEffect(() => {
    function onResult(QuerySnapshot: any) {
      const jugadoresData: Jugador[] = [];

      QuerySnapshot.forEach((element: any) => {
        const jugadorData = element.data();
        jugadoresData.push({
          ...jugadorData,
          id: element.id,
        });
      });
      
      setNombreField(nombre as string)
      setPosicionField(posicion as string)
      setJugadores(jugadoresData);
      filtarJugadores(nombre as string, posicion as string, jugadoresData);
    }
    
    function onError(error: any) {console.error(error);}
  
    let subscriber: any;
    if (Platform.OS === "web")
      subscriber = onSnapshot(collection(getFirestore(), 'jugadores'), onResult, onError);
    else
      subscriber = firestore().collection('jugadores').onSnapshot(onResult, onError);
    return () => subscriber;  
  }, [])

  const filtarJugadores = (nombre: string, posicion: string, jugadores: Jugador[]) => {
    const filtrados: Jugador[] = jugadores.filter((jugador) => {
      const normalize = (str: string) => str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

      const nombreMatch = nombre ? normalize(jugador.Nombre).includes(normalize(nombre)): true;
      const posicionMatch = posicion ? normalize(jugador.Posicion).includes(normalize(posicion)): true;

      return nombreMatch && posicionMatch;
    });

    setJugadoresFiltrados(filtrados)
  }

  const updateFilter = (n: string, p: string) => {
    if (n && p)
      router.setParams({posicion: p, nombre: n, });
    else if (p)
      router.setParams({posicion: p, nombre: ""});

    filtarJugadores(n, p, jugadores);
  }

  const handleJugadorPress = (jugador: Jugador) => {router.navigate(`/details/${jugador.id}`)}

  const jugadorRender = ({ item }: { item: Jugador }) => (  
    <Pressable onPress={() => handleJugadorPress(item)}>
      <View style={listadoStyles.jugadorView}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image 
              style={listadoStyles.logoJugador}
              source={{ uri: item.Image? item.Image: defaultJugadorImage, }}
          />
          <Text style={{marginLeft: 10, fontSize: 20, fontWeight: '700', color: "#224c7e",}}>{item.Dorsal}</Text>
        </View>
        <Text style={{fontSize: 20, fontWeight: '500'}}>{item.Nombre}</Text>
      </View>
    </Pressable>
  );

  if (jugadores.length === 0)
    return  <Cargando />;

  return (
    <View style={indexStyles.mainView}>
      <TextInput
        style={indexStyles.buscador}
        onChangeText={(nombre: string) => {
          setNombreField(nombre);
          updateFilter(nombre, posicionField);
        }}
        value={nombre as string}
        placeholder="Nombre o Apellido"
      />

      <Picker
        selectedValue={posicion as string}
        onValueChange={(posicion: string) => {
          setPosicionField(posicion);
          updateFilter(nombreField, posicion);
        }}
        style={indexStyles.picker}
      >
        <Picker.Item label="Todos" value="" />
        <Picker.Item label="Alero" value="Alero" />
        <Picker.Item label="Base" value="Base" />
        <Picker.Item label="Escolta" value="Escolta" />
        <Picker.Item label="Pivot" value="Pivot" />
        <Picker.Item label="Ala-Pivot" value="Ala-Pivot" />
      </Picker>

      <TouchableOpacity style={indexStyles.botonPrincipal} onPress={() => router.navigate('./agregar')}>
        <Text style={indexStyles.textoBoton}>AGREGAR JUGADOR</Text>
      </TouchableOpacity>

      <FlatList
        data={jugadoresFiltrados}
        renderItem={jugadorRender} 
        keyExtractor={(jugador: Jugador) => jugador.id!}
        style={listadoStyles.elementoListaJugador}
        ItemSeparatorComponent={() => <View style={listadoStyles.separador} />}  
      />
    </View>
  );
}