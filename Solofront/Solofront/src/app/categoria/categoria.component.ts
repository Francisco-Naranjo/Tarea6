import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ICategoria } from '../interfases/icategoria';
import { CategoriaService } from '../Services/categoria.service';

declare const Swal: any;

@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './categoria.component.html',
  styleUrl: './categoria.component.css',
})
export class CategoriaComponent {
  lista!: ICategoria[];

  constructor(private srv: CategoriaService) {}

  ngOnInit() { this.cargar(); }

  cargar() {
    this.srv.todos().subscribe({
      next: (cats) => this.lista = cats,
      error: () => Swal.fire('Categorías', 'No se pudo cargar', 'error'),
    });
  }

  eliminar(id: number) {
    Swal.fire({
      title: 'Categorías',
      text: '¿Eliminar la categoría?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
    }).then((r: any) => {
      if (r.isConfirmed) {
        this.srv.eliminar(id).subscribe({
          next: () => { this.cargar(); Swal.fire('Categorías', 'Eliminado', 'success'); },
          error: () => Swal.fire('Categorías', 'No se pudo eliminar', 'error'),
        });
      }
    });
  }
}
