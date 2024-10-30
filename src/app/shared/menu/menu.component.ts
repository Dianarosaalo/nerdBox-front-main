import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  isDropDownOpen=false;
  isDropDownOpen2=false;
  isDropDownOpen3=false;
  isDropDownOpen4=false;
  isDropDownOpenSmall=false;

  constructor(private readonly router: Router) {}

  logOut(){
    this.router.navigate(['/reviews']);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  toggleDropdown() {
    this.isDropDownOpen = !this.isDropDownOpen;
    this.isDropDownOpen2=false;
    this.isDropDownOpen3=false;
    this.isDropDownOpen4=false;

    if(this.isDropDownOpen)
    {
      setTimeout(() => {
        this.isDropDownOpen=false;
      },3050);
    }
  }

  toggleDropdown2() {
    this.isDropDownOpen2 = !this.isDropDownOpen2;
    this.isDropDownOpen=false;
    this.isDropDownOpen3=false;
    this.isDropDownOpen4=false;

    if(this.isDropDownOpen2)
    {
      setTimeout(() => {
        this.isDropDownOpen2=false;
      },3050);
    }
  }

  toggleDropdown3() {
    this.isDropDownOpen3 = !this.isDropDownOpen3;
    this.isDropDownOpen=false;
    this.isDropDownOpen2=false;
    this.isDropDownOpen4=false;

    if(this.isDropDownOpen3)
    {
      setTimeout(() => {
        this.isDropDownOpen3=false;
      },3050);
    }
  }

  toggleDropdown4() {
    this.isDropDownOpen4 = !this.isDropDownOpen4;
    this.isDropDownOpen=false;
    this.isDropDownOpen2=false;
    this.isDropDownOpen3=false;

    if(this.isDropDownOpen4)
    {
      setTimeout(() => {
        this.isDropDownOpen4=false;
      },3050);
    }
  }

  toggleDropdownSmall() {
    this.isDropDownOpenSmall = !this.isDropDownOpenSmall;
    this.isDropDownOpen=false;
    this.isDropDownOpen2=false;
    this.isDropDownOpen3=false;

    if(this.isDropDownOpenSmall)
    {
      setTimeout(() => {
        this.isDropDownOpenSmall=false;
      },3050);
    }
  }
}
