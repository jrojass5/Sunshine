import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-listar-productos',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './listar-productos.component.html',
  styleUrls: ['./listar-productos.component.css'],
})
export class ListarProductosComponent {
  private http = inject(HttpClient);
  productos: any[] = [];

  filtroNombre = '';
  filtroEspecie = '';
  filtroVariedad = '';
  filtroGrado = '';

  constructor() {
    this.obtenerProductos();
  }

  obtenerProductos() {
    this.http.get<any[]>('http://localhost:3000/productos')
      .subscribe({
        next: data => this.productos = data,
        error: err => console.error('Error al obtener productos:', err)
      });
  }

  get productosFiltrados() {
    return this.productos.filter(producto => {
      const nombreCoincide = producto.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase());
      const especieCoincide = producto.especie.toLowerCase().includes(this.filtroEspecie.toLowerCase());
      const variedadCoincide = producto.variedades.some((v: { variedad: string }) => v.variedad.toLowerCase().includes(this.filtroVariedad.toLowerCase()));
      const gradoCoincide = producto.gradosCalidad.some((g: string) => g.toLowerCase().includes(this.filtroGrado.toLowerCase()));

      return nombreCoincide && especieCoincide && variedadCoincide && gradoCoincide;
    });
  }
}
