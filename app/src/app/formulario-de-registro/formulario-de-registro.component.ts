import { Component } from '@angular/core';
import { HttpService } from '../service/http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-formulario-de-registro',
  templateUrl: './formulario-de-registro.component.html',
  styleUrls: ['./formulario-de-registro.component.css']
})
export class FormularioDeRegistroComponent {

  constructor(
    private httpService: HttpService,
    private router: Router
  ) { }



  usuario: string = "";
  password: string = "";
  ci: string = '';
  nombre: string = "";
  apellido: string = "";
  fechaNacimiento: Date = new Date();
  domicilio: string = "";
  correo: string = "";
  telefono: string = "";

  tieneCarne: boolean = false;
  fechaEmisionCarne: Date = new Date();
  fechaVencimientoCarne: Date = new Date();
  imagenCarne: Blob | null = null;
  fechaAgenda: Date = new Date();


  registrarUsuario() {
    if (this.checkeoDatos()) {
      this.httpService.registrarUsuario(
        this.usuario,
        this.password,
        this.ci,
        this.nombre,
        this.apellido,
        this.fechaNacimiento,
        this.domicilio,
        this.correo,
        this.telefono,
        this.tieneCarne,
        this.fechaEmisionCarne,
        this.fechaVencimientoCarne,
        this.imagenCarne,
        this.fechaAgenda
      ).subscribe(
        (response: any) => {
          // Manejar los datos obtenidos
          console.log('Datos obtenidos:', response);
          // ir a el form
          alert('Datos ingresados con exito.')
          this.router.navigate(['/']);
        },
        (error: any) => {
          // Manejar el error proveniente del servicio
          console.error('Error al obtener los datos:', error);
          alert(error)
        }
      );
    }
  }

  checkeoDatos(): boolean {
    if (this.usuario.length < 8){
      alert('Usuario invalido, largo minimo de 8. Revisa los datos ingresados.');
      return false;
    }
    if (this.password.length < 8){
      alert('Contraseña invalida, largo minimo de 8. Revisa los datos ingresados.');
      return false;
    }
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
    if (!(this.domicilio.length > 0)) {
      alert('Domicilio invalido. Revisa los datos ingresados.');
      return false;
    }
    if (!(this.correo.length > 0) || !this.validarCorreo(this.correo)) {
      alert('Correo invalido. Revisa los datos ingresados.');
      return false;
    }
    if (this.telefono.length !== 9 || !this.contieneSoloNumeros(this.telefono)) {
      alert('Telefono invalido. Revisa los datos ingresados.');
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
    } else {
      let fechaFormateada = this.formatearFecha(this.fechaAgenda)
      if (this.compararFechas(this.fechaHoraObj2, fechaFormateada) || this.compararFechas(fechaFormateada, this.fechaHoraObj1)) {
        alert(`Fecha de agenda fuera de rango. El rango es: ${this.fechaInicio}, ${this.fechaFin}`);
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

  ngOnInit() {
    this.httpService.obtenerFechaAgenda().subscribe(
      (datos) => {
        this.fechaHoraObj1 = new Date(datos.fechaInicio);
        const FInicio = (this.fechaHoraObj1.toISOString().split('T')[0]).toString();
        this.fechaInicio = FInicio.split("-").reverse().join("-");
        this.fechaHoraObj2 = new Date(datos.fechaFin);
        const FFin = (this.fechaHoraObj2.toISOString().split('T')[0]).toString();
        this.fechaFin = FFin.split("-").reverse().join("-");
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
  fechaInicio: string = "";
  fechaFin: string = "";

  fechaHoraObj1: Date = new Date();
  fechaHoraObj2: Date = new Date();

  fechaInicioActualizacion: Date = new Date();
  fechaFinActualizacion: Date = new Date();

}
