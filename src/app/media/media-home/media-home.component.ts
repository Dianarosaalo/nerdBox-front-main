import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { Media } from '../interfaces/media';
import { MediaService } from '../services/media.service';
import { MediaResponse, MediasResponse } from '../interfaces/mediaResponse';
import { MediaFilterPipe } from '../pipes/media.filter.pipe';

@Component({
  selector: 'fs-media-home',
  standalone: true,
  imports: [CommonModule,RouterLink,FormsModule,MediaFilterPipe],
  templateUrl: './media-home.component.html',
  styleUrls: ['./media-home.component.css']
})
export class MediaHomeComponent {

  medias!:Media[]

  search=''
  type='Videojuego'
  order='';
  genre='';
  subgenre='';
  platform=''
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  state:string='';
  year = 0
  bigContainer=true;
  smallContainer=false;

  constructor(
    private readonly mediaService:MediaService,
    private readonly router: Router,
    private readonly http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadMedia();
    document.title="NerdBox";
    this.onMediaTypeChange();
  }

  loadMedia(): void {
    this.mediaService.getAll().subscribe((medias: Media[]) => {
      this.medias= medias;
    });
  }

  typeOfOrders=[
    {value:"", label:"None"},
    {value:"nombre", label:"Name"},
    {value:"score", label:"Score"},
    {value:"fechavista", label:"Completion Date"},
    {value:"tiempoJuego", label:"Time Played"},
  ]

  // tipos de media y generos

  typesOfMedia=[
    {value:"", label:"[Todos]"},
    {value:"Videojuego", label:"Videojuegos"},
    {value:"Anime", label:"Animes"},
    {value:"Manga", label:"Mangas"},
    {value:"Libro", label:"Libros"},
    {value:"Pelicula", label:"Películas"},
    {value:"Serie", label:"Series"},
    {value:"Cartoons", label:"Cartoons"},
    {value:"Comic", label:"Cómics"},
    {value:"Rol", label:"Rol"},
    {value:"Miscelanea", label:"Miscelánea"},
  ]

  typesOfGenre: { [key: string]: { value: string; label: string }[] } ={
    //{value:"", label:"All"},
    'Videojuego': [
      { value: "Acción", label: "Acción" },
      { value: "RPG", label: "RPG" },
      { value: "JRPG", label: "JRPG" },
      { value: "Aventura", label: "Aventuras" },
      { value: "Hack N' Slash", label: "Hack N' Slash" },
      { value: "Hunting", label: "Hunting" },
      { value: "Estrategia", label: "Estrategia" },
      { value: "Sandbox", label: "Sandbox" },
      { value: "Survival", label: "Survival" },
      { value: "Survival Horror", label: "Survival Horror" },
      { value: "MMORPG", label: "MMORPG" },
      { value: "Moba", label: "Moba" },
      { value: "Shooter", label: "Shooter" },
      { value: "Fighting", label: "Fighting" },
      { value: "Plataformas", label: "Plataformas" },
      { value: "Point & Click", label: "Point & Click" },
      { value: "Racing", label: "Racing" },
      { value: "Deporte", label: "Deporte" },
      { value: "Killing Friends", label: "Killing Friends" },
      { value: "Arcade", label: "Arcade" },
      { value: "Mundo Abierto", label: "Mundo Abierto" },
      { value: "Monsters", label: "Monsters" },
      { value: "Metroidvania", label: "Metroidvania" },
      { value: "Rogue-Lite", label: "Rogue-Lite" },
      { value: "Indie JRPG", label: "Indie JRPG" },
      { value: "Expansion", label: "Expansion" },
    ],
    'Pelicula': [
      { value: "Drama", label: "Drama" },
      { value: "Comedia", label: "Comedia" },
    ],
  }

  typesOfSubgenre: { [key: string]: { value: string; label: string }[] }={
    'RPG': [
      { value: "CRPG", label: "CRPG" },
      { value: "ARPG", label: "ARPG" },
      { value: "Souls", label: "Souls" },
      { value: "Souls-Like", label: "Souls-Like" },
    ],
  }

  availableGenres:{ value: string; label: string }[] = [];
  availableSubgenres:{ value: string; label: string }[] = [];

  onMediaTypeChange() {
    this.availableGenres = this.typesOfGenre[this.type] || [];
    this.genre = '';  // Reset genre
    this.availableSubgenres = [];  // Clear subgenres
    this.subgenre = '';  // Reset subgenre
  }

  onGenreChange() {
    this.availableSubgenres = this.typesOfSubgenre[this.genre] || [];
    this.subgenre = '';  // Reset subgenre
  }

  // plataformas

