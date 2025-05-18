import { Injectable, inject } from '@angular/core';
import { Jugador, jugadorConverter } from './jugador';
import {
  Firestore,
  collection,
  doc,
  updateDoc,
  deleteDoc,
  collectionData,
  setDoc
} from '@angular/fire/firestore';
import { getDownloadURL, ref, uploadBytes } from '@angular/fire/storage';
import { Storage } from '@angular/fire/storage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JugadorService {
  firestore: Firestore = inject(Firestore);
  storage: Storage = inject(Storage);

  getJugadores(): Observable<Jugador[]> {
    const colRef = collection(this.firestore, 'jugadores').withConverter(jugadorConverter);
    return collectionData(colRef, { idField: 'id' });
  }

  updateJugador(jugador: Jugador) {
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
    if (jugador.Image !== undefined) jugadorData.Image = jugador.Image;
    if (jugador.Video !== undefined) jugadorData.Video = jugador.Video;

    const jugadorDoc = doc(this.firestore, 'jugadores', jugador.id!).withConverter(jugadorConverter);
    return updateDoc(jugadorDoc, jugadorData);
  }

  eliminarJugador(id: string) {
    const jugadorDoc = doc(this.firestore, 'jugadores', id);
    return deleteDoc(jugadorDoc);
  }

  async uploadFile(file: File, path: string): Promise<string> {
    const storageRef = ref(this.storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  }

  async insertarJugador(jugador: Jugador): Promise<void> {
    const jugadorRef = doc(this.firestore, 'jugadores', jugador.id!).withConverter(jugadorConverter);
    return await setDoc(jugadorRef, jugador);
  }

  async penjarACloudinary(file: File, resourceType: 'image' | 'video'): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
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
}