import { ApplicationConfig } from "@angular/core";
import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { ErrorComponent } from './pages/error/error.component';
import { MyAccountComponent } from './pages/my-account/my-account.component';
import { MyRentsComponent } from './pages/my-rents/my-rents.component';
import { MyNotificationsComponent } from './pages/my-notifications/my-notifications.component';
import { UsersComponent } from "./pages/users/users.component";
import { ManageRentsComponent } from './pages/manage-rents/manage-rents.component';
import { NotifyComponent } from './pages/notify/notify.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { RestorePasswordComponent } from './pages/restore-password/restore-password.component';
import { BookDetailsComponent } from './pages/book-details/book-details.component';
import { EditBookComponent } from "./pages/edit-book/edit-book.component";
import { authsessionGuard } from "./guards/authsession.guard";
import { roleGuard } from "./guards/role.guard";

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'settings', component: SettingsComponent },
    { path: 'settings/my-account', component: MyAccountComponent, canActivate: [authsessionGuard] },
    { path: 'my-rents', component: MyRentsComponent, canActivate: [authsessionGuard] },
    { path: 'my-notifications', component: MyNotificationsComponent, canActivate: [authsessionGuard] },
    { path: 'users', component: UsersComponent, canActivate: [authsessionGuard, roleGuard] },
    { path: 'manage-rents', component: ManageRentsComponent, canActivate: [authsessionGuard, roleGuard] },
    { path: 'notify', component: NotifyComponent, canActivate: [authsessionGuard, roleGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'restore-password', component: RestorePasswordComponent, canActivate: [authsessionGuard] },
    { path: 'book/:id', component: BookDetailsComponent },
    { path: 'edit-book/:id', component: EditBookComponent, canActivate: [authsessionGuard, roleGuard] },
    { path: '**', redirectTo: 'error' },
    { path: 'error', component: ErrorComponent },
];

export const appConfig: ApplicationConfig = {
    providers: [provideRouter(routes)],
  };
