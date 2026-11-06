"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { roleConfig } from "@/lib/permissions";
import type { RolUsuario } from "@/types";

interface RoleContextValue {
  activeRole: RolUsuario;
  setActiveRole: (role: RolUsuario) => void;
  currentRole: (typeof roleConfig)[RolUsuario];
}

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

function getInitialRole(): RolUsuario {
  if (typeof window === "undefined") {
    return "directora";
  }

  const savedRole = window.localStorage.getItem("kids-role") as RolUsuario | null;
  return savedRole === "directora" || savedRole === "docente" || savedRole === "padre"
    ? savedRole
    : "directora";
}

export function RoleProvider({ children }: { children: ReactNode }) {
  const [activeRole, setActiveRoleState] = useState<RolUsuario>(getInitialRole);

  const value = useMemo<RoleContextValue>(() => ({
    activeRole,
    setActiveRole: (role: RolUsuario) => {
      setActiveRoleState(role);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("kids-role", role);
      }
    },
    currentRole: roleConfig[activeRole],
  }), [activeRole]);

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const context = useContext(RoleContext);

  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }

  return context;
}
