"use client";

import { useEffect, useMemo, useState } from "react";

import { getChildren, getGroups, getTeachers } from "@/lib/data";
import { getVisibleChildren } from "@/lib/permissions";
import { useRole } from "@/lib/role-context";
import type { Docente, Grupo, Niño } from "@/types";

export default function PanelPage() {
  const [niños, setNiños] = useState<Niño[]>([]);
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const { activeRole, currentRole } = useRole();

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      const [children, teachers, groups] = await Promise.all([
        getChildren(),
        getTeachers(),
        getGroups(),
      ]);

      if (!active) {
        return;
      }

      setNiños(children);
      setDocentes(teachers);
      setGrupos(groups);
    };

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const visibleChildren = useMemo(
    () =>
      getVisibleChildren(
        niños,
        activeRole,
        currentRole.id,
        currentRole.groups,
        currentRole.parentIds ?? [],
      ),
    [niños, activeRole, currentRole],
  );

  const visibleGroups = useMemo(() => {
    if (activeRole === "directora") {
      return grupos;
    }

    return grupos.filter((grupo) => currentRole.groups.includes(grupo.nombre));
  }, [activeRole, currentRole.groups, grupos]);

  const totalNiños = visibleChildren.length;
  const totalDocentes = activeRole === "directora" ? docentes.length : activeRole === "docente" ? 1 : 0;
  const totalGrupos = visibleGroups.length;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 border-b border-[#EFE2CC] pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-500">
            Panel principal
          </p>
          <h2 className="mt-2 text-3xl font-black text-[#326B50]">
            Bienvenida, {currentRole.userName.split(" ")[0]}
          </h2>
        </div>
        {activeRole === "directora" && (
          <button className="inline-flex items-center justify-center rounded-full bg-[#326B50] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#294f3f]">
            + Nuevo niño
          </button>
        )}
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl bg-orange-100 p-5 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-700">
            Niños
          </p>
          <p className="mt-4 text-4xl font-black text-[#326B50]">{totalNiños}</p>
          <p className="mt-2 text-sm text-gray-600">
            {activeRole === "padre" ? "Niños vinculados" : "Total activos en el programa"}
          </p>
        </div>

        <div className="rounded-3xl bg-green-100 p-5 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-green-700">
            Docentes
          </p>
          <p className="mt-4 text-4xl font-black text-[#326B50]">{totalDocentes}</p>
          <p className="mt-2 text-sm text-gray-600">
            {activeRole === "padre" ? "Personal visible" : "Personal registrado"}
          </p>
        </div>

        <div className="rounded-3xl bg-yellow-100 p-5 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-yellow-700">
            Grupos
          </p>
          <p className="mt-4 text-4xl font-black text-[#326B50]">{totalGrupos}</p>
          <p className="mt-2 text-sm text-gray-600">Cupos distribuidos</p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-3xl border border-[#EDE0C6] bg-[#F9F6F0] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-black text-[#326B50]">Grupos actuales</h3>
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">
              {activeRole === "directora" ? "Ordenado" : "Vista restringida"}
            </span>
          </div>

          <div className="space-y-3">
            {visibleGroups.map((grupo) => {
              const count = visibleChildren.filter((nino) => nino.grupo === grupo.nombre).length;

              return (
                <div
                  key={grupo.id}
                  className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm"
                >
                  <div>
                    <p className="text-lg font-extrabold capitalize text-[#326B50]">
                      {grupo.nombre}
                    </p>
                    <p className="text-sm text-gray-500">{grupo.descripcion}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-orange-500">{count}</p>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
                      niños
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl border border-[#EDE0C6] bg-[#F5FAF7] p-5">
          <h3 className="text-xl font-black text-[#326B50]">Atención rápida</h3>

          <div className="mt-5 space-y-3">
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-gray-500">
                Estado
              </p>
              <p className="mt-2 text-lg font-black text-[#326B50]">
                {visibleChildren.filter((nino) => nino.estado === "lista de espera").length} en lista de espera
              </p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-gray-500">
                Perfil
              </p>
              <p className="mt-2 text-lg font-black text-[#326B50]">{currentRole.label}</p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-gray-500">
                Recordatorios
              </p>
              <p className="mt-2 text-lg font-black text-[#326B50]">
                {visibleChildren.length > 0 ? `${visibleChildren.length} referencias activas` : "Sin registros"}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
