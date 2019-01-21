import { Routes } from '@angular/router';
import { EstadisticaComponent } from '../ingreso-egreso/estadistica/estadistica.component';
import { IngresosEgresosComponent } from '../ingreso-egreso/ingresos-egresos/ingresos-egresos.component';
import { DetalleComponent } from '../ingreso-egreso/detalle/detalle.component';

export const dashboardRoutes: Routes = [
    { path: '', component: EstadisticaComponent },
    { path: 'ingreso-egreso', component: IngresosEgresosComponent },
    { path: 'detalle', component: DetalleComponent }
];