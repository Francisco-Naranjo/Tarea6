import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface ILogin { email: string; password: string; }
export interface IRegister { nombre: string; correo: string; pwd: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly base = 'https://localhost:7112/api/Usuarios';

  // ✅ estado reactivo del nombre
  private nombreSubject = new BehaviorSubject<string | null>(null);
  nombre$ = this.nombreSubject.asObservable();

  constructor(private http: HttpClient) {}

  // opcional, por si quieres setear manualmente
  setNombre(nombre: string | null) { this.nombreSubject.next(nombre); }

  login(data: ILogin): Observable<any> {
    return this.http.post(`${this.base}/login`, data, { withCredentials: true })
      .pipe(tap((r: any) => {
        // si login ok, avisamos al menú
        if (r?.ok) this.nombreSubject.next(r.nombre ?? null);
      }));
  }

  register(data: IRegister): Observable<any> {
    return this.http.post(this.base, data, { withCredentials: true });
  }

  session(): Observable<any> {
    return this.http.get(`${this.base}/session`, { withCredentials: true })
      .pipe(tap((r: any) => {
        // sincroniza estado al cargar la app/menú
        this.nombreSubject.next(r?.ok ? (r.nombre ?? null) : null);
      }));
  }

  logout(): Observable<any> {
    return this.http.post(`${this.base}/logout`, {}, { withCredentials: true })
      .pipe(tap(() => this.nombreSubject.next(null)));
  }
}
