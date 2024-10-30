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

@Component({
  selector: 'fs-actividad',
  standalone: true,
  imports: [CommonModule, BarraLateralComponent,RouterLink,FormsModule],
  templateUrl: './actividad.component.html',
  styleUrls: ['./actividad.component.css']
})
export class ActividadComponent {

  medias!:Media[]

  constructor(
    private readonly mediaService:MediaService,
    private readonly router: Router,
    private readonly http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadMedia();
  }

  loadMedia(): void {
    this.mediaService.getAll().subscribe((medias: Media[]) => {
      this.medias= medias;
    });
  }

  formatDate(inputDate:any) {

    if (inputDate)
    {
      const date = new Date(inputDate);
      const day = date.getDate();
      const month = date.getMonth() + 1; // Adding 1 because months are zero-indexed
      const year = date.getFullYear();

      return `${day}-${month}-${year}`;
    }
    else
    {
      return "";
    }

  }

}