  typesOfPlatform=[
    {value:"", label:"All"},
    {value:"PS1", label:"PS1"},
    {value:"PS2", label:"PS2"},
    {value:"PS3", label:"PS3"},
    {value:"PS4", label:"PS4"},
    {value:"PS5", label:"PS5"},
    {value:"PSP", label:"PSP"},
    {value:"PSVITA", label:"PSVITA"},
    {value:"MS-DOS", label:"MS-DOS"},
    {value:"PC 1º", label:"PC 1º"},
    {value:"PC 2º", label:"PC 2º"},
    {value:"PC 3º", label:"PC 3º"},
    {value:"PC 4º", label:"PC 4º"},
    {value:"PC 5º", label:"PC 5º"},
    {value:"Web Browser", label:"Web Browser"},
    {value:"Xbox", label:"Xbox"},
    {value:"Xbox 360", label:"Xbox 360"},
    {value:"Xbox One", label:"Xbox One"},
    {value:"Nintendo Nes", label:"Nintendo Nes"},
    {value:"Nintendo Snes", label:"Nintendo Snes"},
    {value:"Nintendo 64", label:"Nintendo 64"},
    {value:"Nintendo GameCube", label:"Nintendo GC"},
    {value:"Nintendo DS", label:"Nintendo DS"},
    {value:"Nintendo 3DS", label:"Nintendo 3DS"},
    {value:"Nintendo Wii", label:"Nintendo Wii"},
    {value:"Nintendo Wii U", label:"Nintendo Wii U"},
    {value:"Nintendo Switch", label:"Nintendo Switch"},
    {value:"Sega MegaDrive", label:"Sega MegaDrive"},
    {value:"Sega DreamCast", label:"Sega DreamCast"},
  ]

  typesOfState=[
    {value:"", label:"All"},
    {value:"Completed", label:"Completed"},
    {value:"Unfinished", label:"Unfinished"},
    {value:"Dropped", label:"Dropped"},
    {value:"Wanna Play", label:"Wanna Play"},
    {value:"Not Played", label:"Not Played"},
  ]

  typesOfYears = [
    {value:0, label:'All'},
    {value: 2024, label: '2024'},
    {value: 2023, label: '2023'},
    {value: 2022, label: '2022'},
    {value: 2021, label: '2021'},
    {value: 2020, label: '2020'},
    {value: 2019, label: '2019'},
    {value: 2018, label: '2018'},
    {value: 2017, label: '2017'},
    {value: 2016, label: '2016'},
    {value: 2015, label: '2015'},
    {value: 2014, label: '2014'},
    {value: 2013, label: '2013'},
    {value: 2012, label: '2012'},
    {value: 2011, label: '2011'},
    {value: 2010, label: '2010'},
    {value: 2009, label: '2009'},
    {value: 2008, label: '2008'},
    {value: 2007, label: '2007'},
    {value: 2006, label: '2006'}
  ]

  get filteredMedias(): Media[] {
    return this.medias.filter(media => {
        const matchesType = this.type ? media.tipo === this.type : true;
        const matchesGenre = this.genre ? media.genero === this.genre : true;
        const matchesSubgenre = this.subgenre ? media.subgenero === this.subgenre : true;
        const matchesPlatform = this.platform ? media.plataforma === this.platform : true;
        const matchesSearch = media.titulo.toLowerCase().includes(this.search.toLowerCase());
        const matchesState = this.state ? media.fechaTerminado.some((ft) => ft.estado === this.state) : true;

        // Adjusted matchesYear to handle date parsing as in the standalone filter
        const matchesYear = this.year && this.year !== 0
            ? media.fechaTerminado.some((ft) => {
                  const fechaAsDate = typeof ft.fecha === 'string' ? new Date(ft.fecha) : ft.fecha;
                  return fechaAsDate instanceof Date && !isNaN(fechaAsDate.getTime()) && fechaAsDate.getFullYear() === Number(this.year);
              })
            : true;

        return matchesType && matchesGenre && matchesSubgenre && matchesPlatform && matchesSearch && matchesState && matchesYear;
    });
}

  getScoreColor(score: number): string {
    if (score > 74) {
      return 'rgb(6, 230, 6)'; // Bright green for scores over 74
    } else if (score >= 70 && score <= 74) {
      return '#a1eb34'; // Yellowish green for scores between 70 and 74
    } else if (score >= 45 && score < 70) {
      return 'yellow'; // Yellow for scores between 45 and 69
    } else {
      return 'red'; // Red for scores under 45
    }
  }

  sortedYears: string[] = []; // Define this to hold sorted years
  mediaByYear: { [key: string]: Media[] } = {}; // Define to hold media grouped by year

