import { View, Text, StyleSheet, Platform, Pressable, Image, Modal, Button, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Jugador } from '@/src/jugador';
import { useState, useEffect } from 'react';
import Cargando from '@/src/componentes/Cargando';
import { defaultJugadorImage } from '@/src/app.config';
import { firestoreGetJugador, firestoreBorrarJugador } from '@/src/database/jugadorQueries';
import { formStyles } from '@/src/styles/formStyles';

export default function Detalle() {
    const [jugador, setJugador] = useState<Jugador | null>(null);
    const { id } = useLocalSearchParams<{ id: string }>();

    useEffect(() => {
        firestoreGetJugador(Platform.OS, id)
        .then((data) => {setJugador(data)})
        .catch((err) => {console.log(err); setJugador(null)});
    }, []);
    
    if (jugador == null)
        return  <Cargando />;
    else
        return <DetalleComponent jugador={jugador} />
}

function PlayerDataField({ fieldName, data }: { fieldName: string; data: any }) {
    return (
        <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", maxWidth: 600, marginVertical: 10}}>
            <Text style={{fontSize: 20}}><Text style={styles.infoLabel}>{fieldName}:</Text> {data}</Text>
        </View>
    )
}

function DetalleComponent({jugador}: {jugador: Jugador}){
    const router = useRouter();
    const imageUrl = jugador.Image ? jugador.Image : defaultJugadorImage;
    const [borrarModalVisible, setBorrarModalVisible] = useState<boolean>(false);

    const verVideoPress = () => {
        router.navigate(`/multimedia/${encodeURIComponent(jugador.Video || "novideo")}`);
    };

    const imagePress = () => {
        router.navigate(`./image/${encodeURIComponent(imageUrl)}`);
    }

    const borrarJugador = () => {
        if (!jugador?.id)
            return
        firestoreBorrarJugador(Platform.OS, jugador.id)
        .then(() => router.back())
        .catch((err) => console.error("Error deleting document: ", err));   
    }

    return  (
    <View style={styles.container}>
        <Modal
            animationType="slide"
            transparent={true}
            visible={borrarModalVisible}
            onRequestClose={() => {setBorrarModalVisible(!borrarModalVisible);}}
            style={{backgroundColor: "black"}}
        >
            <View style={{ flex:1, justifyContent:'center', alignItems:'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <View style={{ padding:20, backgroundColor: 'white', borderRadius: 10 }}>
                    <Text style={{margin: 5, fontSize: 20}}>¿Desea eliminar este jugador?</Text>
                    <View style={{margin: 5}}>
                        <Button title="Aceptar" onPress={() => {borrarJugador()}} />
                    </View>
                    <View style={{margin: 5}}>
                        <Button title="Cancelar" onPress={() => {setBorrarModalVisible(false)}} />
                    </View>
                </View>
            </View>
        </Modal>

        <Pressable onPress={() => imagePress()}>
            <Image 
                style={styles.logo}
                source={{uri: imageUrl}}
            />
        </Pressable>

        <ScrollView contentContainerStyle={{justifyContent: 'center',alignItems: 'center', maxWidth: 600, padding: 30}}>
            <PlayerDataField fieldName="Nombre" data={jugador.Nombre}  />
            <PlayerDataField fieldName="Dorsal" data={jugador.Dorsal}  />
            <PlayerDataField fieldName="Posicion" data={jugador.Posicion}  />
            <PlayerDataField fieldName="Edad" data={jugador.Edad}  />
            <PlayerDataField fieldName="Altura" data={jugador.Altura}  />
            <PlayerDataField fieldName="Nacionalidad" data={jugador.Nacionalidad}  />
            <PlayerDataField fieldName="Descripcion" data={jugador.Descripcion}  />
        </ScrollView>


        <TouchableOpacity onPress={() => setBorrarModalVisible(true)} style={formStyles.button}>
            <Text style={formStyles.buttonText}>Borrar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={formStyles.button} onPress={() => {router.navigate(`./editar/${jugador.id}`)}}>
            <Text style={formStyles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={formStyles.button} onPress={() => verVideoPress()}>
            <Text style={formStyles.buttonText}>Ver video</Text>
        </TouchableOpacity>
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logo: {
      width: 200, 
      height: 200,
      resizeMode: 'contain',
    },
    infoLabel: {
        fontWeight: 'bold',
        color: '#1e90ff',
    },
  });