import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IgdbService {
  private clientId = 'v7mv3escl2t5ifeoc8w379sl4zm164'; // Replace with your actual client ID
  private accessToken = 'xrkp33hyxjihnm6uk3bg4x0ac5ttj8'; // Replace with your actual access token

  constructor(private http: HttpClient) {}

  searchGames(query: string): Observable<any> {
    const headers = new HttpHeaders({
      'Client-ID': this.clientId,
      'Authorization': `Bearer ${this.accessToken}`,
    });

    const body = `
    fields name, cover.url, release_dates.date, release_dates.y, platforms.name, summary, genres.name;
    search "${query}";
    limit 10;`;

    // The request should go through the proxy and forward the correct headers
    return this.http.post('/api/v4/games', body, { headers });
  }

  getDevelopersByIds(ids: number[]): Observable<any> {
    const headers = new HttpHeaders({
      'Client-ID': this.clientId,
      'Authorization': `Bearer ${this.accessToken}`,
    });

    const body = `
      fields name;
      where id = (${ids.join(',')});
      limit ${ids.length};`;

    return this.http.post('/api/v4/developers', body, { headers });
  }
}
