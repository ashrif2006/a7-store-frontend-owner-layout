import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StoreService } from './services/store.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'a7-front-ng';
  
  ngOnInit(){
  }
}
