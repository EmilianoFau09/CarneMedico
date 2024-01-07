import { Component } from '@angular/core';
import { HttpService } from '../service/http.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {

  constructor(private httpService: HttpService, private userService: UserService){}


  anoAgenda: string = "";
  fechaInicioAgenda: Date = new Date();
  fechaFinAgenda: Date = new Date();
  anoActualizacion: string = "";
  fechaInicioActualizacion: Date = new Date();
  fechaFinActualizacion: Date = new Date();

  cambiarAgenda: boolean = false;
  cambiarActualizacion: boolean = false;


  actualizarDatosAdmin(){
    if (this.checkeoDatos()){
      this.httpService.actualizarDatosAdmin(
        this.anoAgenda,
        this.fechaInicioAgenda,
        this.fechaFinAgenda,
        this.anoActualizacion,
        this.fechaInicioActualizacion,
        this.fechaFinActualizacion,
        this.cambiarAgenda,
        this.cambiarActualizacion,
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

  checkeoDatos(){
    if (this.cambiarAgenda){
      if (this.anoAgenda.length !== 4){
        alert('Pon un año para agenda valido.')
        return false;
      }
      if (this.compararFechas(this.fechaFinAgenda, this.fechaInicioAgenda)){
        alert('Revisa las fechas de agenda.')
        return false;
      }
    }
    if (this.cambiarActualizacion){
      if (this.anoActualizacion.length !== 4){
        alert('Pon un año para periodo de actualizacion valido.')
        return false;
      }
      if (this.compararFechas(this.fechaFinActualizacion, this.fechaInicioActualizacion)){
        alert('Revisa las fechas de periodo de actualizacion.')
        return false;
      }
    }
    if (this.cambiarAgenda === false && this.cambiarActualizacion === false){
      alert('Selecciona que quiere cambiar.')
      return false;
    }
    return true;
  }

  compararFechas(fecha1: any, fecha2: any) {
    const fecha1Objeto = new Date(fecha1);
    const fecha2Objeto = new Date(fecha2);
    if (fecha1Objeto.getTime() >= fecha2Objeto.getTime()) {
      return false;
    }
    return true;
  }
}
