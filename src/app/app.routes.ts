import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home').then((m) => m.Home),
  },
  {
    path: 'baby-shower',
    children: [
      {
        path: 'vinculo-natural',
        loadComponent: () =>
          import('./components/template/baby-shower/vinculo-natural/vinculo-natural').then(
            (m) => m.VinculoNatural,
          ),
      },
    ],
  },
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
  {
    path: 'invitacion',
    children: [
      {
        path: 'croac',
        loadComponent: () =>
          import('./components/event/baby-shower/invite').then((m) => m.InviteDemo),
      },
    ],
  },
];
