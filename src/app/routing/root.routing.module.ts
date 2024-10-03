import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { DEFAULT_TITLE } from 'src/entities/title';

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
        title: DEFAULT_TITLE,
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
        title: DEFAULT_TITLE,
      },
      {
        path: 'library/:letter',
        loadComponent() {
          return import('src/pages/library').then(
            imported => imported.LibraryComponent
          );
        },
        title: DEFAULT_TITLE,
      },
      {
        path: 'library',
        loadComponent() {
          return import('src/pages/library').then(
            imported => imported.LibraryComponent
          );
        },
        title: DEFAULT_TITLE,
      },
      {
        path: '404',
        loadComponent() {
          return import('src/pages/not-found').then(
            imported => imported.NotFoundComponent
          );
        },
        title: DEFAULT_TITLE,
      },
      { path: '', redirectTo: '/player', pathMatch: 'full' },
      { path: '**', redirectTo: '404' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
