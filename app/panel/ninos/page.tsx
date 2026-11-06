"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { niños } from "@/data/mock";
import type { EstadoNiño, GrupoNombre } from "@/types";

const grupoOptions: Array<"todos" | GrupoNombre> = [
  "todos",
  "párvulos",
  "caminadores",
  "prejardín",
  "jardín",
];

const estadoOptions: Array<"todos" | EstadoNiño> = [
  "todos",
  "activo",
  "retirado",
  "lista de espera",
];

export default function PanelNinosPage() {
  const [search, setSearch] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<"todos" | GrupoNombre>("todos");
  const [selectedStatus, setSelectedStatus] = useState<"todos" | EstadoNiño>("todos");

  const filteredChildren = useMemo(() => {
    const query = search.trim().toLowerCase();

    return niños.filter((nino) => {
      const matchesSearch =
        query.length === 0 ||
        `${nino.nombre} ${nino.apellidos}`.toLowerCase().includes(query);

      const matchesGroup =
        selectedGroup === "todos" || nino.grupo === selectedGroup;

      const matchesStatus =
        selectedStatus === "todos" || nino.estado === selectedStatus;

      return matchesSearch && matchesGroup && matchesStatus;
    });
  }, [search, selectedGroup, selectedStatus]);

  const resetFilters = () => {
    setSearch("");
    setSelectedGroup("todos");
    setSelectedStatus("todos");
  };

  const badgeColors: Record<EstadoNiño, string> = {
    activo: "bg-green-100 text-green-800",
    retirado: "bg-red-100 text-red-800",
    "lista de espera": "bg-yellow-100 text-yellow-800",
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 border-b border-[#EFE2CC] pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-500">
            Niños
          </p>
          <h2 className="mt-2 text-3xl font-black text-[#326B50]">Lista de estudiantes</h2>
        </div>

        <Link
          href="/panel/ninos/nuevo"
          className="inline-flex items-center justify-center rounded-full bg-[#326B50] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#294f3f]"
        >
          + Registrar niño
        </Link>
      </header>

      <section className="rounded-3xl border border-[#EDE0C6] bg-[#F9F6F0] p-4 md:p-5">
        <div className="grid gap-4 md:grid-cols-[1.4fr_0.8fr_0.8fr]">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-[#326B50]">Buscar</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Nombre del niño"
              className="w-full rounded-2xl border border-[#E7D9BD] bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-[#326B50] focus:ring-2 focus:ring-[#326B50]/10"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-[#326B50]">Grupo</span>
            <select
              value={selectedGroup}
              onChange={(event) => setSelectedGroup(event.target.value as "todos" | GrupoNombre)}
              className="w-full rounded-2xl border border-[#E7D9BD] bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-[#326B50] focus:ring-2 focus:ring-[#326B50]/10"
            >
              {grupoOptions.map((option) => (
                <option key={option} value={option}>
                  {option === "todos" ? "Todos" : option}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-[#326B50]">Estado</span>
            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value as "todos" | EstadoNiño)}
              className="w-full rounded-2xl border border-[#E7D9BD] bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-[#326B50] focus:ring-2 focus:ring-[#326B50]/10"
            >
              {estadoOptions.map((option) => (
                <option key={option} value={option}>
                  {option === "todos" ? "Todos" : option}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {filteredChildren.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#D3C4A9] bg-[#FFFDF9] p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-3xl">
            🔎
          </div>
          <h3 className="mt-4 text-2xl font-black text-[#326B50]">No hay resultados</h3>
          <p className="mt-2 text-gray-600">
            Intenta otra búsqueda o limpia los filtros para ver más estudiantes.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-5 rounded-full bg-[#326B50] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#294f3f]"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <section className="grid gap-4 lg:grid-cols-2">
          {filteredChildren.map((nino) => (
            <article
              key={nino.id}
              className="rounded-3xl border border-[#EADFC8] bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-4xl shadow-inner">
                  {nino.avatar}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-xl font-black text-[#326B50]">
                      {nino.nombre} {nino.apellidos}
                    </h3>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${badgeColors[nino.estado]}`}
                    >
                      {nino.estado}
                    </span>
                  </div>

                  <p className="mt-1 text-sm font-semibold text-gray-500">
                    {nino.grupo} · Documento {nino.documento}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-[#F8F3EA] p-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500">
                    Fecha de nacimiento
                  </p>
                  <p className="mt-2 text-sm font-bold text-[#326B50]">
                    {new Date(nino.fechaNacimiento).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#F8F3EA] p-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500">
                    Acudientes
                  </p>
                  <p className="mt-2 text-sm font-bold text-[#326B50]">
                    {nino.acudienteIds.length} vinculados
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-[#F0E6D3] pt-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500">
                    EPS
                  </p>
                  <p className="mt-1 text-sm font-bold text-[#326B50]">{nino.salud.eps}</p>
                </div>

                <button
                  type="button"
                  className="rounded-full border border-[#326B50] px-3.5 py-2 text-xs font-bold text-[#326B50] transition hover:bg-[#EEF8F3]"
                >
                  Ver ficha
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
