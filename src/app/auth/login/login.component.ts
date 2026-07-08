import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { loginResponse } from '../../models/auth.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule , ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private authService: AuthService , private tokenService: TokenService, private router: Router ) { }

  loading = signal(false);

  loginForm = new FormGroup({
    email : new FormControl('',[
      Validators.required,
      Validators.email,
    ]),
    password : new FormControl('',[
      Validators.required,
      Validators.minLength(6),
    ]),
    remember: new FormControl()
  })

  showPassword = false;


  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }




  login(){
    this.loading.set(true);
    const email = this.loginForm.get('email')?.value ?? '';
    const password = this.loginForm.get('password')?.value ?? '';
    console.log('Logging in with:', this.loginForm.value);
    this.authService.login(email, password).subscribe({

      next: (res:loginResponse)=>{
        this.tokenService.save(res.token);
        this.authService.isLoggedIn.set(true);
        this.loading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading.set(false);
        console.error('Login error:', err);
      }
    })
  }

}