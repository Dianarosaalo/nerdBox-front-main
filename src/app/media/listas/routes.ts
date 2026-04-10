import { Routes } from '@angular/router';

export const LIST_ROUTES: Routes = [
  {
    path: 'add',
    loadComponent: () =>
      import('./listas-form/listas-form.component').then(
        (m) => m.ListasFormComponent
      ),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./listas-home/listas-home.component').then(
        (m) => m.ListasHomeComponent
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./listas-detail/listas-detail.component').then(
        (m) => m.ListasDetailComponent
      ),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./listas-form/listas-form.component').then(
        (m) => m.ListasFormComponent
      ),
  },
]
