import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
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

  selectedMediaType = '';
  selectedGenre = '';

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
          '#FFA726',
          '#42A5F5',
          '#EF5350',
          '#66BB6A',
          '#AB47BC',
          '#CE93D8',
          '#FFEB3B',
          '#8D6E63',
          'Pink',
          'Black'
        ]
      }
    ]
  };

  chartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        external: () => {}
      }
    },
    hover: {
      mode: 'nearest'
    },
    interaction: {
      mode: 'nearest',
      intersect: true
    },
    events: ['click']
  };

  chartType: ChartType = 'pie';

  constructor(
    private readonly mediaService: MediaService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadMediaData();
    document.title="NB | Estadísticas";
  }

  ngAfterViewInit(): void {
    if (this.chart?.chart) {
      const chartInstance = this.chart.chart;

      if (
        chartInstance.options.plugins &&
        chartInstance.options.plugins.legend
      ) {
        chartInstance.options.plugins.legend.display = false;
        chartInstance.update();
      }
    }
  }

  loadMediaData(): void {
    this.mediaService.getActivity().subscribe((medias: Media[]) => {
      this.medias = medias;

      console.log(
        'Medias received:',
        this.medias.slice(0, 5)
      );

      this.prepareChartData();
    });
  }

  /**
   * Cuando cambia el tipo de media.
   */
  onMediaTypeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;

    this.selectedMediaType = selectElement.value;

    // Al cambiar de tipo, reiniciamos el género.
    this.selectedGenre = '';

    this.prepareChartData();
  }

  /**
   * Cuando cambia el género.
   */
  onGenreChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;

    this.selectedGenre = selectElement.value;

    this.prepareChartData();
  }

  /**
   * Devuelve los géneros disponibles para el tipo de media seleccionado.
   */
  getGenres(): string[] {

    if (!this.selectedMediaType) {
      return [];
    }

    const genres = this.medias
      .filter(media => media.tipo === this.selectedMediaType)
      .map(media => media.genero || 'Unknown')
      .filter((genre, index, array) => array.indexOf(genre) === index);

    return genres.sort();
  }

  /**
   * Devuelve los subgéneros disponibles para el tipo y género seleccionados.
   */
  getSubgenres(): string[] {

    if (!this.selectedMediaType || !this.selectedGenre) {
      return [];
    }

    const subgenres = this.medias
      .filter(media =>
        media.tipo === this.selectedMediaType &&
        (media.genero || 'Unknown') === this.selectedGenre
      )
      .map(media => media.subgenero || 'Unknown')
      .filter((subgenre, index, array) =>
        array.indexOf(subgenre) === index
      );

    return subgenres.sort();
  }

  /**
   * Prepara los datos de la gráfica dependiendo
   * del nivel seleccionado.
   */
  prepareChartData(): void {

    const mediaCounts = this.medias.reduce(
      (acc: Record<string, number>, media) => {

        /*
         * NIVEL 1
         * No hay tipo seleccionado:
         * mostramos los tipos de media.
         */
        if (this.selectedMediaType === '') {

          acc[media.tipo] = (acc[media.tipo] || 0) + 1;

          return acc;
        }

        /*
         * Comprobamos que pertenezca al tipo seleccionado.
         */
        if (media.tipo !== this.selectedMediaType) {
          return acc;
        }

        /*
         * NIVEL 2
         * Hay tipo seleccionado pero no género:
         * mostramos los géneros.
         */
        if (this.selectedGenre === '') {

          const genre = media.genero || 'Unknown';

          acc[genre] = (acc[genre] || 0) + 1;

          return acc;
        }

        /*
         * Comprobamos que pertenezca al género seleccionado.
         */
        const genre = media.genero || 'Unknown';

        if (genre !== this.selectedGenre) {
          return acc;
        }

        /*
         * NIVEL 3
         * Hay tipo + género seleccionados:
         * mostramos los subgéneros.
         */
        const subgenre = media.subgenero || 'Unknown';

        acc[subgenre] = (acc[subgenre] || 0) + 1;

        return acc;

      },
      {}
    );

    console.log('Media Counts:', mediaCounts);

    /*
     * Actualizamos las etiquetas y valores de la gráfica.
     */
    this.chartData.labels = Object.keys(mediaCounts);

    this.chartData.datasets[0].data = Object.values(mediaCounts);

    /*
     * Colores.
     */
    const defaultColors = [
      '#FFA726',
      '#42A5F5',
      '#EF5350',
      '#66BB6A',
      '#AB47BC',
      '#CE93D8',
      '#FFEB3B',
      '#8D6E63',
      'Pink',
      'Black'
    ];

    this.chartData.datasets[0].backgroundColor =
      this.chartData.labels.map(
        (_, i) => defaultColors[i % defaultColors.length]
      );

    this.cdr.detectChanges();

    if (this.chart?.chart) {
      this.chart.chart.update();
    }
  }

  getColor(i: number): string {

    const backgroundColor =
      this.chartData.datasets[0]?.backgroundColor as string[];

    return backgroundColor?.[i] || '#ccc';
  }
}
