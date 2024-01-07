import { Component } from '@angular/core';
import { HttpService } from '../service/http.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(
    private httpService: HttpService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private userService: UserService
  ) { }

  usuario: string = "";
  password: string = "";
  textLog: string = "";

  iniciarSesion() {
    if (this.checkeoDatos()) {
      this.httpService.loguearUsuario(this.usuario, this.password).subscribe(
        (response: any) => {
          alert(response.message)
          this.userService.usuario = this.usuario;
          this.userService.password = this.password;
          this.router.navigate(['/actualizacion']);
        },
        (error: any) => {
          this.textLog = error;
          console.error(error);
        }
      );
    }
  }

  iniciarAdmin() {
    if (this.checkeoDatos()) {
      this.httpService.loguearAdmin(this.usuario, this.password).subscribe(
        (response: any) => {
          alert(response.message)
          this.userService.usuario = this.usuario;
          this.userService.password = this.password;
          this.router.navigate(['/admin']);
        },
        (error: any) => {
          this.textLog = error;
          console.error(error);
        }
      );
    }
  }

  checkeoDatos(): boolean {
    if (this.usuario.length < 8) {
      this.textLog = "El usuario es de minimo 8 caracteres.";
      return false;
    }
    if (this.password.length < 8) {
      this.textLog = "La contraseña es de minimo 8 caracteres.";
      return false;
    }
    return true;
  }



}
