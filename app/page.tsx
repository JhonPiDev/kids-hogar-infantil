import Link from "next/link";

const perfiles = [
  {
    emoji: "🧒",
    titulo: "Soy un niño",
    descripcion: "Entra a jugar, aprender y descubrir cosas nuevas.",
    color: "bg-orange-100",
    etiqueta: "Aprender jugando",
  },
  {
    emoji: "👩‍🏫",
    titulo: "Soy docente",
    descripcion: "Organiza actividades y consulta el progreso de tus estudiantes.",
    color: "bg-blue-100",
    etiqueta: "Panel educativo",
  },
  {
    emoji: "👨‍👩‍👧",
    titulo: "Soy padre o acudiente",
    descripcion: "Conoce los avances y actividades de tus hijos.",
    color: "bg-green-100",
    etiqueta: "Portal familiar",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FFF9EF] text-gray-800">
      <header className="flex items-center justify-between px-6 py-5 md:px-16">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-400 text-2xl">
            🌈
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#326B50]">
              Kids
            </h1>
            <p className="text-xs text-gray-500">
              Hogar Infantil
            </p>
          </div>
        </div>

        <span className="hidden rounded-full bg-green-100 px-5 py-2 text-sm font-semibold text-green-800 sm:block">
          ¡Aprender es una aventura!
        </span>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-12 text-center md:py-20">
        <div className="mb-6 inline-block rounded-full bg-yellow-100 px-5 py-2 text-sm font-bold text-yellow-800">
          ✨ Bienvenidos a nuestro mundo
        </div>

        <h2 className="text-4xl font-black leading-tight text-[#326B50] md:text-6xl">
          ¡Aprender nunca fue
          <br />
          tan <span className="text-orange-400">divertido!</span>
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">
          Un espacio donde los niños aprenden jugando,
          descubren nuevas habilidades y viven grandes aventuras.
        </p>

        <div className="mt-10 flex justify-center gap-4 text-5xl">
          <span>🧩</span>
          <span>🎨</span>
          <span>🔢</span>
          <span>📚</span>
          <span>⭐</span>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <h3 className="mb-3 text-center text-2xl font-black text-[#326B50]">
          ¿Cómo deseas ingresar?
        </h3>
        <p className="mb-10 text-center text-gray-500">
          Selecciona tu perfil para continuar.
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          {perfiles.map((perfil) => (
            <div
              key={perfil.titulo}
              className="rounded-3xl border border-gray-100 bg-white p-7 text-center shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div
                className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full text-5xl ${perfil.color}`}
              >
                {perfil.emoji}
              </div>

              <span className="mt-6 inline-block rounded-full bg-gray-100 px-4 py-1 text-xs font-bold text-gray-600">
                {perfil.etiqueta}
              </span>

              <h4 className="mt-4 text-xl font-extrabold text-[#326B50]">
                {perfil.titulo}
              </h4>

              <p className="mt-3 min-h-16 text-sm leading-relaxed text-gray-500">
                {perfil.descripcion}
              </p>

              {perfil.titulo === "Soy un niño" ? (
                <Link
                  href="/ninos/ingresar"
                  className="mt-5 inline-flex items-center justify-center rounded-full bg-[#326B50] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#294f3f]"
                >
                  Entrar
                </Link>
              ) : (
                <p className="mt-5 text-sm font-bold text-orange-500">
                  Acceso próximamente
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-[#326B50] px-6 py-7 text-center text-white">
        <p className="font-bold">🌈 Kids – Hogar Infantil</p>
        <p className="mt-2 text-sm text-green-100">
          Creciendo, aprendiendo y jugando juntos.
        </p>
      </footer>
    </main>
  );
}
