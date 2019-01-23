import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit, OnDestroy {
  cargando: boolean;

  subscription: Subscription;

  constructor(private authService: AuthService, private store: Store<AppState>) { }

  ngOnInit() {
    this.subscription = this.store.select("ui").subscribe(res => {
      this.cargando = res.isLoading;
    });
  }
  onSubmit(data: any) {

    this.authService.login(data.email, data.password);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
