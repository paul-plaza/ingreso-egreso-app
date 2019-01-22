import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { User } from './user.model';

//Cuando esta el decorador provided in : 'root' no es necesario importarlo en el modulo por que ya indica que pertence al modulo principal
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private itemsCollection: AngularFirestoreCollection<User>;
  constructor(private afAuth: AngularFireAuth,
    private router: Router,
    private afDB: AngularFirestore) {
    this.itemsCollection = afDB.collection<User>('users');

  }

  initAuthListener() {
    this.afAuth.authState.subscribe((fbUser: firebase.User) => console.info(fbUser));
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

    this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(resp => {

        const user: User = {
          email: resp.user.email,
          nombre: nombre,
          uid: resp.user.uid
        };

        //Guardo en firebase
        this.itemsCollection.add(user);
        // this.afDB.doc(`${user.uid}/usuario`)
        //   .(user)
        //   .then(() => this.router.navigate(['/']))


      }).catch(error => {
        Swal("Error al crear usuario", error.message, 'error');
      })

  }

  login(email: string, password: string) {
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(resp => {
        this.router.navigate(['/']);
      }).catch(error => {
        Swal("Error en el login", error.message, 'error');
      })
  }

  logout() {
    this.router.navigate(['/login']);
    this.afAuth.auth.signOut();
  }
}
