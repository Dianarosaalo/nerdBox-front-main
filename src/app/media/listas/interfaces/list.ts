import { Media } from "../../interfaces/media";

export interface List {
  _id?:string,
  nombre:string,
  medias:Media[]
  fechaCreacion:Date,
  fechaModificacion:Date,
  descripcion: string,
  tipoLista:string,

}
