import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Jugador } from '@root/src/app/jugador';
import { JugadorService } from '@root/src/app/jugador.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-player',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './add-player.component.html',
  styleUrls: ['./add-player.component.css']
})
export class AddPlayerComponent {
  playerForm: FormGroup;
  selectedImageFile?: File;
  selectedVideoFile?: File;
  posiciones = ['Base', 'Escolta', 'Alero', 'Ala-Pivot', 'Pivot'];

  @Output() jugadorGuardado = new EventEmitter<void>();
  @Output() cerrar = new EventEmitter<void>();

  jugadorService = inject(JugadorService);
  fb = inject(FormBuilder);

  constructor() {
    this.playerForm = this.fb.group({
      Nombre: ['', Validators.required],
      Dorsal: [null, Validators.required],
      Posicion: ['', Validators.required],
      Edad: [null, Validators.required],
      Altura: ['', Validators.required],
      Nacionalidad: ['', Validators.required],
      Descripcion: ['', Validators.required]
    });
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedImageFile = input.files[0];
    }
  }

  onVideoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedVideoFile = input.files[0];
    }
  }

  async onSubmit() {
    const defaultAvatar = 'https://res.cloudinary.com/dt32twhnq/image/upload/v1744402427/default_ine6rb.webp'
    if (this.playerForm.invalid) return;

    const jugador: Jugador = {
      id: crypto.randomUUID(),
      ...this.playerForm.value,
    };

    try {
      if (this.selectedImageFile) {
        jugador.Image = await this.jugadorService.penjarACloudinary(this.selectedImageFile, 'image');
      } else {
        jugador.Image = defaultAvatar;
      }
      
      if (this.selectedVideoFile) {
        jugador.Video = await this.jugadorService.penjarACloudinary(this.selectedVideoFile, 'video');
      } else {
        delete jugador.Video;
      }


      // if (this.selectedImageFile) {
      //   jugador.Image = await this.jugadorService.uploadFile(
      //     this.selectedImageFile,
      //     `jugadores/${jugador.id}/imagen`
      //   );
      // } else {
      //   delete jugador.Image;
      // }

      // if (this.selectedVideoFile) {
      //   jugador.Video = await this.jugadorService.uploadFile(
      //     this.selectedVideoFile,
      //     `jugadores/${jugador.id}/video`
      //   );
      // } else {
      //   delete jugador.Video;
      // }

      await this.jugadorService.insertarJugador(jugador);

      alert('Jugador guardado correctamente');
      this.jugadorGuardado.emit();
      this.cerrar.emit();

    } catch (error) {
      console.error('Error al guardar el jugador:', error);
      console.error(error);
      alert('Hubo un error al guardar el jugador.');
    }
  }
}