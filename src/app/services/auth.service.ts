import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { TokenService } from './token.service';
import { environment } from '../../environments/environment';
import { loginResponse, registerRequest , registerResponse } from '../models/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) { }

  isLoggedIn = signal(false);

  login(email:string , password:string ){
    return this.http.post<loginResponse>(`${environment.apiUrl}/auth/login`, {email:email, password:password});
  }

  register(data:registerRequest){
    return this.http.post<registerResponse>(`${environment.apiUrl}/auth/register`, data);
  }

}