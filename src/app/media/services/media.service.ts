import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Media } from "../interfaces/media";
import { MediaResponse, MediasResponse } from "../interfaces/mediaResponse";

@Injectable({
  providedIn: 'root',
})
export class MediaService{
  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Media[]> {
    return this.http
      .get<MediasResponse>('medias')
      .pipe(map((c) => c.medias));
  }

  getById(_id: string): Observable<Media> {
    return this.http
      .get<MediaResponse>(`medias/${_id}`)
      .pipe(map((c) => c.media));
  }

  post(media: Media): Observable<Media> {
    return this.http
      .post<Media>('medias', media)
      .pipe(map((c) => c));
  }

  delete(_id: string): Observable<void> {
    return this.http.delete<void>(`medias/${_id}`).pipe();
  }

  edit(media: Media): Observable<Media> {
    return this.http
      .put<MediaResponse>(`medias/${media._id}`, media)
      .pipe(map((resp) => resp.media));
  }

}
