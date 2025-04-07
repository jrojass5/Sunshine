import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-adicionar-productos',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './adicionar-productos.component.html',
  styleUrls: ['./adicionar-productos.component.css']
})
export class AdicionarProductosComponent {
  productoForm: FormGroup;
  imagenSeleccionada: File | null = null;
  imagenPreview: string | ArrayBuffer | null = null;
  imagenError = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.productoForm = this.fb.group({
      id: ['', Validators.required],
      nombre: ['', Validators.required],
      especie: ['', Validators.required],
      variedades: this.fb.array([]),
      gradosCalidad: this.fb.array([])
    });
  }

  // Getters
  get variedades(): FormArray {
    return this.productoForm.get('variedades') as FormArray;
  }

  get gradosCalidad(): FormArray {
    return this.productoForm.get('gradosCalidad') as FormArray;
  }

  // Métodos para agregar y eliminar campos dinámicos
  agregarVariedad() {
    const variedadForm = this.fb.group({
      variedad: ['', Validators.required],
      color: ['', Validators.required]
    });
    this.variedades.push(variedadForm);
  }

  eliminarVariedad(index: number) {
    this.variedades.removeAt(index);
  }

  agregarGradoCalidad(): void {
    this.gradosCalidad.push(this.fb.control('', Validators.required));
  }

  eliminarGradoCalidad(index: number): void {
    if (index >= 0 && index < this.gradosCalidad.length) {
      this.gradosCalidad.removeAt(index);
    }
  }

  // Manejo de la imagen
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (!file.type.startsWith('image/')) {
        this.imagenError = true;
        this.imagenSeleccionada = null;
        this.imagenPreview = null;
        return;
      }

      this.imagenSeleccionada = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPreview = reader.result;
      };
      reader.readAsDataURL(file);

      this.imagenError = false;
    }
  }

  // Envío del formulario al backend
  onSubmit(): void {
    if (this.productoForm.valid && this.imagenSeleccionada) {
      const formData = new FormData();
      formData.append('id', this.productoForm.get('id')?.value);
      formData.append('nombre', this.productoForm.get('nombre')?.value);
      formData.append('especie', this.productoForm.get('especie')?.value);
      formData.append('imagen', this.imagenSeleccionada);

      // Convertimos los arreglos a JSON
      formData.append('variedades', JSON.stringify(this.variedades.value));
      formData.append('gradosCalidad', JSON.stringify(this.gradosCalidad.value));

      this.http.post('http://localhost:3000/guardar-producto', formData).subscribe({
        next: () => {
          alert('Producto almacenado exitosamente.');

          // Limpiar el formulario
          this.productoForm.reset();
          this.variedades.clear();
          this.gradosCalidad.clear();
          this.imagenSeleccionada = null;
          this.imagenPreview = null;
          this.imagenError = false;
        },
        error: (err) => {
          console.error('Error al guardar el producto:', err);
          alert('Hubo un error al guardar el producto.');
        }
      });
    } else {
      this.imagenError = !this.imagenSeleccionada;
      alert('Por favor, complete todos los campos requeridos e incluya una imagen válida.');
    }
  }
}
