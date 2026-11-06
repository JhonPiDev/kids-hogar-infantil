"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { niños } from "@/data/mock";

const pinSymbols = [
  "🐼",
  "🦊",
  "🐵",
  "🐻",
  "🐰",
  "🦄",
  "🍉",
  "🍓",
  "⭐",
  "🌞",
  "🌈",
  "🧩",
  "🎨",
  "🎵",
  "🌙",
  "🍋",
  "🍇",
  "🌻",
  "🌟",
  "✨",
  "🐾",
  "🔢",
  "🍊",
  "🌼",
  "☀️",
];

export default function NinoIngresarPage() {
  const [selectedId, setSelectedId] = useState(niños[0]?.id ?? "");
  const [pin, setPin] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const selectedChild = useMemo(
    () => niños.find((nino) => nino.id === selectedId) ?? niños[0],
    [selectedId],
  );

  const handleSymbolPress = (symbol: string) => {
    setMessage(null);

    if (pin.length >= 4) {
      return;
    }

    setPin((current) => [...current, symbol]);
  };

  const handleDelete = () => {
    setMessage(null);
    setPin((current) => current.slice(0, -1));
  };

  const handleReset = () => {
    setPin([]);
    setMessage(null);
  };

  const handleSubmit = () => {
    if (!selectedChild) {
      setMessage("No hay un niño seleccionado.");
      return;
    }

    const enteredPin = pin.join("");

    if (enteredPin.length !== 4) {
      setMessage("Necesitas ingresar 4 símbolos para continuar.");
      return;
    }

    if (enteredPin === selectedChild.pin) {
      setMessage(`¡Bienvenido, ${selectedChild.nombre}! Tu acceso está listo.`);
      setPin([]);
      return;
    }

    setMessage("El PIN no coincide. Intenta otra vez.");
    setPin([]);
  };

  return (
    <main className="min-h-screen bg-[#FFF9EF] px-4 py-8 text-gray-800 md:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#326B50] text-2xl text-white shadow-sm transition hover:bg-[#294f3f]"
            >
              ←
            </Link>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
                Entrada
              </p>
              <h1 className="text-3xl font-black text-[#326B50]">Ingreso de niño</h1>
            </div>
          </div>

          <div className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-bold text-yellow-800">
            🔐 Acceso seguro con avatar y PIN
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <section className="rounded-[32px] border border-[#E8DCC5] bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5">
              <h2 className="text-2xl font-black text-[#326B50]">Elige tu avatar</h2>
              <p className="mt-2 text-sm text-gray-500">
                Selecciona tu personaje para comenzar a jugar.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {niños.map((nino) => {
                const isSelected = nino.id === selectedChild?.id;

                return (
                  <button
                    key={nino.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(nino.id);
                      setPin([]);
                      setMessage(null);
                    }}
                    className={[
                      "flex items-center gap-3 rounded-[24px] border p-3 text-left transition",
                      isSelected
                        ? "border-[#326B50] bg-[#EEF8F3] shadow-sm"
                        : "border-[#E8DCC5] bg-[#FFFDF9] hover:border-[#326B50]/60",
                    ].join(" ")}
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-4xl">
                      {nino.avatar}
                    </div>
                    <div>
                      <p className="text-base font-black text-[#326B50]">{nino.nombre}</p>
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-gray-500">
                        {nino.grupo}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-[32px] border border-[#E8DCC5] bg-[#F9F6F0] p-5 shadow-sm md:p-6">
            {selectedChild ? (
              <>
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
                      Acceso
                    </p>
                    <h2 className="text-2xl font-black text-[#326B50]">{selectedChild.nombre}</h2>
                  </div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-[28px] bg-orange-100 text-5xl">
                    {selectedChild.avatar}
                  </div>
                </div>

                <div className="rounded-[28px] border border-[#E7D9BD] bg-white p-4">
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
                    PIN actual
                  </p>
                  <div className="flex min-h-16 items-center justify-center gap-2 rounded-2xl bg-[#F3F8F5] p-3">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <span
                        key={`slot-${index}`}
                        className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#D7E9DF] bg-white text-2xl text-[#326B50]"
                      >
                        {pin[index] ?? "·"}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-4 gap-3">
                  {pinSymbols.map((symbol) => (
                    <button
                      key={symbol}
                      type="button"
                      onClick={() => handleSymbolPress(symbol)}
                      className="flex h-16 items-center justify-center rounded-2xl border border-[#E7D9BD] bg-white text-3xl shadow-sm transition hover:-translate-y-0.5 hover:border-[#326B50] hover:bg-[#EEF8F3]"
                    >
                      {symbol}
                    </button>
                  ))}
                </div>

                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="flex-1 rounded-full border border-[#D9C8A3] bg-white px-4 py-3 text-sm font-bold text-[#326B50] transition hover:bg-[#F8F3EA]"
                  >
                    Borrar
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex-1 rounded-full border border-[#D9C8A3] bg-white px-4 py-3 text-sm font-bold text-[#326B50] transition hover:bg-[#F8F3EA]"
                  >
                    Reiniciar
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex-1 rounded-full bg-[#326B50] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#294f3f]"
                  >
                    Entrar
                  </button>
                </div>

                {message && (
                  <div
                    className={`mt-5 rounded-2xl border px-4 py-3 text-sm font-medium ${
                      message.includes("Bienvenido")
                        ? "border-green-200 bg-green-50 text-green-700"
                        : "border-red-200 bg-red-50 text-red-700"
                    }`}
                  >
                    {message}
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-3xl border border-dashed border-[#D3C4A9] bg-[#FFFDF9] p-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-3xl">
                  🔍
                </div>
                <h3 className="mt-4 text-2xl font-black text-[#326B50]">Sin perfil</h3>
                <p className="mt-2 text-gray-600">Selecciona un avatar para continuar.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
