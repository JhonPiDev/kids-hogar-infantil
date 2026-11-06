export type GrupoNombre = "párvulos" | "caminadores" | "prejardín" | "jardín";
export type EstadoNiño = "activo" | "retirado" | "lista de espera";
export type RolDocente = "directora" | "docente";

export interface Grupo {
  id: string;
  nombre: GrupoNombre;
  docenteId?: string;
  capacidad: number;
  descripcion?: string;
}

export interface SaludNiño {
  alergias: string[];
  condiciones: string[];
  eps: string;
}

export interface Docente {
  id: string;
  nombre: string;
  apellidos: string;
  documento: string;
  telefono: string;
  correo: string;
  rol: RolDocente;
  grupos: GrupoNombre[];
}

export interface Acudiente {
  id: string;
  nombre: string;
  apellidos: string;
  documento: string;
  parentesco: string;
  telefono: string;
  correo: string;
  contactoEmergencia: {
    nombre: string;
    telefono: string;
    parentesco: string;
  };
  personasAutorizadas: string[];
  hijosIds: string[];
}

export interface Niño {
  id: string;
  nombre: string;
  apellidos: string;
  fechaNacimiento: string;
  documento: string;
  grupo: GrupoNombre;
  foto?: string;
  salud: SaludNiño;
  observaciones: string;
  estado: EstadoNiño;
  avatar: string;
  pin: string;
  acudienteIds: string[];
}
