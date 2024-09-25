import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { ErrorComponent } from './pages/error/error.component';
import { MyAccountComponent } from './pages/my-account/my-account.component';
import { MyRentsComponent } from './pages/my-rents/my-rents.component';
import { MyNotificationsComponent } from './pages/my-notifications/my-notifications.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'settings', component: SettingsComponent },
    { path: 'settings/my-account', component: MyAccountComponent },
    { path: 'my-rents', component: MyRentsComponent },
    { path: 'my-notifications', component: MyNotificationsComponent },
    { path: '**', redirectTo: 'error' },
    { path: 'error', component: ErrorComponent },
];
