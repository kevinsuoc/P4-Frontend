import { Component, Input, SimpleChanges, OnChanges, OnInit } from '@angular/core';
import { PlayerCardComponent } from '../player-card/player-card.component';
import { FiltroPlayerPipe } from '../../pipes/filtro-players.pipe';
import { NgFor, NgIf } from '@angular/common';
import { Jugador } from '../../jugador';
import { FormsModule } from '@angular/forms';
import { AddPlayerComponent } from '../add-player/add-player.component';


@Component({
  selector: 'app-players',
  standalone: true,
  imports: [
    PlayerCardComponent,
    FiltroPlayerPipe,
    NgFor,
    NgIf,
    FormsModule, // <-- Esto soluciona el error
    AddPlayerComponent
  ],
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css']
})

//he cambiado a onChanges ya que al añadir jugadores puede que onInit no estuviera listo para los filtros de los jugadores
export class PlayersComponent implements OnChanges {
  @Input() jugadores: Jugador[] = [];

  filtroNombre: string = '';
  filtroPosicion: string = '';
  posicionesDisponibles: string[] = [];
  formularioVisible: boolean = false;

  posiciones = [
    'Base',
    'Escolta',
    'Alero',
    'Ala-Pivot',
    'Pivot'
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['jugadores'] && this.jugadores.length > 0) {
      this.actualizarPosiciones();
    }
  }

  actualizarPosiciones() {
    this.posicionesDisponibles = [
      ...new Set(this.jugadores.map(j => j.Posicion))
    ].sort();
  }

  createForm() {
    this.formularioVisible = true;
    document.body.classList.add('overflow-hidden');
  }
  
  hideForm() {
    this.formularioVisible = false;
    document.body.classList.remove('overflow-hidden');
  }

  refrescarLista() {
    this.hideForm();
  }
}
