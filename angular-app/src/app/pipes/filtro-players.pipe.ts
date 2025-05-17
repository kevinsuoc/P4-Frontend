/*import { Pipe, PipeTransform } from '@angular/core';
import { Jugador } from '../jugador';

@Pipe({
  name: 'filtroPlayers',
})

export class FiltroPlayerPipe implements PipeTransform {
  transform(jugadores: Jugador[], filterType: string | undefined, filterValue: string | undefined): Jugador[] {
    if(!filterType || !jugadores || !filterValue) {
        return jugadores;
    } else if (Number(filterType) == 1) {
        return jugadores.filter((jugador) => jugador?.Nombre.toLowerCase().includes(filterValue.toLowerCase()));
    } else if (Number(filterType) == 2) {
        return jugadores.filter((jugador) => jugador?.Posicion.toLowerCase().includes(filterValue.toLowerCase()));
    } else if (Number(filterType) == 3)  {
        return jugadores.filter((jugador) => jugador?.Edad.toString().includes(filterValue));
    }
    return jugadores
    // this.jugadoresFiltrados = this.jugadores.filter((jugador) => jugador?.Edad == Number(filtro));
  }
}*/

import { Pipe, PipeTransform } from '@angular/core';
import { Jugador } from '../jugador';

@Pipe({
  name: 'filtroPlayers',
})
export class FiltroPlayerPipe implements PipeTransform {
  transform(
    jugadores: Jugador[],
    nombre?: string,
    posicion?: string,
    edad?: string
  ): Jugador[] {
    if (!jugadores) return [];

    return jugadores.filter((jugador) => {
      const normalize = (str: string) =>
        str
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');

      const nombreMatch = nombre
        ? normalize(jugador.Nombre).includes(normalize(nombre))
        : true;

      const posicionMatch = posicion
        ? normalize(jugador.Posicion).includes(normalize(posicion))
        : true;

      const edadMatch = edad
        ? jugador.Edad.toString().includes(edad)
        : true;

      return nombreMatch && posicionMatch && edadMatch;
    });
  }
}
