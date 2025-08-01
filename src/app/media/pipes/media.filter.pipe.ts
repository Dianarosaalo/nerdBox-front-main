import { Pipe, PipeTransform } from "@angular/core";
import { Media } from "../interfaces/media";

@Pipe({
  name: 'mediaFilter',
  standalone: true,
})

export class MediaFilterPipe implements PipeTransform {
  transform(
    medias: Media[],
    search: string,
    type: string,
    order: string,
    genre: string,
    subgenre: string,
    platform: string,
    state: string,
    year?: number
  ): Media[] {

    // First, apply the sorting based on the chosen order
    let sortedMedias = this.OrderBy(order, medias);

    // Then filter by genre if provided
    if (genre) {
      sortedMedias = sortedMedias.filter((m) => m.genero === genre);
    }

    // Filter by subgenre if provided
    if (subgenre) {
      sortedMedias = sortedMedias.filter((m) => m.subgenero === subgenre);
    }

    // Filter by platform if provided
    if (platform) {
      sortedMedias = sortedMedias.filter((m) => m.plataforma === platform);
    }

    // Filter by state if provided
    if (state) {
      sortedMedias = sortedMedias.filter((m) =>
        m.fechaTerminado.some((ft) => ft.estado === state)
      );
    } else {
      const validStates = ["Completed", "Unfinished", "Dropped", "Watched", "Tried", "Wanna Play", "Would Play", "Will Play", "Should Play","Backlogged", "Played", "Not Played"];
      sortedMedias = sortedMedias.filter((m) =>
        m.fechaTerminado.some((ft) => validStates.includes(ft.estado))
      );
    }

    // Filter by year if provided
    if (year && year !== 0) {
      sortedMedias = sortedMedias.filter((m) =>
        m.fechaTerminado.some((ft) => {
          const fechaAsDate = typeof ft.fecha === 'string' ? new Date(ft.fecha) : ft.fecha;
          if (!(fechaAsDate instanceof Date) || isNaN(fechaAsDate.getTime())) {
            console.log(`Invalid date for media item:`, ft.fecha);
            return false;
          }
          return fechaAsDate.getFullYear() === year;
        })
      );
    }

    // Filter by type if provided
    const filteredByType = type
      ? sortedMedias.filter((m) => m.tipo === type)
      : sortedMedias;

    // Finally, filter by search term
    return search
      ? filteredByType.filter((m) => m.titulo.toLowerCase().includes(search.toLowerCase()))
      : filteredByType;
  }

  OrderBy(order: string, medias: Media[]) {
    const myMedia = [...medias];

    // Sorting by name
    if (order === "nombre") {
      myMedia.sort((a, b) => a.titulo.localeCompare(b.titulo));
    }
    // Sorting by score
    else if (order === "score") {
      myMedia.sort((a, b) => b.notaObjetiva - a.notaObjetiva);
    }
    // Sorting by completion date
    else if (order === "fechavista") {
      myMedia.sort((a, b) => {
        const fechaA = a.fechaTerminado.length > 0 ? new Date(a.fechaTerminado[0].fecha).getTime() : 0;
        const fechaB = b.fechaTerminado.length > 0 ? new Date(b.fechaTerminado[0].fecha).getTime() : 0;
        return fechaA - fechaB; // Sort by most recent first
      });
    }
    // Sorting by playtime
    else if (order === "tiempoJuego") {
      myMedia.sort((a, b) => (b.tiempoJuego ?? 0) - (a.tiempoJuego ?? 0));
    }

    return myMedia;
  }
}

