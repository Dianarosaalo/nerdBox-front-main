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
  selectedMediaType= '';  // This will store the selected media type
  typesOfMedia = [
    { value: '', label: '[Todos]' },
    { value: 'Videojuego', label: 'Videojuegos' },
    { value: 'Anime', label: 'Animes' },
    { value: 'Manga', label: 'Mangas' },
    { value: 'Libro', label: 'Libros' },
    { value: 'Pelicula', label: 'Películas' },
    { value: 'Serie', label: 'Series' },
    { value: 'Cartoons', label: 'Cartoons' },
    { value: 'Comic', label: 'Cómics' },
    { value: 'Rol', label: 'Rol' },
    { value: 'Miscelanea', label: 'Miscelánea' }
  ];

  chartData: ChartConfiguration<'pie'>['data'] = {
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
          'Pink', // Peliculas (Anime genre) - Dark Blue
          'Black', // Peliculas (Anime genre) - Dark Blue
        ],
      },
    ],
  };

  chartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide the legend
      },
      tooltip: {
        enabled: false, // Completely disable tooltips
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        external: () => {}, // Ensure no external tooltip rendering
      },
    },
    hover: {
      mode: 'nearest', // Set hover mode to nearest, but we'll override with interaction
    },
    interaction: {
      mode: 'nearest', // Ensures the interaction is based on the nearest element
      intersect: true,  // Only trigger interaction when directly over a segment
    },
    events: ['click'],  // Only allow 'click' interactions, if necessary (no hover)
  };

  chartType: ChartType = 'pie';

  constructor(
    private readonly mediaService: MediaService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadMediaData();
  }

  ngAfterViewInit(): void {
    if (this.chart?.chart) {
      const chartInstance = this.chart.chart;

      // Check if chartInstance.options.plugins and chartInstance.options.plugins.legend are defined
      if (chartInstance.options.plugins && chartInstance.options.plugins.legend) {
        chartInstance.options.plugins.legend.display = false;
        chartInstance.update(); // Update the chart to apply changes
      }
    }
  }

  loadMediaData(): void {
    this.mediaService.getAll().subscribe((medias: Media[]) => {
      this.medias = medias;
      console.log('Medias received:', this.medias.slice(0, 5)); // Log first few items
      this.prepareChartData();
    });
  }

  onMediaTypeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement; // Cast to HTMLSelectElement
    const selectedType = selectElement.value;
    this.selectedMediaType = selectedType;  // Update the selected media type
    this.prepareChartData();  // Re-prepare chart data based on the selected type
  }

  prepareChartData(): void {
    const mediaCounts = this.medias.reduce((acc: Record<string, number>, media) => {
      // Ensure that if there is no genre, we assign 'Unknown'
      const genre = media.genero || 'Unknown';

      // Check if the selected type is "Todos" or any other type
      if (this.selectedMediaType === '' || media.tipo === this.selectedMediaType) {
        if (this.selectedMediaType === '') {
          // Count based on 'tipo' only, no need to check 'genero'
          acc[media.tipo] = (acc[media.tipo] || 0) + 1;
        } else {
          // If filtering by a specific type, only count the genre (use 'Unknown' if no genre)
          acc[genre] = (acc[genre] || 0) + 1;
        }
      }
      return acc;
    }, {});

    console.log('Media Counts:', mediaCounts); // Log the counts object

    // Update chart data with the processed counts
    this.chartData.labels = Object.keys(mediaCounts);
    this.chartData.datasets[0].data = Object.values(mediaCounts);

    // Ensure backgroundColor is an array and matches the number of chart data items
    const defaultColors = [
      '#FFA726', '#42A5F5', '#EF5350', '#66BB6A', '#AB47BC',
      '#CE93D8', '#FFEB3B', '#8D6E63', 'Pink', 'Black'
    ];

    // Assign the backgroundColor array and ensure it's correctly set
    this.chartData.datasets[0].backgroundColor = this.chartData.labels.map((_, i) =>
      defaultColors[i % defaultColors.length] // Cycle through colors if there are more labels than colors
    );

    // Manually trigger change detection to update the view
    this.cdr.detectChanges();

    // Trigger chart update after data change
    if (this.chart && this.chart.chart) {
      this.chart.chart.update();
    }
  }

  getColor(i: number): string {
    const backgroundColor = this.chartData.datasets[0]?.backgroundColor as string[];
    return backgroundColor?.[i] || '#ccc';  // Fallback to '#ccc' if undefined
  }

}
