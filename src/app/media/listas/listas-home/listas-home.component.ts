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

  lists: List[] = [];

  constructor(
    private readonly router: Router,
    private readonly listService: ListService,
    private readonly mediaService: MediaService
  ) {}

  ngOnInit(): void {
    document.title = "NerdBox Listas";
    this.loadLists();
  }

  loadLists(): void {
    this.listService.getAll().subscribe((lists: List[]) => {

      this.lists = lists;

      // 1. sacar todos los IDs
      const allIds = lists.flatMap(l => l.medias);
      const uniqueIds = [...new Set(allIds)];

      // 2. pedir SOLO esas medias
      this.mediaService.getByIds(uniqueIds).subscribe(allMedias => {

        // 3. mapear listas con mediasFull
        this.lists = this.lists.map(list => ({
          ...list,
          mediasFull: allMedias.filter(m =>
            list.medias.includes(String(m._id))
          )
        }));

      });

    });
  }

}
