import { Component, ViewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Media } from '../interfaces/media';
import { Router } from '@angular/router';
import { MediaService } from '../services/media.service';
import { fechaTerminado } from '../interfaces/media';
import { IgdbService } from '../services/igdb.service';

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
    private igdbService: IgdbService
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
      fechaTerminado:[{ "fecha": new Date(2150, 11, 25), "estado": "Not Played" }],
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
        this.router.navigate(['/media', this.newMedia._id]);
        //this.router.navigate(['/media','home']);

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
    {value:"Watched", label:"Watched"},
    {value:"Tried", label:"Tried"},
    {value:"Wanna Play", label:"Wanna Play"},
    {value:"Not Played", label:"Not Played"},
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

    // IGDB Integration

    games: any[] = [];
    //titulo es mi searchBar

    searchGames() {
      if (this.newMedia.titulo.trim()) {
        this.igdbService.searchGames(this.newMedia.titulo).subscribe(
          (data) => {
            this.games = data;
            console.log(this.games);
          },
          (error) => {
            console.error('Error fetching games:', error);
          }
        );
      }
    }

    selectGame(game: any): void {
      this.newMedia = {
        _id: this.newMedia._id,
        titulo: game.name, // Mapping API 'name' to 'titulo'
        imagen: this.newMedia.imagen,
        tipo: this.newMedia.tipo,
        genero: game.genres && game.genres.length > 0 ? game.genres[0].name : 'Unknown Genre', // Handle missing genres
        plataforma: game.platforms && game.platforms.length > 0 ? game.platforms[0].name : '', // Use only the first platform//game.platforms ? game.platforms.map((p: any) => p.name).join(', ') : '', // Joining multiple platforms if needed
        fechaLanzamiento: game.release_dates && game.release_dates.length > 0
      ? new Date(game.release_dates[0].date) // Parse full date here
      : new Date(), // Default to current date if not available
        fechaTerminado: this.newMedia.fechaTerminado,
        notaObjetiva: this.newMedia.notaObjetiva,
        notaSubjetiva: this.newMedia.notaSubjetiva,
        desarrolladora: game.developers ? game.developers.map((d: any) => d.name).join(', ') : '', // Joining multiple developers if needed
        subgenero: this.newMedia.subgenero,
        fechaCreacion: this.newMedia.fechaCreacion,
        fechaModificacion: this.newMedia.fechaCreacion,
        review: this.newMedia.review,
        tiempoJuego: this.newMedia.tiempoJuego
      };

      // Fetch the cover image with better quality
      if (game.cover && game.cover.url) {
        const highResUrl = game.cover.url.replace('t_thumb', 't_cover_big'); // Replace 't_thumb' with 't_cover_big'
        this.http.get(highResUrl, { responseType: 'blob' }).subscribe((imageBlob: Blob) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            // Convert the image to a base64 string and assign it to 'imagen'
            this.newMedia.imagen = reader.result as string; // base64 string
          };
          reader.readAsDataURL(imageBlob); // Read the image as base64
        });
      } else {
        this.newMedia.imagen = ''; // If no image available, set to empty string
      }
    }

    formatDate(date: number): string {
      const d = new Date(date * 1000); // Assuming the release date is in seconds (UNIX timestamp)
      return d.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    }


}
