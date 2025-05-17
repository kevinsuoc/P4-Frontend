import { getFirestore, doc, getDoc, deleteDoc, addDoc, collection, updateDoc } from 'firebase/firestore';
import firestore from '@react-native-firebase/firestore';
import { Jugador } from '../jugador';

export async function firestoreGetJugador(platform: string, id: string): Promise<Jugador | null>
{
    let j: any;

    if (platform === "web")
        j = await getDoc(doc(getFirestore(), 'jugadores', id));
    else
        j = await firestore().collection('jugadores').doc(id).get();
    if (!j.exists())
        return null;

    const jugador = j.data()
    jugador.id = id;
    return jugador as Jugador;
}

export async function firestoreBorrarJugador(platform: string, id: string): Promise<boolean> {
    try {
        if (platform === "web") {
            await deleteDoc(doc(getFirestore(), "jugadores", id));
        } else {
            await firestore().collection("jugadores").doc(id).delete();
        }
        return true;
    } catch (error) {
        return false;
    }
}

export async function firestoreAgregarJugador(platform: string, jugador: Jugador): Promise<boolean> {
    try {
        if (platform === "web")
            await addDoc(collection(getFirestore(), "jugadores"), jugador)
        else 
            await firestore().collection('jugadores').add(jugador)
        return true;
    } catch (err){
        return false;
    }
}


export async function firestoreActualizarJugador(platform: string, jugador: Jugador): Promise<boolean> {
    if (!jugador.id) return false;

    const jugadorData: any = {
        id: jugador.id,
        Nombre: jugador.Nombre,
        Dorsal: jugador.Dorsal,
        Posicion: jugador.Posicion,
        Edad: jugador.Edad,
        Altura: jugador.Altura,
        Nacionalidad: jugador.Nacionalidad,
        Descripcion: jugador.Descripcion,
      };
      if (jugador.Image) jugadorData.Image = jugador.Image;
      if (jugador.Video) jugadorData.Video = jugador.Video;
  
      console.log("J: ", jugadorData)
      console.log("J: ", JSON.parse(JSON.stringify(jugadorData)));
      console.log("Jugador: ", jugador)
      console.log("Jugador: ", JSON.parse(JSON.stringify(jugador)));

      console.log("typeof jugador.Image:", typeof jugador.Image);
      console.log("jugador.Image === undefined:", jugador.Image === undefined);
      console.log("jugador.Image === null:", jugador.Image === null);
      console.log("jugador.Image === '':", jugador.Image === "");

      console.log("typeof j.Image:", typeof jugador.Image);
        console.log("j.Image === undefined:", jugadorData.Image === undefined);
        console.log("j.Image === null:", jugadorData.Image === null);
        console.log("j.Image === '':", jugadorData.Image === "");
    try {
        if (platform === "web") {
            await updateDoc(doc(getFirestore(), "jugadores", jugador.id), jugadorData);
        } else {
            await firestore().collection("jugadores").doc(jugador.id).set(jugador);
        }
        return true;
    } catch (err) {
        return false;
    }
}

export interface RNFile {
    uri: string;
    type: string;
    name: string;
  }

export async function penjarACloudinary(file: RNFile, resourceType: 'image' | 'video'): Promise<string> {
    const formData = new FormData();
    formData.append('file', file.uri)
    formData.append('upload_preset', 'jugadores_unsigned');
  
    const cloudName = 'dt32twhnq';
    const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
  
    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData
    });
  
    const data = await response.json();
  
    if (!response.ok) throw new Error(data.error?.message || 'Upload failed');
  
    return data.secure_url;
  }
