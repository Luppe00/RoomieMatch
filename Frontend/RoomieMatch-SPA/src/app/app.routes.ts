import { Routes } from '@angular/router';
import { UserListComponent } from './components/user-list/user-list';
import { MatchesComponent } from './components/matches/matches';


import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { ProfileComponent } from './components/profile/profile';
import { ChatComponent } from './components/chat/chat';

export const routes: Routes = [
    { path: '', component: UserListComponent },
    { path: 'matches', component: MatchesComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'chat/:id', component: ChatComponent },
    { path: '**', redirectTo: '' }
];
