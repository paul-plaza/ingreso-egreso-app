import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IngresoEgreso } from './ingreso-egreso.model';
import { IngresoEgresoService } from './ingreso-egreso.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { ActivarLoadingAction, DesactivarLoadingAction } from 'src/app/shared/ui.actions';

@Component({
  selector: 'app-ingresos-egresos',
  templateUrl: './ingresos-egresos.component.html',
  styles: []
})
export class IngresosEgresosComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    this.loading.unsubscribe();
  }

  form: FormGroup;
  tipo = 'ingreso';
  loading: Subscription = new Subscription();
  cargando: boolean;

  constructor(private ingresoEgresoService: IngresoEgresoService, private store: Store<AppState>) { }

  ngOnInit() {
    this.form = new FormGroup({
      'description': new FormControl('', Validators.required),
      'monto': new FormControl(0, Validators.min(0))
    });

    this.loading = this.store.select('ui').subscribe(aux => this.cargando = aux.isLoading);
  }

  CrearIngresosEgresos() {
    this.store.dispatch(new ActivarLoadingAction());
    const ingresoEgreso = new IngresoEgreso({ ...this.form.value, tipo: this.tipo });
    console.info(ingresoEgreso);
    this.ingresoEgresoService.crearIngresoEgreso(ingresoEgreso).then(() => {
      Swal("Creado", ingresoEgreso.description, 'success');
      this.form.reset({ monto: 0 });
      this.store.dispatch(new DesactivarLoadingAction());
    }).catch(error => {
      this.store.dispatch(new DesactivarLoadingAction());
      Swal("Error al crear usuario", error.message, 'error');
    });

  }

}