  groupByYear(): void {
    this.bigContainer = !this.bigContainer;
    this.smallContainer = !this.smallContainer;

    // Clear previous media by year
    this.mediaByYear = {};
    this.sortedYears = [];

    // Filter medias based on existing criteria
    const filteredMedias = this.medias.filter((media) => {
        const matchesSearch = this.search ? media.titulo.includes(this.search) : true;
        const matchesType = this.type ? media.tipo === this.type : true;
        const matchesGenre = this.genre ? media.genero === this.genre : true;
        const matchesSubgenre = this.subgenre ? media.subgenero === this.subgenre : true;
        const matchesPlatform = this.platform ? media.plataforma === this.platform : true;
        const validStates = ["Completed", "Unfinished", "Dropped", "Wanna Play", "Not Played"];
        const matchesState = this.state
            ? media.fechaTerminado.some((ft) => ft.estado === this.state)
            : media.fechaTerminado.some((ft) => validStates.includes(ft.estado));

        return matchesSearch && matchesType && matchesGenre && matchesSubgenre && matchesPlatform && matchesState;
    });

    // Create an array with transformed media items, removing originals with multiple fechas
    const separatedMedias: any[] = [];
    filteredMedias.forEach((media) => {
        if (media.fechaTerminado.length > 1) {
            media.fechaTerminado.forEach((ft) => {
                const fechaAsDate = typeof ft.fecha === 'string' ? new Date(ft.fecha) : ft.fecha;

                // Ensure the date is valid
                if (fechaAsDate instanceof Date && !isNaN(fechaAsDate.getTime())) {
                    const clonedMedia = { ...media, fechaTerminado: [ft] }; // Clone media with only this date
                    console.log(clonedMedia);
                    separatedMedias.push(clonedMedia);
                }
            });
        } else {
            // If only one fechaTerminado, keep the original item
            separatedMedias.push(media);
        }
    });

    // Order filtered medias
    const orderedMedias = this.OrderBy(this.order, separatedMedias);

    // Group separated media items by year
    const startYear = 2006;
    const endYear = new Date().getFullYear();

    orderedMedias.forEach((media) => {
        const ft = media.fechaTerminado[0]; // Each separatedMedia has only one fechaTerminado
        const fechaAsDate = typeof ft.fecha === 'string' ? new Date(ft.fecha) : ft.fecha;

        if (fechaAsDate instanceof Date && !isNaN(fechaAsDate.getTime())) {
            const fullYear = fechaAsDate.getFullYear();

            if (fullYear >= startYear && fullYear <= endYear) {
                if (!this.mediaByYear[fullYear]) {
                    this.mediaByYear[fullYear] = [];
                }
                this.mediaByYear[fullYear].push(media);
            }
        }
    });

    // Sort years in descending order and assign to sortedYears
    this.sortedYears = Object.keys(this.mediaByYear).sort((a, b) => Number(b) - Number(a));
}


  // OrderBy function
  OrderBy(order: string, medias: Media[]): Media[] {
      const myMedia = [...medias];
      if (order === "nombre") {
          myMedia.sort((a, b) => {
              if (a.titulo === b.titulo) return 0;
              return a.titulo > b.titulo ? 1 : -1;
          });
      } else if (order === "score") {
          myMedia.sort((a, b) => {
              if (a.notaObjetiva === b.notaObjetiva) return 0;
              return a.notaObjetiva < b.notaObjetiva ? 1 : -1;
          });
      } else if (order === "fechavista") {
          myMedia.sort((a, b) => {
              if (a.fechaTerminado[0].fecha === b.fechaTerminado[0].fecha) return 0;
              return a.fechaTerminado[0].fecha > b.fechaTerminado[0].fecha ? 1 : -1;
          });
      } else if (order === "tiempoJuego") {
          myMedia.sort((a, b) => {
              if (a.tiempoJuego === b.tiempoJuego) return 0;
              return a.tiempoJuego < b.tiempoJuego ? 1 : -1;
          });
      }
      return myMedia;
  }

  hoveredType: string | null = null;
hoveredGenre: string | null = null;

// Called when hovering over a media type
onMediaTypeHover(type: string) {
  this.hoveredType = type;
  this.type = type; // Temporarily select it
  this.availableGenres = this.typesOfGenre[type] || [];
  this.genre = "";
  this.availableSubgenres = [];
  this.onMediaTypeChange();
}

// Called when hovering over a genre
onGenreHover(genre: string) {
  this.hoveredGenre = genre;
  this.availableSubgenres = this.typesOfSubgenre[genre] || [];
}

// Selectors to update model on click
selectType(type: string) {
  this.type = type;
  this.onMediaTypeChange();
}

selectGenre(genre: string) {
  this.genre = genre;
  this.onGenreChange();
}

selectSubgenre(subgenre: string) {
  this.subgenre = subgenre;
}

dropdownVisible= false;
toggleDropdown() {
  this.dropdownVisible = !this.dropdownVisible; // Toggle visibility
}


}
