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

  getScoreColor(score: number): string {
    if (score > 70) {
      return 'rgb(6, 230, 6)';
    } else if (score < 45) {
      return 'red';
    } else {
      return 'yellow';
    }
  }
}
