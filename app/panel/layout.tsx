"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { href: "/panel", label: "Inicio", icon: "🏠" },
  { href: "/panel/ninos", label: "Niños", icon: "🧒" },
  { href: "/panel/docentes", label: "Docentes", icon: "👩‍🏫" },
  { href: "/panel/grupos", label: "Grupos", icon: "🧩" },
];

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#FFF9EF] text-gray-800">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 p-4 md:p-6 xl:flex-row">
        <aside className="w-full rounded-[28px] border border-[#E8DCC5] bg-white/90 p-4 shadow-sm backdrop-blur-sm xl:w-72 xl:p-5">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-400 text-2xl shadow-sm">
              🌈
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#326B50]/70">
                Panel
              </p>
              <h1 className="text-2xl font-black text-[#326B50]">Kids</h1>
            </div>
          </div>

          <div className="mb-6 rounded-2xl bg-[#326B50] p-4 text-white shadow-sm">
            <p className="text-xs uppercase tracking-[0.18em] text-green-100">
              Directora
            </p>
            <p className="mt-2 text-lg font-extrabold">Ana Pérez</p>
            <p className="mt-1 text-sm text-green-100">Seguimiento educativo</p>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-bold transition-all duration-200",
                    isActive
                      ? "border-[#326B50] bg-[#326B50] text-white shadow-sm"
                      : "border-transparent bg-[#F8F3EA] text-[#326B50] hover:border-[#D7E9DF] hover:bg-[#EEF8F3]",
                  ].join(" ")}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    {item.label}
                  </span>
                  <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">
                    {item.label === "Inicio" ? "Hoy" : ""}
                  </span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 rounded-[28px] border border-[#E8DCC5] bg-white/80 p-4 shadow-sm md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
