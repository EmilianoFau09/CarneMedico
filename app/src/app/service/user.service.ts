import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  usuario: string = "";
  password: string = "";

  constructor() { }
}
