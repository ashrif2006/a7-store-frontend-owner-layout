import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { registerRequest } from '../../models/auth.interface';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule , SpinnerComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerFormBuilder: any;
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private tokenService: TokenService,
    private StoreService: StoreService,
    private router: Router,
  ) {}

  private fb = inject(FormBuilder);

  registerForm = this.fb.group({
    storeName: [''],
    ownerName: [''],
    email: [''],
    phone: [''],
    password: [''],
    confirmPassword: [''],
    agreeTerms: [false]
  });
  showPassword = false;
  loading = false;
  showConfirmPassword = false;
  currentStep = 1;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  get passwordsMatch(): boolean {
    return this.registerForm.get('password')?.value === this.registerForm.get('confirmPassword')?.value;
  }

  nextStep() {
    this.currentStep = 2;
  }

  prevStep() {
    this.currentStep = 1;
  }

  onRegister() {
    // Logic will be handled separately
    const dataRequest:registerRequest ={
      name:this.registerForm.value.ownerName!,
      email:this.registerForm.value.email!,
      password:this.registerForm.value.password!,
      slug:this.registerForm.value.storeName!,

    } 

    const storeInformation = {
      name: this.registerForm.value.ownerName!,
      slug: this.registerForm.value.storeName!,
      whatsapp_number: this.registerForm.value.phone!,
    }
    this.loading = true
    this.authService.register(dataRequest).subscribe({
      
      next:(res)=>{
        console.log(res);
        this.tokenService.save(res.token);
        console.log('store' , res.store);
        // this.StoreService.setStore(res.store);
        this.router.navigate(['/store-settings']);
        this.loading = false
      },
      error:(err)=>{
        this.loading=false;
        console.log(err);
      }
    })
    console.log(this.registerForm.value)
  }
}
