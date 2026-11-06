"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getChildren } from "@/lib/data";

const areas = [
  {
    id: "logica",
    nombre: "Lógica",
    emoji: "🧩",
    descripcion: "Piensa, descubre y resuelve",
    color: "bg-purple-100",
    acento: "text-purple-800",
    borde: "border-purple-300",
  },
  {
    id: "lenguaje",
    nombre: "Lenguaje",
    emoji: "📚",
    descripcion: "Palabras, cuentos y sonidos",
    color: "bg-blue-100",
    acento: "text-blue-800",
    borde: "border-blue-300",
  },
  {
    id: "motricidad",
    nombre: "Motricidad",
    emoji: "🏃",
    descripcion: "Mueve el cuerpo y coordina",
    color: "bg-green-100",
    acento: "text-green-800",
    borde: "border-green-300",
  },
  {
    id: "arte",
    nombre: "Arte",
    emoji: "🎨",
    descripcion: "Imagina, crea y colorea",
    color: "bg-orange-100",
    acento: "text-orange-800",
    borde: "border-orange-300",
  },
] as const;

export default function JuegosPage() {
  const [nombre, setNombre] = useState<string | null>(null);
  const [areaSeleccionada, setAreaSeleccionada] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadChild = async () => {
      const childId = window.localStorage.getItem("kids-child-id");

      if (!childId) {
        return;
      }

      const children = await getChildren();
      const child = children.find((item) => item.id === childId);

      if (active && child) {
        setNombre(child.nombre);
      }
    };

    loadChild();

    return () => {
      active = false;
    };
  }, []);

  const areaActiva = areas.find((area) => area.id === areaSeleccionada);

  return (
    <main className="min-h-screen bg-[#FFF9EF] px-4 py-6 text-gray-800 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-100 text-3xl">
              🌈
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-orange-500">
                ¡Hola{nombre ? `, ${nombre}` : ""}!
              </p>
              <h1 className="text-2xl font-black text-[#326B50] sm:text-3xl">
                ¿Qué quieres explorar?
              </h1>
            </div>
          </div>
          <Link
            href="/ninos/ingresar"
            className="rounded-full border-2 border-[#326B50] bg-white px-4 py-3 text-sm font-bold text-[#326B50] transition hover:bg-green-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#326B50]"
          >
            Cambiar perfil
          </Link>
        </header>

        <section aria-labelledby="areas-heading">
          <div className="mb-5 text-center">
            <h2
              id="areas-heading"
              className="text-2xl font-black text-[#326B50] sm:text-3xl"
            >
              Elige una aventura
            </h2>
            <p className="mt-2 text-gray-600">
              ¡Toca un botón grande para escoger un área!
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {areas.map((area) => {
              const isSelected = area.id === areaSeleccionada;

              return (
                <button
                  key={area.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setAreaSeleccionada(area.id)}
                  className={`flex min-h-56 flex-col items-center justify-center rounded-[32px] border-4 p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#326B50] ${area.color} ${area.borde} ${isSelected ? "ring-4 ring-[#326B50] ring-offset-2" : ""}`}
                >
                  <span aria-hidden="true" className="text-6xl">
                    {area.emoji}
                  </span>
                  <span className={`mt-4 text-2xl font-black ${area.acento}`}>
                    {area.nombre}
                  </span>
                  <span className="mt-2 text-sm font-semibold text-gray-700">
                    {area.descripcion}
                  </span>
                  <span className="mt-4 rounded-full bg-white/80 px-5 py-2 text-sm font-extrabold text-[#326B50]">
                    {isSelected ? "¡Elegido!" : "¡Vamos!"}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section
          aria-live="polite"
          className="mt-8 rounded-[32px] border-2 border-dashed border-[#E8DCC5] bg-white p-6 text-center sm:p-8"
        >
          {areaActiva ? (
            <>
              <span aria-hidden="true" className="text-5xl">
                {areaActiva.emoji}
              </span>
              <h2 className="mt-3 text-2xl font-black text-[#326B50]">
                ¡Muy pronto jugaremos con {areaActiva.nombre.toLowerCase()}!
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-gray-600">
                Estamos preparando juegos divertidos para esta aventura. ¡Vuelve
                pronto!
              </p>
            </>
          ) : (
            <>
              <span aria-hidden="true" className="text-5xl">
                ⭐
              </span>
              <h2 className="mt-3 text-xl font-black text-[#326B50]">
                ¡Tu próxima aventura te espera!
              </h2>
              <p className="mt-2 text-gray-600">
                Escoge una de las cuatro áreas para descubrirla.
              </p>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
