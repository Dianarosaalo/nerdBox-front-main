import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Media } from '../interfaces/media';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { MediaService } from '../services/media.service';

@Component({
  selector: 'fs-reviews',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent {

  medias!:Media[]

  constructor(
    private readonly mediaService:MediaService,
    private readonly router: Router,
    private readonly http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadMedia();
  }

  loadMedia(): void {
    this.mediaService.getPaginated(0, 2500).subscribe((medias: Media[]) => {

      this.medias = medias.filter((m) => m.review);

      this.mediaService.getPaginated(2500, 2500).subscribe((moreMedias: Media[]) => {
        this.medias = [
          ...this.medias,
          ...moreMedias.filter((m) => m.review)
        ];
      });

    });
    document.title="NB | Reviews";
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
