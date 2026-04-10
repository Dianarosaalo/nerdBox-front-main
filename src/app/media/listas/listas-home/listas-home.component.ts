import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router,RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { List } from '../interfaces/list';
import { ListService } from '../services/list.service';
import { ListaResponse, ListasResponse } from '../interfaces/listReponse';
import { Media } from '../../interfaces/media';
import { MediaService } from '../../services/media.service';

@Component({
  selector: 'fs-listas-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './listas-home.component.html',
  styleUrls: ['./listas-home.component.css']
})
export class ListasHomeComponent {

lists!:List[]
allMedias: Media[] = [];

 constructor(
    private readonly router: Router,
    private readonly listService: ListService,
    private readonly mediaService: MediaService
  ) {}

  ngOnInit(): void {
    this.mediaService.getAll().subscribe(medias => {
    this.allMedias = medias;
    this.loadLists();
  })
    document.title="NerdBox Listas";
  }

  loadLists(): void {
  this.listService.getAll().subscribe((lists: List[]) => {

    this.lists = lists.map(list => {
      console.log(lists);

      const mediasFull = this.allMedias.filter(m =>
        list.medias.map(String).includes(String(m._id))
      );

      return {
        ...list,
        mediasFull
      };

    });

  });
}

}
