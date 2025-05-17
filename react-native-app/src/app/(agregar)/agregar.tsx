import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import {
  Text, TextInput, View, Modal, Platform, Image, TouchableOpacity
} from "react-native";
import { Jugador } from "@/src/jugador";
import { useRouter } from "expo-router";
import { firestoreAgregarJugador, penjarACloudinary, RNFile } from "@/src/database/jugadorQueries";
import { validarJugador } from "@/src/validar/validarJugador";
import { formStyles } from "@/src/styles/formStyles";
import * as ImagePicker from "expo-image-picker";

export default function Agregar() {
    const router = useRouter();

    const [modalVisible, setModalVisible] = useState(false);
    const [modalText, setModalText] = useState<string>('');
    const [jugadorAgregado, setJugadorAgregado] = useState<boolean>(false);

    const [nombreField, setNombreField] = useState<string>('');
    const [posicionField, setPosicionField] = useState<string>('');
    const [dorsalField, setDorsalField] = useState<string>('');
    const [edadField, setEdadField] = useState<string>('');
    const [nacionalidadField, setNacionalidadField] = useState<string>('');
    const [descripcionField, setDescripcionField] = useState<string>('');
    const [alturaField, setAlturaField] = useState<string>('');

    const [uploadedImage, setUploadedImage] = useState<RNFile | null>(null);
    const [uploadedVideo, setUploadedVideo] = useState<RNFile | null>(null);
  
    
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) {
      const file = result.assets[0];
      setUploadedImage({
        uri: file.uri,
        type: file.type || "image/jpeg",
        name: file.fileName || "imagen.jpg",
      });
    }
  };

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 1,
    });
    if (!result.canceled) {
      const file = result.assets[0];
      setUploadedVideo({
        uri: file.uri,
        type: file.type || "video/mp4",
        name: file.fileName || "video.mp4",
      });
    }
  };

    const agregarJugador = async () => {
        const jugador: Jugador = {
            Nombre:nombreField,
            Dorsal:Number(dorsalField),
            Descripcion:descripcionField,
            Nacionalidad:nacionalidadField,
            Altura:alturaField,
            Posicion:posicionField,
            Edad:Number(edadField),
        }
    
        const errores: string[] = validarJugador(jugador);

        if (errores.length > 0)
        {
            setModalText(errores.join('\n'));
            setModalVisible(true);
            return ;
        }

        setModalText("Agregando jugador...")
        setJugadorAgregado(true)
        setModalVisible(true)

        try {
            if (uploadedImage) {
              setModalText("Subiendo imagen...")
              jugador.Image = await penjarACloudinary(uploadedImage, "image");
            }
            if (uploadedVideo) {
              setModalText("Subiendo video...")
              jugador.Video = await penjarACloudinary(uploadedVideo, "video");
            }
      
            await firestoreAgregarJugador(Platform.OS, jugador);
            setModalText("Jugador Agregado");
          } catch (e) {
            setModalText("No se pudo agregar el jugador");
          }
        };
      

        return (
            <View style={formStyles.container}>
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => { setModalVisible(!modalVisible); }}
              >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                  <View style={{ padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
                    <Text>{modalText}</Text>
                    <TouchableOpacity style={formStyles.button} onPress={() => { setModalVisible(false); if (jugadorAgregado) router.back(); }}>
                      <Text style={formStyles.buttonText}>Cerrar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
        
              <TextInput placeholder="Nombre" value={nombreField} onChangeText={setNombreField} style={formStyles.input} />
              <TextInput placeholder="Dorsal" value={dorsalField} onChangeText={setDorsalField} keyboardType="numeric" style={formStyles.input} />
              <TextInput placeholder="Edad" value={edadField} onChangeText={setEdadField} keyboardType="numeric" style={formStyles.input} />
              <TextInput placeholder="Nacionalidad" value={nacionalidadField} onChangeText={setNacionalidadField} style={formStyles.input} />
              <TextInput placeholder="Descripción" value={descripcionField} onChangeText={setDescripcionField} style={formStyles.input} />
              <TextInput placeholder="Altura" value={alturaField} onChangeText={setAlturaField} style={formStyles.input} />
        
              <Picker selectedValue={posicionField} onValueChange={(val) => setPosicionField(val)} style={formStyles.picker}>
                <Picker.Item label="Elegir posición" value="" />
                <Picker.Item label="Alero" value="Alero" />
                <Picker.Item label="Base" value="Base" />
                <Picker.Item label="Escolta" value="Escolta" />
                <Picker.Item label="Pivot" value="Pivot" />
                <Picker.Item label="Ala-Pivot" value="Ala-Pivot" />
              </Picker>
        
              <TouchableOpacity style={formStyles.button} onPress={pickImage}>
                <Text style={formStyles.buttonText}>{uploadedImage? `Subiendo imagen: ${uploadedImage.name}`: "Seleccionar imagen"}</Text>
              </TouchableOpacity>
        
              <TouchableOpacity style={formStyles.button} onPress={pickVideo}>
                <Text style={formStyles.buttonText}>{uploadedVideo? `Subiendo video: ${uploadedVideo.name}`: "Seleccionar vídeo"}</Text>
              </TouchableOpacity>
             

              <TouchableOpacity style={formStyles.button} onPress={agregarJugador}>
                <Text style={formStyles.buttonText}>Agregar jugador</Text>
              </TouchableOpacity>
            </View>
          );
        }
        