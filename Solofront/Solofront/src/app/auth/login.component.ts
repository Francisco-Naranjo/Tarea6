import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { ILogin } from '../Services/auth.types';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
  <div class="container py-4" style="max-width:420px">
    <h2 class="mb-3">Iniciar sesión</h2>
    <form [formGroup]="form" (ngSubmit)="submit()">
      <div class="mb-3">
        <label class="form-label">Correo</label>
        <input type="email" class="form-control" formControlName="email"/>
      </div>
      <div class="mb-3">
        <label class="form-label">Contraseña</label>
        <input type="password" class="form-control" formControlName="password"/>
      </div>
      <button class="btn btn-primary w-100" [disabled]="form.invalid || loading">
        {{ loading ? 'Ingresando...' : 'Entrar' }}
      </button>
      <p class="text-danger mt-3" *ngIf="error">{{ error }}</p>
    </form>
    <div class="text-center mt-3">
      <a routerLink="/register">¿No tienes cuenta? Regístrate</a>
    </div>
  </div>
  `,
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = false;
  error: string | null = null;

  // ✅ nonNullable para evitar string|null
  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  submit() {
    if (this.form.invalid) return;
    this.loading = true; this.error = null;

    const payload: ILogin = this.form.getRawValue(); // ✅ sin nulls
    this.auth.login(payload).subscribe({
      next: (r) => {
        this.loading = false;
        if (r.ok) this.router.navigateByUrl('/');
        else this.error = r.message ?? 'No se pudo iniciar sesión';
      },
      error: () => { this.loading = false; this.error = 'Error de red'; }
    });
  }
}
