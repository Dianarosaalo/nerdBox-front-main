import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router,RouterLink } from '@angular/router';

@Component({
  selector: 'fs-listas-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './listas-home.component.html',
  styleUrls: ['./listas-home.component.css']
})
export class ListasHomeComponent {

 constructor(
    private readonly router: Router,
  ) {}

}
