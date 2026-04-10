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
      .pipe(map((l) => l.lists));
  }

  getById(_id: string): Observable<List> {
    return this.http
      .get<ListaResponse>(`lists/${_id}`)
      .pipe(map((l) => l.list));
  }

  post(list: List): Observable<List> {
    return this.http
      .post<List>('lists', list)
      .pipe(map((l) => l));
  }

  edit(list: List): Observable<List> {
    return this.http
      .put<ListaResponse>(`lists/${list._id}`, list)
      .pipe(map((resp) => resp.list));
  }

}
