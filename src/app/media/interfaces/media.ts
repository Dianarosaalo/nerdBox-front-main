export interface Media {
  _id?:string,
  titulo:string,
  imagen:string
  tipo:string,
  genero:string,
  plataforma:string,
  fechaLanzamiento:Date,
  fechaTerminado:fechaTerminado[],
  notaObjetiva:number,
  notaSubjetiva:number,
  desarrolladora:string,
  subgenero:string,
  fechaCreacion:Date,
  fechaModificacion:Date,
  review:string,
  tiempoJuego:number,
  anotaciones:string
}

export interface fechaTerminado{
  fecha: Date,
  estado: string
}
