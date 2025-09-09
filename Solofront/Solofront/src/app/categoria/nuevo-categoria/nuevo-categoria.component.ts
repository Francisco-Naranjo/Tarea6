import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CategoriaService } from '../../Services/categoria.service';
import { ICategoria } from '../../interfases/icategoria';

declare const Swal: any;

@Component({
  selector: 'app-nuevo-categoria',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './nuevo-categoria.component.html',
  styleUrl: './nuevo-categoria.component.css',
})
export class NuevoCategoriaComponent implements OnInit {
  private fb = inject(FormBuilder);
  private srv = inject(CategoriaService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  titulo_formulario = 'Nueva Categoría';
  esEdicion = false;
  idActual: number | null = null;

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    descripcion: [''],
    activo: [true, [Validators.required]],
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe(pm => {
      const p = pm.get('parametro'); // MISMO nombre que usas en clientes/productos
      if (p) {
        this.esEdicion = true;
        this.idActual = +p;
        this.titulo_formulario = 'Editar Categoría';
        this.srv.una(this.idActual).subscribe(cat => this.form.patchValue(cat));
      }
    });
  }

  guardar() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const payload = this.form.value as ICategoria;

    Swal.fire({
      title: this.esEdicion ? '¿Actualizar categoría?' : '¿Guardar categoría?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: this.esEdicion ? 'Actualizar' : 'Guardar',
      denyButtonText: 'Cancelar',
      icon: 'question',
    }).then((r: any) => {
      if (!r.isConfirmed) return;

      if (this.esEdicion && this.idActual) {
        payload.id = this.idActual;
        this.srv.actualizar(payload).subscribe({
          next: () => { Swal.fire('Categorías', 'Actualizada', 'success'); this.router.navigate(['/categorias']); },
          error: () => Swal.fire('Categorías', 'Error al actualizar', 'error'),
        });
      } else {
        this.srv.guardar(payload).subscribe({
          next: () => { Swal.fire('Categorías', 'Guardada', 'success'); this.router.navigate(['/categorias']); },
          error: () => Swal.fire('Categorías', 'Error al guardar', 'error'),
        });
      }
    });
  }
}
