import { Component, inject } from '@angular/core';
import { PlayersComponent } from "../players/players.component";
import { DetailComponent } from '../detail/detail.component';
import { Jugador } from '../../jugador';
import { NgIf } from '@angular/common';
import { playerClickService } from '../../playerClick.service';
import { JugadorService } from '../../jugador.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [PlayersComponent, DetailComponent, NgIf],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  jugadores: Jugador[] = [];
  jugador?: Jugador;
  filterType: string = '';
  filterValue: string = '';

  playerClickService: playerClickService = inject(playerClickService);
  jugadoresService: JugadorService = inject(JugadorService);

  ngOnInit(): void {
    this.jugadoresService.getJugadores().subscribe(jugadores => {
      this.jugadores = jugadores.sort((a, b) => a.Dorsal - b.Dorsal);
    });
  
    // Escuchar clicks desde el servicio
    this.playerClickService.jugador$.subscribe(jugador => {
      this.jugador = jugador;
    });
  }

  filtrarJugadores(value: string, type: string) {
    this.filterType = type;
    this.filterValue = value;
  }
}
