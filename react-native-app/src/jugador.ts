export interface Jugador {
  id?: string;
  Nombre: string;
  Dorsal: number;
  Posicion: string;
  Edad: number;
  Altura: string;
  Nacionalidad: string;
  Descripcion: string;
  Image?: string;
  Video?: string;
}

export function jugadorToJson(jugador: Jugador): any {
  return {
    id: jugador.id ?? '',
    Nombre: jugador.Nombre,
    Dorsal: jugador.Dorsal.toString(),
    Posicion: jugador.Posicion,
    Edad: jugador.Edad.toString(),
    Altura: jugador.Altura,
    Nacionalidad: jugador.Nacionalidad,
    Descripcion: jugador.Descripcion,
    Image: jugador.Image ?? '',
    Video: jugador.Video ?? '',
  };
}

export function jsonToJugador(data: any): Jugador {
  return {
    id: data.id,
    Nombre: String(data.Nombre),
    Dorsal: Number(data.Dorsal),
    Posicion: String(data.Posicion),
    Edad: Number(data.Edad),
    Altura: String(data.Altura),
    Nacionalidad: String(data.Nacionalidad),
    Descripcion: String(data.Descripcion),
    Image: data.Image ? String(data.Image) : undefined,
    Video: data.Video ? String(data.Video) : undefined,
  };
}