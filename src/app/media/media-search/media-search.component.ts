import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Media } from '../interfaces/media';
import { MediaService } from '../services/media.service';

@Component({
  selector: 'fs-media-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './media-search.component.html',
  styleUrls: ['./media-search.component.css']
})
export class MediaSearchComponent {

  search=''
  medias:Media[]=[]

  constructor(
      private readonly mediaService:MediaService,
      private readonly router: Router,
    ) {}

  searchMedia()
  {
    this.mediaService.searchByName(this.search).subscribe({
    next: (medias) => {
      this.medias = medias;
    },
    error: (err) => {
      console.error(err);
    }
  });
  }

}
