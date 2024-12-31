import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartType, Chart } from 'chart.js';
import { Media } from '../interfaces/media';
import { MediaService } from '../services/media.service';
import { ChangeDetectorRef } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'fs-estadisticas',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit, AfterViewInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  medias: Media[] = [];
  chartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          '#FFA726', // Videojuegos - Orange
          '#42A5F5', // Animes - Light Blue
          '#EF5350', // Mangas - Red
          '#66BB6A', // Libros - Green
          '#AB47BC', // Peliculas - Purple
          '#CE93D8', // Series - Light Purple
          '#FFEB3B', // Cartoons - Yellow
          '#8D6E63', // Comics - Brown
          '#1E88E5', // Peliculas (Anime genre) - Dark Blue
        ],
      },
    ],
  };

  chartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide the legend
      },
    },
  };

  chartType: ChartType = 'doughnut';

  constructor(
    private readonly mediaService: MediaService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadMediaData();
  }

  ngAfterViewInit(): void {
    if (this.chart && this.chart.chart) {
      this.chart.chart.update();
    }
  }

  loadMediaData(): void {
    this.mediaService.getAll().subscribe((medias: Media[]) => {
      this.medias = medias;
      console.log('Medias received:', this.medias.slice(0, 5)); // Log first few items
      this.prepareChartData();
    });
  }

  prepareChartData(): void {
    const mediaCounts = this.medias.reduce((acc: Record<string, number>, media) => {
      console.log('Processing Media:', media); // Log each media item
      if (media.tipo === 'Peliculas' && media.genero === 'Anime') {
        acc['Peliculas (Anime)'] = (acc['Peliculas (Anime)'] || 0) + 1;
      } else {
        acc[media.tipo] = (acc[media.tipo] || 0) + 1;
      }
      return acc;
    }, {});

    console.log('Media Counts:', mediaCounts); // Log the counts object

    // Update chart data with the processed counts
    this.chartData.labels = Object.keys(mediaCounts);
    this.chartData.datasets[0].data = Object.values(mediaCounts);

    // Manually trigger change detection to update the view
    this.cdr.detectChanges();

    // Trigger chart update after data change
    if (this.chart && this.chart.chart) {
      this.chart.chart.update();
    }
  }
}
