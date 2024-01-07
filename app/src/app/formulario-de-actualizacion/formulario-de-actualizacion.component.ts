import { Component } from '@angular/core';
import { HttpService } from '../service/http.service';
import { Router } from '@angular/router';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-formulario-de-actualizacion',
  templateUrl: './formulario-de-actualizacion.component.html',
  styleUrls: ['./formulario-de-actualizacion.component.css']
})
export class FormularioDeActualizacionComponent {

  constructor(
    private httpService: HttpService,
    private router: Router,
    private userService: UserService
  ){}

  ngOnInit(){
    this.httpService.obtenerFechaAgenda().subscribe(
      (datos) => {
        this.fechaHoraObj1 = new Date(datos.fechaInicio);
        const FInicio = (this.fechaHoraObj1.toISOString().split('T')[0]).toString();        
        this.fechaInicioAgenda = FInicio.split("-").reverse().join("-");
        this.fechaHoraObj2 = new Date(datos.fechaFin);
        const FFin = (this.fechaHoraObj2.toISOString().split('T')[0]).toString();
        this.fechaFinAgenda = FFin.split("-").reverse().join("-");
      },
      (error) => {
        // Manejar el error proveniente del servicio
        console.error('Error al obtener los datos:', error);
        alert(error)
      }
    )
    this.httpService.obtenerFechaActualizacion().subscribe(
      (datos) => {
        this.fechaInicioActualizacion = new Date(datos.fechaInicio);
        this.fechaFinActualizacion = new Date(datos.fechaFin);
      },
      (error) => {
        // Manejar el error proveniente del servicio
        console.error('Error al obtener los datos:', error);
        alert(error)
      }
    )
  }
  fechaInicioAgenda: string = "";
  fechaFinAgenda: string = "";
  fechaInicioActualizacion: Date = new Date();
  fechaFinActualizacion: Date = new Date();

  fechaHoraObj1: Date = new Date();
  fechaHoraObj2: Date = new Date();

  ci: string = '';
  nombre: string = "";
  apellido: string = "";
  fechaNacimiento: Date = new Date();

  tieneCarne: boolean = false;
  fechaEmisionCarne: Date = new Date();
  fechaVencimientoCarne: Date = new Date();
  imagenCarne: Blob | null = null;
  fechaAgenda: Date = new Date();
  

  actualizarUsuario() {
    if (this.checkeoDatos()){
      this.httpService.actualizarUsuario(
        this.ci,
        this.nombre,
        this.apellido,
        this.fechaNacimiento,
        this.fechaVencimientoCarne, 
        this.imagenCarne,
        this.fechaEmisionCarne,
        this.fechaAgenda,
        this.tieneCarne,
        this.userService.usuario,
        this.userService.password
        ).subscribe(
        (datos) => {
          // Manejar los datos obtenidos
          console.log('Datos obtenidos:', datos);
          // ir a el form
          alert('Datos ingresados con exito.')
        },
        (error) => {
          // Manejar el error proveniente del servicio
          console.error('Error al obtener los datos:', error);
          alert(error)
        }
      );
    }
  }

  checkeoDatos(): boolean {
    if (this.ci.length !== 8 || !this.contieneSoloNumeros(this.ci)) {
      alert('Cedula incorrecta. Revisa los datos ingresados.');
      return false;
    } 
    if (!this.contieneSoloLetras(this.nombre) || !(this.nombre.length > 0)) {
      alert('Nombre invalido. Revisa los datos ingresados.');
      return false;
    } 
    if (!this.contieneSoloLetras(this.apellido) || !(this.apellido.length > 0)) {
      alert('Apellido invalido. Revisa los datos ingresados.');
      return false;
    } 
    let fechaActual = new Date();
    const edad =  Number(new Date().toString().split(' ')[3]) - Number(this.fechaNacimiento.toString().split('-')[0]);
    if (edad > 80 || edad < 18){
      alert('Fecha de nacimiento invalida, debe tener entre 18 y 80 años. Revisa los datos ingresados.');
      return false;
    }
    if (this.tieneCarne){
      if ((this.fechaEmisionCarne === null) || this.compararFechas(fechaActual, this.fechaEmisionCarne)){
        alert('Fecha emision carne invalida. Revisa los datos ingresados.');
        return false;
      } 
      if ((this.fechaVencimientoCarne === null) || this.compararFechas(this.fechaVencimientoCarne, fechaActual)){
        alert('Fecha vencimiento carne invalida. Revisa los datos ingresados.');
        return false;
      } 
      if (this.imagenCarne === null){
        alert('Imagen de carne invalida. Revisa los datos ingresados.');
        return false;
      } 
    } else{
      let fechaFormateada = this.formatearFecha(this.fechaAgenda)
      if (this.compararFechas(this.fechaHoraObj2, fechaFormateada) || this.compararFechas(fechaFormateada, this.fechaHoraObj1)) {
        alert(`Fecha de agenda fuera de rango. El rango es: ${this.fechaInicioAgenda}, ${this.fechaFinAgenda}`);
        return false;
      }
    }
    if (this.compararFechas(this.fechaFinActualizacion, fechaActual) || this.compararFechas(fechaActual, this.fechaInicioActualizacion)) {
      alert(`Periodo de actualizacion a finalizado. El rango es: ${(this.fechaInicioActualizacion.toISOString().split('T')[0]).toString().split("-").reverse().join("-")}, ${(this.fechaFinActualizacion.toISOString().split('T')[0]).toString().split("-").reverse().join("-")}`);
      return false;
    }
    return true;
  }

  contieneSoloLetras(cadena: string): boolean {
    return /^[A-Za-z]+$/.test(cadena);
  }

  contieneSoloNumeros(cadena: string): boolean {
    return /^\d+$/.test(cadena);
  }

  validarCorreo(texto: string): boolean {
    const expresionRegular = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return expresionRegular.test(texto);
  }

  compararFechas(fecha1: any, fecha2: any) {
    const fecha1Objeto = new Date(fecha1);
    const fecha2Objeto = new Date(fecha2);
    if (fecha1Objeto.getTime() >= fecha2Objeto.getTime()) {
      return false;
    }
    return true;
  }

  formatearFecha(valorInput: Date) {
    const fechaConZonaHoraria = new Date(valorInput);
    const diasSemana = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const meses = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dec'];
    const diaSemanaAbreviado = diasSemana[fechaConZonaHoraria.getUTCDay()];
    const mesAbreviado = meses[fechaConZonaHoraria.getUTCMonth()];
    const dia = fechaConZonaHoraria.getUTCDate();
    const ano = fechaConZonaHoraria.getUTCFullYear();
    const horas = fechaConZonaHoraria.getUTCHours();
    const minutos = fechaConZonaHoraria.getUTCMinutes();
    const segundos = fechaConZonaHoraria.getUTCSeconds();
    const zonaHoraria = 'GMT-0300 (hora estándar de Uruguay)';
    const fechaFormateada = `${diaSemanaAbreviado} ${mesAbreviado} ${dia} ${ano} ${horas}:${minutos}:${segundos} ${zonaHoraria}`;
    return fechaFormateada;
  }
  
  
}
