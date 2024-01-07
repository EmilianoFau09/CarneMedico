import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error desconocido';  
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = error.error.message;
    } else if (error.status) {
      // Error devuelto por el servidor
      errorMessage = error.error.message;
    }
    // Devuelve un mensaje de error observable
    return throwError(errorMessage);
  }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  loguearUsuario(username: string, password: string): Observable<any> {
    const requestBody = { username: username, password: password };
    return this.http.post<any>('http://localhost:3000/loguearUsuario', requestBody, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }
      
  registrarUsuario(
    username: string, 
    password: string,
    ci: string,
    nombre: string,
    apellido: string,
    fechaNacimiento: Date,
    domicilio: string,
    correo: string,
    telefono: string,
    tieneCarne: boolean,
    fechaEmisionCarne: Date,
    fechaVencimientoCarne: Date,
    imagenCarne: Blob | null,
    fechaAgenda: Date,
    ): Observable<any> {
    const requestBody = { 
      username: username, 
      password: password, 
      ci: ci,
      nombre: nombre,
      apellido: apellido,
      fechaNacimiento: fechaNacimiento,
      domicilio: domicilio,
      correo: correo,
      telefono: telefono,
      tieneCarne: tieneCarne,
      fechaEmisionCarne: fechaEmisionCarne,
      fechaVencimientoCarne: fechaVencimientoCarne,
      imagenCarne: imagenCarne,
      fechaAgenda: fechaAgenda
    };    
    return this.http.post<any>('http://localhost:3000/registrarUsuario', requestBody, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  actualizarUsuario(
    ci: string,
    nombre: string,
    apellido: string,
    fechaNacimiento: Date,
    fechaVencimientoCarne: Date,
    imagenCarne: Blob | null,
    fechaEmisionCarne: Date,
    fechaAgenda: Date,
    tieneCarne: boolean,
    usuario: string,
    password: string
    ): Observable<any> {
    const requestBody = { 
      ci: ci,
      nombre: nombre,
      apellido: apellido,
      fechaNacimiento: fechaNacimiento,
      fechaVencimientoCarne: fechaVencimientoCarne,
      imagenCarne: imagenCarne,
      fechaEmisionCarne: fechaEmisionCarne,
      fechaAgenda: fechaAgenda,
      tieneCarne: tieneCarne,
      usuario: usuario,
      password: password
    };
    return this.http.post<any>('http://localhost:3000/actualizarUsuario', requestBody, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  obtenerFechaAgenda(): Observable<any> {  
    return this.http.get<any>('http://localhost:3000/obtenerFechaAgenda', this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  obtenerFechaActualizacion(): Observable<any> {  
    return this.http.get<any>('http://localhost:3000/obtenerFechaActualizacion', this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  actualizarDatosAdmin(
    añoAgenda: string,
    fechaInicioAgenda: Date,
    fechaFinAgenda: Date,
    añoActualizacion: string,
    fechaInicioActualizacion: Date,
    fechaFinActualizacion: Date,
    cambiarAgenda: boolean,
    cambiarActualizacion: boolean,
    usuario: string,
    password: string,
    ){
    const requestBody = {
      añoAgenda: añoAgenda, 
      fechaInicioAgenda: fechaInicioAgenda, 
      fechaFinAgenda: fechaFinAgenda,
      añoActualizacion: añoActualizacion,
      fechaInicioActualizacion: fechaInicioActualizacion,
      fechaFinActualizacion: fechaFinActualizacion,
      cambiarAgenda: cambiarAgenda,
      cambiarActualizacion: cambiarActualizacion,
      username: usuario,
      password: password
    };
    return this.http.post<any>('http://localhost:3000/actualizarDatosAdmin', requestBody, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }



  loguearAdmin(username: string, password: string): Observable<any> {
    const requestBody = { username: username, password: password };    
    return this.http.post<any>('http://localhost:3000/sesionAdmin', requestBody, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }
}





