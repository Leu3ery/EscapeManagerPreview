import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { AdminComponent } from './admin/admin.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'admin', component: AdminComponent },
  { path: '**', redirectTo: '' },
];
