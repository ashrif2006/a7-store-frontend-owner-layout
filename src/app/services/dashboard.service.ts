import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Product } from '../models/product.interface';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DashboardStats } from '../models/dashboardStates.interface';

@Injectable({
  providedIn: 'root',
})
export class DashBoardService {
  private http = inject(HttpClient);

  readonly reports = signal<DashboardStats | null>(null);

  getReport():Observable<DashboardStats > {
    return this.http.get<DashboardStats>(`${environment.apiUrl}/dashboard`);
  }

  loadReport():void{
    if(this.reports()) return;
    this.getReport().subscribe({
        next:(report)=>{
            this.reports.set(report);
            console.log(report)
        },
        error:(err)=>{
            console.log(err.message);
        }
    })
  }
}
