import { Routes } from '@angular/router';


export const MEDIA_ROUTES: Routes = [
  {
    path: 'add',
    loadComponent: () =>
      import('./media-form/media-form.component').then(
        (m) => m.MediaFormComponent
      ),
  },

  {
    path: 'actividad',
    loadComponent: () =>
      import('./actividad/actividad.component').then(
        (m) => m.ActividadComponent
      ),
  },

  {
    path: 'home',
    loadComponent: () =>
      import('./media-home/media-home.component').then(
        (m) => m.MediaHomeComponent
      ),
  },

  {
    path: 'reviews',
    loadComponent: () =>
      import('./reviews/reviews.component').then(
        (m) => m.ReviewsComponent
      ),
  },

  {
    path: 'estadisticas',
    loadComponent: () =>
      import('./estadisticas/estadisticas.component').then(
        (m) => m.EstadisticasComponent
      ),
  },

  {
    path: ':id',
    loadComponent: () =>
      import('./media-details/media-details.component').then(
        (m) => m.MediaDetailsComponent
      )
  },

  {
    path: ':id/edit',
    loadComponent: () =>
      import('./media-form/media-form.component').then(
        (m) => m.MediaFormComponent
      ),
  },
];
