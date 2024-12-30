import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { Media } from '../interfaces/media';
import { MediaService } from '../services/media.service';

@Component({
  selector: 'fs-actividad',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './actividad.component.html',
  styleUrls: ['./actividad.component.css']
})
export class ActividadComponent implements OnInit {

  medias!: Media[];
  filteredMedias!: Media[];
  years: number[] = [];
  selectedYear: number | 'All' = 'All';

  constructor(
    private readonly mediaService: MediaService,
    private readonly router: Router,
    private readonly http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initializeYears();
    this.loadMedia();
  }

  initializeYears(): void {
    const startYear = 2020;
    const currentYear = new Date().getFullYear();
    for (let year = startYear; year <= currentYear; year++) {
      this.years.push(year);
    }
  }

  loadMedia(): void {
    this.mediaService.getAll().subscribe((medias: Media[]) => {
      this.medias = medias;
      this.filterMedia(); // Initially show all media
    });
  }

  filterMedia(): void {
    if (this.selectedYear === 'All') {
      this.filteredMedias = this.medias.filter(media => media.tipo !== 'Miscelanea');
    } else {
      this.filteredMedias = this.medias.filter(media =>
        media.tipo !== 'Miscelanea' &&
        media.fechaTerminado.some(item => {
          const date = new Date(item.fecha);
          return date.getFullYear() === this.selectedYear;
        })
      );
    }
    this.sortMedia();
  }

  sortMedia(): void {
    this.filteredMedias.sort((a, b) => {
      // Get the relevant date for media A
      const relevantDateA = a.fechaTerminado
        .filter(item => new Date(item.fecha).getFullYear() === this.selectedYear)
        .map(item => new Date(item.fecha))[0];

      // Get the relevant date for media B
      const relevantDateB = b.fechaTerminado
        .filter(item => new Date(item.fecha).getFullYear() === this.selectedYear)
        .map(item => new Date(item.fecha))[0];

      // If no relevant dates, fallback to earliest fechaTerminado
      const fallbackDateA = new Date(a.fechaTerminado[0].fecha);
      const fallbackDateB = new Date(b.fechaTerminado[0].fecha);

      const dateA = relevantDateA || fallbackDateA;
      const dateB = relevantDateB || fallbackDateB;

      return dateA > dateB ? 1 : -1;
    });
  }

  selectYear(year: number | 'All'): void {
    this.selectedYear = year;
    this.filterMedia();
  }

  formatDate(inputDate: any): string {
    if (inputDate) {
      const date = new Date(inputDate);
      const day = date.getDate();
      const month = date.getMonth() + 1; // Adding 1 because months are zero-indexed
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } else {
      return '';
    }
  }

  getItemIndex(index: number): number | null {
    return this.selectedYear !== 'All' ? index + 1 : null;
  }

  isYearMatch(fecha: string | Date): boolean {
    const date = new Date(fecha);
    return date.getFullYear() === this.selectedYear;
  }
}

