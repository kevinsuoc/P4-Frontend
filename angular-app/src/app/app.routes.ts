import { Routes, withComponentInputBinding } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { DetailComponent } from './components/detail/detail.component';

export const routes: Routes = [
    // { providers: [
    //     provideRouter(appRoutes, withComponentInputBinding)
    // ]},
    { path: '', component: MainComponent, title: 'Front Mobi' },
    { path: 'details/:id', component: DetailComponent, title: 'Detalles' },
    { path: '**', redirectTo: '',  }
];
