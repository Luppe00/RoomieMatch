import { Routes } from '@angular/router';
import { UserListComponent } from './components/user-list/user-list';
import { MatchesComponent } from './components/matches/matches';
import { DashboardComponent } from './components/dashboard/dashboard';

import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { ProfileComponent } from './components/profile/profile';
import { ChatComponent } from './components/chat/chat';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },  // Redirect to dashboard
    { path: 'dashboard', component: DashboardComponent },  // Dashboard for logged in
    { path: 'explore', component: UserListComponent },  // Swiping interface
    { path: 'swipe', component: UserListComponent },  // Alias for explore
    { path: 'matches', component: MatchesComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'chat/:id', component: ChatComponent },
    { path: '**', redirectTo: 'dashboard' }
];
