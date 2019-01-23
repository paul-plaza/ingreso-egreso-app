export class User {
    public nombre: string;
    public email: string;
    public uid: string;

    // constructor(nombre: string, email: string, uid: string) {
    //     this.nombre = nombre;
    //     this.email = email;
    //     this.uid = uid;
    // }

    constructor(obj: DataObj) {
        this.uid = obj && obj.uid || null;
        this.email = obj && obj.email || null;
        this.nombre = obj && obj.nombre || null;
    }

    ///cambio de ingreso de datos 
}


interface DataObj {
    uid: string;
    email: string;
    nombre: string;
}