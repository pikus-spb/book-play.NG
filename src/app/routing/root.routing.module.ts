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
        path: 'player',
        loadComponent() {
          return import('src/pages/player').then(
            imported => imported.PlayerComponent
          );
        },
      },
      { path: '**', redirectTo: 'player' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
