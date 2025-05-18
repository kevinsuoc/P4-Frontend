import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { SafeUrlPipe } from '../../pipes/safe-url.pipe';
import { Jugador } from '../../jugador';

@Component({
  selector: 'app-media',
  standalone: true,
  imports: [NgIf, SafeUrlPipe],
  templateUrl: './media.component.html',
  styleUrl: './media.component.css'
})
export class MediaComponent {
  @Input() jugador!: Jugador;
}
