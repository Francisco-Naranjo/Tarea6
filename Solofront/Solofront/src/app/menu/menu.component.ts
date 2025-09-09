import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../Services/auth.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);

  menuOpen = false;
  loading = true;
  nombre: string | null = null;
  cerrando = false;

  ngOnInit(): void {
    // 1) Sincroniza el estado con la cookie al cargar
    this.auth.session().subscribe({
      // la session() ya hace next() al subject; acá solo bajamos el loading
      next: () => { this.loading = false; },
      error: () => { this.loading = false; }
    });

    // 2) Escucha cambios de login/logout sin recargar
    this.auth.nombre$.subscribe(n => {
      this.nombre = n;
    });
  }

  toggleMenu() { this.menuOpen = !this.menuOpen; }
  closeMenu()  { this.menuOpen = false; }

  salir() {
    this.cerrando = true;
    this.auth.logout().subscribe({
      next: () => { this.cerrando = false; this.router.navigate(['/login']); },
      error: () => { this.cerrando = false; this.router.navigate(['/login']); }
    });
  }
}
