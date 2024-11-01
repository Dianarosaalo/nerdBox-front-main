import { Pipe, PipeTransform } from "@angular/core";
import { Media } from "../interfaces/media";

@Pipe({
  name: 'mediaFilter',
  standalone: true,
})

export class MediaFilterPipe implements PipeTransform{
  transform(
    medias: Media[],
    search: string,
    type: string,
    order: string,
    genre: string,
    subgenre: string,
    platform: string,
    state:string,
    year?:number

  ): Media[] {

    if (genre)
    {
      medias=medias.filter((m)=>m.genero===genre)
    }

    if (subgenre)
    {
      medias=medias.filter((m)=>m.subgenero===subgenre)
    }

    if (platform)
    {
      medias=medias.filter((m)=>m.plataforma===platform)
    }

    if (state) {
      medias = medias.filter((m) =>
        m.fechaTerminado.some((ft) => ft.estado === state) // Check if any `estado` matches
      );
    }

    if (year && year !== 0) {
      medias = medias.filter((m) =>
          m.fechaTerminado.some((ft) => {
              const fechaAsDate = typeof ft.fecha === 'string' ? new Date(ft.fecha) : ft.fecha;

              if (!(fechaAsDate instanceof Date) || isNaN(fechaAsDate.getTime())) {
                  console.log(`Invalid date for media item:`, ft.fecha);
                  return false;
              }

              const fullYear = fechaAsDate.getFullYear();
              console.log(`Comparing year ${fullYear} with target year ${year}`);
              console.log(Number(fullYear)===Number(year))
              return Number(fullYear) === Number(year);
          })
      );
  }

    const filteredByType = type
      ? medias.filter((m) => m.tipo===type)
      : medias;

    return search
      ? filteredByType.filter((c) =>
          c.titulo.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        )
      : this.OrderBy(order, filteredByType);
  }

  OrderBy(order:string, medias:Media[]){

    const myMedia=[...medias];
    if (order==="nombre")
    {
      myMedia.sort((a,b)=>{
        if (a.titulo===b.titulo) return 0;
        return a.titulo > b.titulo ? 1 : -1
      });
    }
    else if (order==="score")
    {
      myMedia.sort((a,b)=>{
        if (a.notaObjetiva===b.notaObjetiva) return 0;
        return a.notaObjetiva < b.notaObjetiva ? 1 : -1
      });
    }

    else if (order==="fechavista")
    {
      myMedia.sort((a,b)=>{
        if (a.fechaTerminado[0].fecha===b.fechaTerminado[0].fecha) return 0;
        return a.fechaTerminado[0].fecha > b.fechaTerminado[0].fecha ? 1 : -1
      });
    }

  else if (order==="tiempoJuego")
    {
      myMedia.sort((a,b)=>{
        if (a.tiempoJuego===b.tiempoJuego) return 0;
        return a.tiempoJuego < b.tiempoJuego ? 1 : -1
      });
    }

    return myMedia;
  }
}
