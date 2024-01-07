import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormularioDeActualizacionComponent } from './formulario-de-actualizacion/formulario-de-actualizacion.component';
import { FormularioDeRegistroComponent } from './formulario-de-registro/formulario-de-registro.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'registro', component: FormularioDeRegistroComponent },
  { path: 'actualizacion', component: FormularioDeActualizacionComponent },
  { path: 'admin', component: AdminComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
