import { Component, effect, inject, signal } from '@angular/core';
import { RouterOutlet, RouterModule, Router, NavigationEnd } from '@angular/router';
import { AdicionarProductosComponent } from './components/adicionar-productos/adicionar-productos.component';
import { ListarProductosComponent } from './components/listar-productos/listar-productos.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    AdicionarProductosComponent,
    ListarProductosComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = signal('Adicionar Productos');
  router = inject(Router);

  routeTitles: Record<string, string> = {
    '/adicionar-productos': 'Adicionar Productos',
    '/listar-productos': 'Listar Productos'
  };

  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const currentUrl = this.router.url;
        this.title.set(this.routeTitles[currentUrl] || 'Adicionar Productos');
      });
  }
}
