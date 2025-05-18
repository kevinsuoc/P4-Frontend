import { Injectable } from '@angular/core';
import { Jugador } from './jugador';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class playerClickService {
  private jugadorSubject = new BehaviorSubject<Jugador | undefined>(undefined);
  jugador$ = this.jugadorSubject.asObservable();

  playerClicked(jugador: Jugador) {
    this.jugadorSubject.next(jugador);
  }

  playerHidden() {
    this.jugadorSubject.next(undefined);
  }
}
