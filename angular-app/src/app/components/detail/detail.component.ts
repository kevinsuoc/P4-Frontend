import { Component, Input, inject } from '@angular/core';
import { Jugador } from '../../jugador';
import { playerClickService } from '../../playerClick.service';
import { NgIf, NgFor } from '@angular/common';
import { MediaComponent } from '../media/media.component';
import { SimpleChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { JugadorService } from '../../jugador.service';


@Component({
  selector: 'app-detail',
  imports: [
    NgIf,
    NgFor, 
    MediaComponent,
    ReactiveFormsModule
  ],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css'
})

export class DetailComponent {
  @Input() jugador!: Jugador;
  edit: boolean;
  nombreControl = new FormControl('', Validators.required);
  dorsalControl = new FormControl(0, Validators.required);
  posicionControl = new FormControl('', Validators.required);
  nacionalidadControl = new FormControl('', Validators.required);
  alturaControl = new FormControl('', Validators.required);
  descripcionControl = new FormControl('', Validators.required);
  edadControl = new FormControl(0, Validators.required);
  defaultAvatar = 'https://res.cloudinary.com/dt32twhnq/image/upload/v1744402427/default_ine6rb.webp'

  selectedImageFile?: File;
  selectedVideoFile?: File;

  posiciones: string[] = ['Base', 'Escolta', 'Alero', 'Ala-Pivot', 'Pivot'];

  jugadorService: JugadorService = inject(JugadorService);
  playerClickService: playerClickService = inject(playerClickService);

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['jugador']) {
      this.edit = false;
    }
  }

  clearPlayer(){
    this.playerClickService.playerHidden();
  }

  editPlayer(){
    this.edit = true;
    this.nombreControl.setValue(this.jugador.Nombre);
    this.dorsalControl.setValue(this.jugador.Dorsal);
    this.posicionControl.setValue(this.jugador.Posicion);
    this.nacionalidadControl.setValue(this.jugador.Nacionalidad);
    this.alturaControl.setValue(this.jugador.Altura);
    this.descripcionControl.setValue(this.jugador.Descripcion);
    this.edadControl.setValue(this.jugador.Edad);
    window.scrollTo({ top: 0, behavior: 'smooth' })

    //esperamos a que el elemento exista en el DOM
    setTimeout(() => {
      const textarea = document.getElementById('descripcion') as HTMLTextAreaElement;
      if (textarea) this.autoResizeTextarea(textarea);
    });
  }

  eliminarJugador() {
    if (confirm("¿Estás seguro de que quieres eliminar a este jugador?")) {
      this.jugadorService.eliminarJugador(this.jugador.id!).then(() => {
        //alert("Jugador eliminado con éxito.");
        this.clearPlayer();
      }).catch((error) => {
        console.error("Error al eliminar el jugador:", error);
        alert("Hubo un problema al eliminar el jugador.");
      });
    }
  }

  cancelEdit(){
    this.edit = false;
  }

  async acceptEdit(){
    this.edit = false;
    this.jugador.Nombre = this.nombreControl.getRawValue()!;
    this.jugador.Dorsal = this.dorsalControl.getRawValue()!;
    this.jugador.Posicion = this.posicionControl.getRawValue()!;
    this.jugador.Nacionalidad = this.nacionalidadControl.getRawValue()!;
    this.jugador.Altura = this.alturaControl.getRawValue()!;
    this.jugador.Descripcion = this.descripcionControl.getRawValue()!;
    this.jugador.Edad = this.edadControl.getRawValue()!;
    
    try{
      if (this.selectedImageFile) {
        this.jugador.Image = await this.jugadorService.penjarACloudinary(this.selectedImageFile, 'image');
        console.log(this.jugador.Image);
      } else {
        this.jugador.Image = this.defaultAvatar;
      }
      
      if (this.selectedVideoFile) {
        this.jugador.Video = await this.jugadorService.penjarACloudinary(this.selectedVideoFile, 'video');
        console.log(this.jugador.Video);
      } else {
        delete this.jugador.Video;
      }
    } catch (error) {
      console.error('Error al guardar el jugador:', error);
      console.error(error);
      alert('Hubo un error al guardar el jugador.');
    }
    this.jugadorService.updateJugador(this.jugador);
    
  }

  constructor() {
    this.edit = false;
  }

 //ajustamos el ancho del input de la descripción de edición de jugadores
  autoResizeTextarea(textarea: HTMLTextAreaElement): void {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }
  
}
