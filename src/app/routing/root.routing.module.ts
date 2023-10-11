import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

const routes: Route[] = [
  {
    path: '',
    loadComponent() {
      return import('src/pages/main').then(imported => imported.MainComponent);
    },
    children: [
      {
        path: 'home',
        loadComponent() {
          return import('src/pages/home').then(
            imported => imported.HomeComponent
          );
        },
      },
      {
        path: 'settings',
        loadComponent() {
          return import('src/pages/settings').then(
            imported => imported.SettingsComponent
          );
        },
      },
      {
        path: 'player',
        loadComponent() {
          return import('src/pages/player').then(
            imported => imported.PlayerComponent
          );
        },
      },
      { path: '**', redirectTo: 'home' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
