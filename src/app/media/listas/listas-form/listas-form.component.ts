import { Component, ViewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { List } from '../interfaces/list';
import { Media } from '../../interfaces/media';
import { Router } from '@angular/router';
import { MediaService } from '../../services/media.service';
import { ListService } from '../services/list.service';

@Component({
  selector: 'fs-listas-form',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './listas-form.component.html',
  styleUrls: ['./listas-form.component.css']
})
export class ListasFormComponent {

  newList!:List
  @ViewChild('listForm') listForm!:NgForm

  saved = false;
  edit = false;

  constructor(
      private readonly router: Router,
      private readonly location: Location,
      private readonly mediaService:MediaService,
      private readonly http: HttpClient,
      private readonly listService:ListService
    ) {}

    ngOnInit(): void {
    this.newList = this.resetList();

    const currentUrl = this.location.path(); // all of this means im editing
    currentUrl.split('/');
    const id = currentUrl.split('/')[2];
    if (currentUrl.split('/')[3]==="edit")
    {
      this.edit = true;
      console.log(id);
      this.listService.getById(String(id)).subscribe(
        c => {
          this.newList = c
        });
    }
  }

  resetList():List{
    return{
      nombre:'',
      medias:[],
      fechaCreacion: new Date(),
      fechaModificacion: new Date(),
      descripcion:'',
      tipoLista:''
  }}

  validClasses(ngModel: NgModel, validClass: string, errorClass: string) {
      return {
        [validClass]: ngModel.touched && ngModel.valid,
        [errorClass]: ngModel.touched && ngModel.invalid,
      };
    }

    addList() {
      this.saved = true;

      const now = new Date();

      if (!this.edit)
      {
        this.newList.fechaCreacion = now
        this.newList.fechaModificacion = now

        this.listService.post(this.newList).subscribe({
          next: () => {
            console.log("Correcto");
          }
        });
        //this.router.navigate(['/media','home']);
        this.ngOnInit();
      }

      else{
        this.newList.fechaModificacion = now

        this.listService.edit(this.newList).subscribe({
          next: () => {console.log("correcto")},

          error: (error) => console.error(error),
        });
        this.router.navigate(['/list', this.newList._id]);
        //this.router.navigate(['/media','home']);

      }

    }

    searchText = '';
    results: Media[] = [];

    searchMedia() {
    if (!this.searchText.trim()) return;

    this.mediaService.searchByName(this.searchText)
      .subscribe(res => {
        this.results = res;
      });
  }

  addMediaToList(media: Media) {
  if (!media._id) return;

  if (!this.newList.medias.includes(media._id)) {
    this.newList.medias.push(media._id);
  }
}

  removeMedia(id: string) {
  this.newList.medias = this.newList.medias.filter(m => m !== id);
}

}
