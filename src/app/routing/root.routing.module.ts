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
        path: 'player/:id',
        loadComponent() {
          return import('src/pages/player').then(
            imported => imported.PlayerComponent
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
      {
        path: 'voice',
        loadComponent() {
          return import('src/pages/voice').then(
            imported => imported.VoiceComponent
          );
        },
      },
      {
        path: 'library',
        loadComponent() {
          return import('src/pages/library').then(
            imported => imported.LibraryComponent
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
