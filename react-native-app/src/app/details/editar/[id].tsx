import { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { Jugador } from "@/src/jugador";
import { Platform, View, Modal, Text, Button, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { firestoreGetJugador, firestoreActualizarJugador, penjarACloudinary, RNFile } from "@/src/database/jugadorQueries";
import Cargando from "@/src/componentes/Cargando";
import { Picker } from "@react-native-picker/picker";
import { validarJugador } from "@/src/validar/validarJugador";
import * as ImagePicker from 'expo-image-picker';
import { formStyles } from "@/src/styles/formStyles";

export default function Editar() {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalText, setModalText] = useState<string>('');
    const [jugador, setJugador] = useState<Jugador | null>(null);
    const { id } = useLocalSearchParams<{ id: string }>();
    
    const [nombreField, setNombreField] = useState<string>('');
    const [posicionField, setPosicionField] = useState<string>('');
    const [dorsalField, setDorsalField] = useState<string>('');
    const [edadField, setEdadField] = useState<string>('');
    const [nacionalidadField, setNacionalidadField] = useState<string>('');
    const [descripcionField, setDescripcionField] = useState<string>('');
    const [alturaField, setAlturaField] = useState<string>('');

    const [uploadedImage, setUploadedImage] = useState<RNFile | null>(null);
    const [uploadedVideo, setUploadedVideo] = useState<RNFile | null>(null);

    useEffect(() => {
            firestoreGetJugador(Platform.OS, id)
            .then((data) => {
                if (!data)
                    throw {error: "Jugador no encontrado"};
                setNombreField(data.Nombre);
                setPosicionField(data.Posicion);
                setDorsalField(String(data.Dorsal));
                setEdadField(String(data.Edad));
                setNacionalidadField(data.Nacionalidad);
                setDescripcionField(data.Descripcion);
                setAlturaField(data.Altura);
                setJugador(data);
            })
            .catch((err) => {console.log(err); setJugador(null)});
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: false,
            aspect: [4, 3],
            quality: 1,
          });

        if (result.canceled)
            return 
        
        setUploadedImage({
            uri: result.assets[0].uri,
            type: result.assets[0].type!,
            name: result.assets[0].fileName || "img_name"
        })
    }
    
    const pickVideo = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['videos'],
            allowsEditing: false,
            aspect: [4, 3],
            quality: 1,
          });

        if (result.canceled)
            return 
        
        setUploadedVideo({
            uri: result.assets[0].uri,
            type: result.assets[0].type!,
            name: result.assets[0].fileName || "vid_name"
        })
    }
    

    const actualizarJugador = async () => {
        const j: Jugador = {
            id: jugador!.id,
            Nombre:nombreField,
            Dorsal:Number(dorsalField),
            Descripcion:descripcionField,
            Nacionalidad:nacionalidadField,
            Altura:alturaField,
            Posicion:posicionField,
            Edad:Number(edadField),
        }

        const errores: string[] = validarJugador(j);

        if (errores.length > 0)
        {
            setModalText(errores.join('\n'));
            setModalVisible(true);
            return ;
        }

        setModalText("Actualizando jugador...")
        setModalVisible(true)

        if (uploadedImage) {
            try {
                setModalText("Subiendo imagen...");
                const imageUrl = await penjarACloudinary(uploadedImage, "image");
                j.Image = imageUrl;
            } catch (error) {
                setModalText("Error subiendo imagen");
                return;
            }
        }

        if (uploadedVideo) {
            try {
                setModalText("Subiendo video...");
                const videoURL = await penjarACloudinary(uploadedVideo, "video");
                j.Video = videoURL;
            } catch (error) {
                setModalText("Error subiendo video");
                return;
            }
        }

        try {
            if (await firestoreActualizarJugador(Platform.OS, j))
                    setModalText("Jugador actualizado")
                else 
                    setModalText("No se pudo actualizar el jugador")      
        } catch (error){
            setModalText("No se pudo actualizar el jugador")
        }


    }

    if (jugador == null)
        return <Cargando/>

    return (
        <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {setModalVisible(!modalVisible);}}
                style={{backgroundColor: "black"}}
            >
                <View style={{ flex:1, justifyContent:'center', alignItems:'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <View style={{ padding:20, backgroundColor: 'white', borderRadius: 10 }}>
                        <Text>{modalText}</Text>
                        <Button title="Cerrar" onPress={() => {setModalVisible(false)}} />
                    </View>
                </View>
            </Modal>
            
            <TextInput
                onChangeText={setNombreField}
                value={nombreField}
                placeholder="Nombre"
                style={formStyles.input}
            />
            <TextInput
                onChangeText={setDorsalField}
                value={dorsalField}
                placeholder="Dorsal"
                style={formStyles.input}
            />
            <TextInput
                onChangeText={setEdadField}
                value={edadField}
                placeholder="Edad"
                style={formStyles.input}
            />
            <TextInput
                onChangeText={setNacionalidadField}
                value={nacionalidadField}
                placeholder="Nacionalidad"
                style={formStyles.input}
            />
            <TextInput
                onChangeText={setDescripcionField}
                value={descripcionField}
                placeholder="Descripción"
                style={formStyles.input}
            />
            <TextInput
                onChangeText={setAlturaField}
                value={alturaField}
                placeholder="Altura"
                style={formStyles.input}
            />
            <Picker
                selectedValue={posicionField}
                onValueChange={(val) => setPosicionField(val)}
                placeholder="Posición"
                style={formStyles.input}
            >
                <Picker.Item label="Elegir posición" value="" />
                <Picker.Item label="Alero" value="Alero" />
                <Picker.Item label="Base" value="Base" />
                <Picker.Item label="Escolta" value="Escolta" />
                <Picker.Item label="Pivot" value="Pivot" />
                <Picker.Item label="Ala-Pivot" value="Ala-Pivot" />
            </Picker>

            <TouchableOpacity onPress={pickImage} style={formStyles.button}>
                <Text style={formStyles.buttonText}>{uploadedImage? `Actualizando imagen: ${uploadedImage.name}`: "Actualizar imagen"}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={pickVideo} style={formStyles.button}>
                <Text style={formStyles.buttonText}>{uploadedVideo? `Actualizando video: ${uploadedVideo.name}`: "Actualizar video"}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={actualizarJugador} style={formStyles.button}>
                <Text style={formStyles.buttonText}>Actualizar</Text>
            </TouchableOpacity>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: {
      width: 200,
      height: 200,
    },
  });