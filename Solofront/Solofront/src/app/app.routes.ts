import { Routes } from '@angular/router';
import { ClienteComponent } from './cliente/cliente.component';
import { UsuariosComponent } from './Administracion/usuarios/usuarios.component';
import { RolesComponent } from './Administracion/roles/roles.component';
import { AccesosComponent } from './Administracion/accesos/accesos.component';
import { NuevoClienteComponent } from './cliente/nuevo-cliente/nuevo-cliente.component';
import { LoginComponent } from './auth/login.component';
import { RegisterComponent } from './auth/register.component';

export const routes: Routes = [
  {
    path: '',
    component: ClienteComponent,
    pathMatch: 'full',
  },
  {
    path: 'nuevo-cliente',
    component: NuevoClienteComponent,
    pathMatch: 'full',
  },
  {
    path: 'editar-cliente/:parametro',
    component: NuevoClienteComponent,
    pathMatch: 'full',
  },
  // --- Categorías (lazy) ---
{
  path: 'categorias',
  loadComponent: () => import('./categoria/categoria.component').then(m => m.CategoriaComponent),
},
{
  path: 'categorias/nuevo',
  loadComponent: () => import('./categoria/nuevo-categoria/nuevo-categoria.component').then(m => m.NuevoCategoriaComponent),
},
{
  path: 'categorias/editar/:parametro',
  loadComponent: () => import('./categoria/nuevo-categoria/nuevo-categoria.component').then(m => m.NuevoCategoriaComponent),
},
 { path: 'login', loadComponent: () => import('./auth/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./auth/register.component').then(m => m.RegisterComponent) },
  {
    path: 'admin',
    children: [
      {
        path: 'admin',
        component: UsuariosComponent,
      },
      {
        path: 'roles',
        component: RolesComponent,
      },
      {
        path: 'accesos',
        component: AccesosComponent,
      },
    ],
  },
  
];
