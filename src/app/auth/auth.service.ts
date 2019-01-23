import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { User } from './user.model';
import { AppState } from '../app.reducer';
import { Store } from '@ngrx/store';
import { ActivarLoadingAction, DesactivarLoadingAction } from '../shared/ui.actions';
import { Observable, Subscription } from 'rxjs';
import { SetUserAction } from './auth.actions';

//Cuando esta el decorador provided in : 'root' no es necesario importarlo en el modulo por que ya indica que pertence al modulo principal
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private itemsCollection: AngularFirestoreCollection<User>;
  private itemDoc: AngularFirestoreDocument<User>;
  private userSubcription: Subscription = new Subscription();
  item: Observable<User>;
  private user: User;
  constructor(private afAuth: AngularFireAuth,
    private router: Router,
    private afDB: AngularFirestore,
    private store: Store<AppState>) {
    //this.itemsCollection = afDB.collection('users');

  }

  getUser() {
    return { ...this.user };
  }

  initAuthListener() {
    this.afAuth.authState.subscribe((fbUser: firebase.User) => {
      if (fbUser) {

        this.userSubcription = this.afDB.doc(`${fbUser.uid}/usuario`).valueChanges()
          .subscribe((usuarioObj: any) => {

            const newUser = new User(usuarioObj);
            this.store.dispatch(new SetUserAction(newUser));
            this.user = newUser;

          });

      } else {
        this.user = null;
        this.userSubcription.unsubscribe();
      }
    });
  }


  isAuth() {
    return this.afAuth.authState.pipe(map(fbUser => {
      if (fbUser == null) {
        this.router.navigate(['/login'])
      }
      return fbUser != null
    }))
  }
  crearUsuario(nombre: string, email: string, password: string) {

    this.store.dispatch(new ActivarLoadingAction());

    this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(resp => {

        const user: User = {
          email: resp.user.email,
          nombre: nombre,
          uid: resp.user.uid
        };

        //Guardo en firebase
        //this.itemsCollection.add(user).then(() => this.router.navigate(['/']));
        //this.itemsCollection.doc(user.uid).set(user).then(() => this.router.navigate(['/']));

        this.afDB.doc(`${user.uid}/usuario`)
          .set(user)
          .then(() => {

            this.router.navigate(['/']);
            this.store.dispatch(new DesactivarLoadingAction());

          });
        this.store.dispatch(new DesactivarLoadingAction());

      }).catch(error => {
        this.store.dispatch(new DesactivarLoadingAction());
        Swal("Error al crear usuario", error.message, 'error');
      })

  }

  login(email: string, password: string) {
    this.store.dispatch(new ActivarLoadingAction())
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(resp => {
        this.router.navigate(['/']);
        this.store.dispatch(new DesactivarLoadingAction());
      }).catch(error => {
        Swal("Error en el login", error.message, 'error');
        this.store.dispatch(new DesactivarLoadingAction());
      })
  }

  logout() {
    this.router.navigate(['/login']);
    this.afAuth.auth.signOut();
  }
}
