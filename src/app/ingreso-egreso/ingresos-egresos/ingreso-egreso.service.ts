import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IngresoEgreso } from './ingreso-egreso.model';
import { AuthService } from 'src/app/auth/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { filter, map } from 'rxjs/operators';
import { SetItemsAction } from './ingreso-egreso.actions';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  subscriptionListener: Subscription = new Subscription();
  subscriptionItems: Subscription = new Subscription();
  constructor(private afDb: AngularFirestore, private authService: AuthService, private store: Store<AppState>) { }

  initIngresoEgresoListener() {
    this.subscriptionListener = this.store.select("auth").pipe(
      filter(auth => auth.user != null)
    ).subscribe(auth => {
      this.ingresosEgresoItems(auth.user.uid)
    })
  }

  private ingresosEgresoItems(uid: string) {
    this.subscriptionItems = this.afDb.collection<IngresoEgreso[]>(`${uid}/ingresos-egresos/items`)
      .snapshotChanges().pipe(
        map(docData => {
          return docData.map(doc => {
            return {
              uid: doc.payload.doc.id,
              ...doc.payload.doc.data()
            }
          })
        })
      )
      .subscribe((collection: any) => {
        this.store.dispatch(new SetItemsAction(collection))
      });
  }

  crearIngresoEgreso(ingresoEgreso: IngresoEgreso) {
    const user = this.authService.getUser();
    return this.afDb.doc(`${user.uid}/ingresos-egresos`)
      .collection('items').add({ ...ingresoEgreso });
  }

  cancelarSubscripcion() {
    this.subscriptionItems.unsubscribe();
    this.subscriptionListener.unsubscribe();
  }

  borrarIngresoEgreso(uid: string) {
    const user = this.authService.getUser();
    return this.afDb.doc(`${user.uid}/ingresos-egresos/items/${uid}`).delete();
  }
}
