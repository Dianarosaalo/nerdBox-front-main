import { Pipe, PipeTransform } from "@angular/core";
import { List } from "../interfaces/list";

@Pipe({
  name: 'listFilter',
  standalone: true,
})
export class ListFilterPipe implements PipeTransform {

  transform(
    lists: List[],
    search: string,
    order: string
  ): List[] {

    if (!lists) return [];

    let filteredLists = [...lists];

    if (search) {
      const searchLower = search.toLowerCase();

      filteredLists = filteredLists.filter(list => {

        const matchList = list.nombre
          ?.toLowerCase()
          .includes(searchLower);

        const matchMedia = list.mediasFull?.some(m =>
          (m.titulo?.toLowerCase().includes(searchLower)) ||
          (m.nombrePersonal?.toLowerCase().includes(searchLower))
        );

        return matchList || matchMedia;
      });
    }

    // 🔃 ORDER
    filteredLists = this.orderBy(order, filteredLists);

    return filteredLists;
  }

  private orderBy(order: string, lists: List[]): List[] {
    const sorted = [...lists];

    if (order === "nombre") {
      sorted.sort((a, b) =>
        a.nombre.localeCompare(b.nombre)
      );
    }

    else if (order === "cantidad") {
      sorted.sort((a, b) =>
        (b.medias?.length || 0) - (a.medias?.length || 0)
      );
    }

    else if (order === "reciente") {
      sorted.sort((a, b) => {
        const fechaA = new Date(a.fechaModificacion).getTime() || 0;
        const fechaB = new Date(b.fechaModificacion).getTime() || 0;
        return fechaB - fechaA;
      });
    }

    return sorted;
  }
}
