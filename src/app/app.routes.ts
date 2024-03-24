import { Routes } from '@angular/router';
import { ScreenComponent } from './screen/screen.component';
import { ConsoleComponent } from './console/console.component';

export const routes: Routes = [
    {path: '', component: ConsoleComponent},
    {path: 'screen', component: ScreenComponent}
];
