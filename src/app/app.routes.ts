import { Routes } from '@angular/router';
import { AdicionarProductosComponent } from './components/adicionar-productos/adicionar-productos.component';
import { ListarProductosComponent } from './components/listar-productos/listar-productos.component';

export const routes: Routes = [
  { path: 'adicionar-productos', component: AdicionarProductosComponent },
  { path: 'listar-productos', component: ListarProductosComponent },
  { path: '', redirectTo: 'adicionar-productos', pathMatch: 'full' }
];