export class IngresoEgreso {
    description: string;
    monto: number;
    tipo: string;
    uid?: string;
    constructor(obj: ObjIngresoEgreso) {
        this.description = obj && obj.description || null;
        this.monto = obj && obj.monto || null;
        this.tipo = obj && obj.tipo || null;
    }
}

interface ObjIngresoEgreso {
    description: string;
    monto: number;
    tipo: string;
}