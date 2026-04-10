import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Media } from '../../interfaces/media';
import { List } from '../interfaces/list';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { MediaService } from '../../services/media.service';
import { ListService } from '../services/list.service';

@Component({
  selector: 'fs-listas-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './listas-detail.component.html',
  styleUrls: ['./listas-detail.component.css']
})
export class ListasDetailComponent {

  list!:List
  mediasFull: Media[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly mediaService:MediaService,
    private readonly listService:ListService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const posibleId=(this.route.snapshot.paramMap.get('id')) ;

    this.listService.getById(String(posibleId)).subscribe({
      next: (list) => {
        this.list=list
        document.title="NB | "+this.list.nombre;
        this.loadMedias();
      }
    })
  }

  loadMedias(): void {
  this.mediaService.getAll().subscribe(allMedia => {

    this.mediasFull = allMedia.filter(m =>
      this.list.medias.includes(String(m._id))
    );

  });
}

}
