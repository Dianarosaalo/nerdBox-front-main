import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Media } from '../interfaces/media';
import { RouterLink,Router,/*NavigationEnd,*/ ActivatedRoute } from '@angular/router';
import { MediaService } from '../services/media.service';


@Component({
  selector: 'fs-media-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './media-details.component.html',
  styleUrls: ['./media-details.component.css']
})
export class MediaDetailsComponent {

  media!:Media

  constructor(
    private readonly route: ActivatedRoute,
    private readonly mediaService:MediaService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const posibleId=(this.route.snapshot.paramMap.get('id')) ;

    this.mediaService.getById(String(posibleId)).subscribe({
      next: (media) => {
        this.media=media
        document.title="NB | "+this.media.titulo;
      }
    })
  }

  getScoreColor(score: number): { [key: string]: string } {
    if (score > 74) {
      return { 'background-color': 'rgb(6, 230, 6)', 'color': 'black' }; // Bright green with black text
    } else if (score >= 70 && score <= 74) {
      return { 'background-color': '#a1eb34', 'color': 'black' }; // Yellowish green with black text
    } else if (score >= 45 && score < 70) {
      return { 'background-color': 'yellow', 'color': 'black' }; // Yellow with black text
    } else if (score === 0) {
      return { 'background-color': 'rgb(0, 0, 0)', 'color': 'white' }; // Black with white text
    } else {
      return { 'background-color': 'red', 'color': 'white' }; // Red with white text
    }
  }
}
