import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { IRegister } from '../Services/auth.types';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
  <div class="container py-4" style="max-width:520px">
    <h2 class="mb-3">Registro</h2>
    <form [formGroup]="form" (ngSubmit)="submit()">
      <div class="mb-3">
        <label class="form-label">Nombre</label>
        <input class="form-control" formControlName="nombre"/>
      </div>
      <div class="mb-3">
        <label class="form-label">Correo</label>
        <input type="email" class="form-control" formControlName="correo"/>
      </div>
      <div class="mb-3">
        <label class="form-label">Contraseña</label>
        <input type="password" class="form-control" formControlName="pwd"/>
      </div>
      <button class="btn btn-primary w-100" [disabled]="form.invalid || loading">
        {{ loading ? 'Creando...' : 'Registrarme' }}
      </button>
      <p class="text-danger mt-3" *ngIf="error">{{ error }}</p>
    </form>
    <div class="text-center mt-3">
      <a routerLink="/login">¿Ya tienes cuenta? Inicia sesión</a>
    </div>
  </div>
  `,
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = false;
  error: string | null = null;

  // ✅ nonNullable para evitar string|null
  form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    correo: ['', [Validators.required, Validators.email]],
    pwd: ['', [Validators.required, Validators.minLength(4)]],
  });

  submit() {
    if (this.form.invalid) return;
    this.loading = true; this.error = null;

    const payload: IRegister = this.form.getRawValue(); // ✅ sin nulls
    this.auth.register(payload).subscribe({
      next: () => { this.loading = false; this.router.navigateByUrl('/login'); },
      error: (e) => { this.loading = false; this.error = e?.error?.message ?? 'No se pudo registrar'; }
    });
  }
}
