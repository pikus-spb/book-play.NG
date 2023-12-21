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
        path: 'welcome',
        loadComponent() {
          return import('src/pages/welcome').then(
            imported => imported.WelcomeComponent
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
      { path: '**', redirectTo: 'welcome' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
