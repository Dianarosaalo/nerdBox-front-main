import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarraLateralComponent } from 'src/app/shared/barra-lateral/barra-lateral.component';
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
  imports: [CommonModule, BarraLateralComponent,RouterLink,FormsModule,MediaFilterPipe],
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

  constructor(
    private readonly mediaService:MediaService,
    private readonly router: Router,
    private readonly http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadMedia();
    document.title="NerdBox"
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

  typesOfMedia=[
    {value:"", label:"None"},
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

  typesOfGenre=[
    {value:"", label:"All"},
    {value:"JRPG", label:"JRPG"},
    {value:"RPG", label:"RPG"}
  ]

  typesOfSubgenre=[
    {value:"", label:"All"},
    {value:"ARPG", label:"ARPG"},
  ]

  typesOfPlatform=[
    {value:"", label:"All"},
    {value:"Nintendo DS", label:"Nintendo DS"},
    {value:"Nintendo 3DS", label:"Nintendo 3DS"},
  ]

  typesOfState=[
    {value:"", label:"All"},
    {value:"Completed", label:"Completed"},
    {value:"Unfinished", label:"Unfinished"},
    {value:"Dropped", label:"Dropped"},
    {value:"Wanna Play", label:"Wanna Play"},
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

}
