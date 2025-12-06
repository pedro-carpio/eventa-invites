import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'generador',
    loadComponent: () => import('./components/wizard/wizard').then((m) => m.Wizard),
  },
  {
    path: 'evento',
    children: [
      {
        path: 'baby-shower',
        loadComponent: () =>
          import('./components/event/baby-shower/baby-shower').then((m) => m.BabyShower),
      },
    ],
  },
];
