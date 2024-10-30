import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/media/home',
  },
  {
    path: 'media',
    loadChildren: () =>
      import('./media/routes').then((m) => m.MEDIA_ROUTES),
  },
];
