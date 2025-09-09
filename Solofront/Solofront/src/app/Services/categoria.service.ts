import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ICategoria } from '../interfases/icategoria';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  // Si usas proxy Angular: private readonly rutaAPI = '/api/Categorias';
  private readonly rutaAPI = 'https://localhost:7112/api/Categorias';

  constructor(private http: HttpClient) {}

  private manejoErrores(error: HttpErrorResponse) {
    const msg = error.error?.message || error.statusText || 'Error de red';
    return throwError(() => new Error(msg));
  }

  todos(): Observable<ICategoria[]> {
    return this.http.get<ICategoria[]>(this.rutaAPI /*, { withCredentials: true } */)
      .pipe(catchError(this.manejoErrores));
  }

  una(id: number): Observable<ICategoria> {
    return this.http.get<ICategoria>(`${this.rutaAPI}/${id}`)
      .pipe(catchError(this.manejoErrores));
  }

  guardar(model: ICategoria): Observable<ICategoria> {
    return this.http.post<ICategoria>(this.rutaAPI, model)
      .pipe(catchError(this.manejoErrores));
  }

  actualizar(model: ICategoria): Observable<ICategoria> {
    return this.http.put<ICategoria>(`${this.rutaAPI}/${model.id}`, model)
      .pipe(catchError(this.manejoErrores));
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.rutaAPI}/${id}`)
      .pipe(catchError(this.manejoErrores));
  }
}
