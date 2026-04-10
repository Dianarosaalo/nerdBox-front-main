import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { List } from "../interfaces/list";
import { ListasResponse, ListaResponse } from "../interfaces/listReponse";

@Injectable({
  providedIn: 'root',
})
export class ListService{
  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<List[]> {
    return this.http
      .get<ListasResponse>('lists')
      .pipe(map((l) => l.listas));
  }

  getById(_id: string): Observable<List> {
    return this.http
      .get<ListaResponse>(`lists/${_id}`)
      .pipe(map((l) => l.lista));
  }

  post(lista: List): Observable<List> {
    return this.http
      .post<List>('lists', lista)
      .pipe(map((l) => l));
  }

  edit(lista: List): Observable<List> {
    return this.http
      .put<ListaResponse>(`lists/${lista._id}`, lista)
      .pipe(map((resp) => resp.lista));
  }

}
