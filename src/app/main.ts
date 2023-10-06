import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppRootModule } from './ui/app-root.module';

platformBrowserDynamic()
  .bootstrapModule(AppRootModule)
  .catch(err => console.error(err));
