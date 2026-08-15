import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { TodoListComponent } from './components/todo-list/todo-list';
import { NotFoundComponent } from './components/not-found/not-found';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'todo', component: TodoListComponent, canActivate: [authGuard] },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '404' }
];
