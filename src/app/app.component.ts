import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'AppIngresos';

  constructor(public authService: AuthService) {
    
  }

  ngOnInit(): void {
    this.authService.initAuthListener();
  }
}
