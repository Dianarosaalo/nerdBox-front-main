import { Component, ViewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Media } from '../interfaces/media';
import { Router } from '@angular/router';
import { MediaService } from '../services/media.service';
import { fechaTerminado } from '../interfaces/media';

@Component({
  selector: 'fs-media-form',
  standalone: true,
  imports: [CommonModule,FormsModule,HttpClientModule],
  templateUrl: './media-form.component.html',
  styleUrls: ['./media-form.component.css']
})
export class MediaFormComponent {

  newMedia!:Media
  @ViewChild('mediaForm') characterForm!:NgForm

  saved = false;
  edit = false;
  activeTab="Obligatorios";

  constructor(
    private readonly router: Router,
    private readonly location: Location,
    private readonly mediaService:MediaService,
    private readonly http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.newMedia = this.resetMedia();

    const currentUrl = this.location.path(); // all of this means im editing
    currentUrl.split('/');
    const id = currentUrl.split('/')[2];
    if (currentUrl.split('/')[3]==="edit")
    {
      this.edit = true;
      console.log(id);
      this.mediaService.getById(String(id)).subscribe(
        c => {
          this.newMedia = c
        });
    }
  }

  resetMedia():Media{
    return{
      titulo:'',
      imagen:'',
      tipo:'Videojuego',
      genero:'',
      plataforma:'',
      fechaLanzamiento:new Date(),
      fechaTerminado:[],
      notaObjetiva:0,
      notaSubjetiva:0,
      desarrolladora:'',
      subgenero:'',
      fechaCreacion:new Date(),
      fechaModificacion: new Date(),
      review:'',
      tiempoJuego: 0

    }}

    onTabClick(tab:string)
  {
    this.activeTab=tab;
  }

    changeImage(fileInput: HTMLInputElement) {
      if (!fileInput.files || fileInput.files.length === 0) {
        return;
      }
      const reader: FileReader = new FileReader();
      reader.readAsDataURL(fileInput.files[0]);
      reader.addEventListener('loadend', () => {
        this.newMedia.imagen = reader.result as string;
      });
    }

    validClasses(ngModel: NgModel, validClass: string, errorClass: string) {
      return {
        [validClass]: ngModel.touched && ngModel.valid,
        [errorClass]: ngModel.touched && ngModel.invalid,
      };
    }

    addMedia() {
      this.saved = true;

      if (!this.edit)
      {
        this.mediaService.post(this.newMedia).subscribe({
          next: () => {
            console.log("Correcto");
          }
        });
        this.router.navigate(['/media','home']);
      }

      else{
        this.mediaService.edit(this.newMedia).subscribe({
          next: () => {console.log("correcto")},

          error: (error) => console.error(error),
        });
        //this.router.navigate(['/characters', this.newCharacter._id]);
        this.router.navigate(['/media','home']);

      }

    }

    tipos=[
    {value:'Videojuego',label:"Videojuego"},
    {value:'Anime',label:"Anime"},
    {value:'Manga',label:"Manga"},
    {value:'Libro',label:"Libro"},
    {value:'Pelicula',label:"Película"},
    {value:'Serie',label:"Serie"},
    {value:'Cartoons',label:"Cartoon"},
    {value:'Comic',label:"Cómic"},
    {value:'Rol',label:"Rol"},
    {value:'Miscelanea',label:"Miscelánea"},
    ]

    tiposEstado=[
    {value:"Completed", label:"Completed"},
    {value:"Unfinished", label:"Unfinished"},
    {value:"Dropped", label:"Dropped"},
    {value:"Wanna Play", label:"Wanna Play"},
    ]

    // state and date handler

    showNewState = false;

    newState = {
      fecha: new Date(),
      estado: ''
    };

    showNewStateForm() {
      this.showNewState = true;
    }

    addState() {
      if (this.newState.fecha && this.newState.estado) {
        const state= {"fecha":this.newState.fecha,"estado":this.newState.estado}
        this.newMedia.fechaTerminado.push({ ...state });
        this.newState = { fecha: new Date(), estado: '' };
        this.showNewState = false;
      }
    }

    deleteState(state: any) {
      const index = this.newMedia.fechaTerminado.indexOf(state);
      if (index !== -1) {
        this.newMedia.fechaTerminado.splice(index, 1);
      }
    }

}
