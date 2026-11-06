import type { GrupoNombre, Niño, RolUsuario } from "@/types";

export interface RoleConfig {
  id: string;
  label: string;
  description: string;
  groups: GrupoNombre[];
  canCreateChildren: boolean;
  userName: string;
  userRole: RolUsuario;
  parentIds?: string[];
}

export const roleConfig: Record<RolUsuario, RoleConfig> = {
  directora: {
    id: "docente-ana",
    label: "Directora",
    description: "Acceso total a la gestión del hogar infantil.",
    groups: ["párvulos", "caminadores", "prejardín", "jardín"],
    canCreateChildren: true,
    userName: "Ana Pérez",
    userRole: "directora",
  },
  docente: {
    id: "docente-sara",
    label: "Docente",
    description: "Solo ve el grupo asignado para seguimiento académico.",
    groups: ["prejardín"],
    canCreateChildren: false,
    userName: "Sara López",
    userRole: "docente",
  },
  padre: {
    id: "acudiente-ana-gomez",
    label: "Padre o acudiente",
    description: "Solo tiene acceso a la información de sus hijos.",
    groups: ["párvulos"],
    canCreateChildren: false,
    userName: "Ana Gómez",
    userRole: "padre",
    parentIds: ["acudiente-ana-gomez"],
  },
};

export function getVisibleChildren(
  children: Niño[],
  role: RolUsuario,
  userId?: string,
  groups: GrupoNombre[] = [],
  parentIds: string[] = [],
): Niño[] {
  switch (role) {
    case "directora":
      return children;
    case "docente":
      return children.filter((child) => groups.includes(child.grupo));
    case "padre":
      return children.filter((child) => {
        const matchesParent = parentIds.length > 0
          ? child.acudienteIds.some((acudienteId) => parentIds.includes(acudienteId))
          : userId
            ? child.acudienteIds.includes(userId)
            : false;

        return matchesParent;
      });
    default:
      return children;
  }
}

export function canAccessChild(
  child: Niño,
  role: RolUsuario,
  userId?: string,
  groups: GrupoNombre[] = [],
  parentIds: string[] = [],
): boolean {
  switch (role) {
    case "directora":
      return true;
    case "docente":
      return groups.includes(child.grupo);
    case "padre":
      return parentIds.length > 0
        ? child.acudienteIds.some((acudienteId) => parentIds.includes(acudienteId))
        : userId
          ? child.acudienteIds.includes(userId)
          : false;
    default:
      return true;
  }
}
