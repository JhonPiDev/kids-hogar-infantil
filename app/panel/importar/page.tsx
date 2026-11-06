"use client";

import { useMemo, useState, type ChangeEvent } from "react";
import * as XLSX from "xlsx";

const validGroups = ["párvulos", "caminadores", "prejardín", "jardín"] as const;
const validStates = ["activo", "retirado", "lista de espera"] as const;

const requiredFields = [
  "nombre",
  "apellidos",
  "documento",
  "grupo",
  "fechaNacimiento",
  "estado",
] as const;

type RowResult = {
  rowNumber: number;
  values: Record<string, string>;
  errors: string[];
};

function normalizeHeader(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "")
    .replace(/^(columna|campo)/, "");
}

function normalizeCell(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
}

function validateRows(rows: Record<string, unknown>[]): { validRows: Record<string, string>[]; invalidRows: RowResult[] } {
  const validRows: Record<string, string>[] = [];
  const invalidRows: RowResult[] = [];

  rows.forEach((row, index) => {
    const normalizedRow: Record<string, string> = {};
    Object.entries(row).forEach(([key, value]) => {
      const normalizedKey = normalizeHeader(key);
      normalizedRow[normalizedKey] = normalizeCell(value);
    });

    const errors: string[] = [];
    requiredFields.forEach((field) => {
      if (!normalizedRow[field]) {
        errors.push(`Falta el campo ${field}`);
      }
    });

    if (normalizedRow.grupo && !validGroups.some((group) => group === normalizedRow.grupo)) {
      errors.push(`Grupo no válido: ${normalizedRow.grupo}`);
    }

    if (normalizedRow.estado && !validStates.some((state) => state === normalizedRow.estado)) {
      errors.push(`Estado no válido: ${normalizedRow.estado}`);
    }

    if (normalizedRow.documento && !/^\d{6,12}$/.test(normalizedRow.documento)) {
      errors.push("Documento debe tener entre 6 y 12 dígitos.");
    }

    if (normalizedRow.fechaNacimiento && Number.isNaN(Date.parse(normalizedRow.fechaNacimiento))) {
      errors.push("Fecha de nacimiento inválida.");
    }

    if (errors.length > 0) {
      invalidRows.push({ rowNumber: index + 2, values: normalizedRow, errors });
      return;
    }

    validRows.push({
      nombre: normalizedRow.nombre,
      apellidos: normalizedRow.apellidos,
      documento: normalizedRow.documento,
      grupo: normalizedRow.grupo,
      fechaNacimiento: normalizedRow.fechaNacimiento,
      estado: normalizedRow.estado,
      salud: normalizedRow.salud ?? "Sin información",
      observaciones: normalizedRow.observaciones ?? "",
    });
  });

  return { validRows, invalidRows };
}

function downloadTemplate() {
  const lines = [
    ["nombre", "apellidos", "documento", "grupo", "fechaNacimiento", "estado", "salud", "observaciones"],
    ["Mateo", "García", "1010101010", "párvulos", "2021-04-12", "activo", "Sin alergias", "Le gusta cantar"],
    ["Valentina", "Castro", "1010101011", "prejardín", "2020-11-03", "activo", "Sin alergias", "Disfruta los cuentos"],
  ];

  const csv = lines
    .map((line) => line.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "plantilla-importacion-kids.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function ImportarPage() {
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [invalidRows, setInvalidRows] = useState<RowResult[]>([]);
  const [fileName, setFileName] = useState("");

  const previewRows = useMemo(() => rows.slice(0, 5), [rows]);

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setFileName(file.name);

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
      defval: "",
      raw: false,
    });

    const { validRows, invalidRows: errors } = validateRows(rawRows);
    setRows(validRows);
    setInvalidRows(errors);
  };

  const validCount = rows.length;
  const invalidCount = invalidRows.length;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 border-b border-[#EFE2CC] pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-500">Importación</p>
          <h2 className="mt-2 text-3xl font-black text-[#326B50]">Carga masiva desde Excel</h2>
        </div>

        <button
          type="button"
          onClick={downloadTemplate}
          className="inline-flex items-center justify-center rounded-full border border-[#326B50] bg-white px-5 py-3 text-sm font-bold text-[#326B50] shadow-sm transition hover:bg-[#EEF8F3]"
        >
          Descargar plantilla
        </button>
      </header>

      <section className="rounded-3xl border border-[#EDE0C6] bg-[#F9F6F0] p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <label className="flex-1">
            <span className="mb-2 block text-sm font-bold text-[#326B50]">Archivo</span>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              className="block w-full rounded-2xl border border-[#E7D9BD] bg-white px-4 py-3 text-sm text-gray-700 outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-[#326B50] file:px-4 file:py-2 file:text-sm file:font-bold file:text-white"
            />
          </label>

          <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">Archivo</p>
            <p className="mt-1 text-sm font-bold text-[#326B50]">{fileName || "Sin archivo"}</p>
          </div>
        </div>
      </section>

      {fileName ? (
        <>
          <section className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl bg-orange-100 p-5 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-700">Validos</p>
              <p className="mt-4 text-4xl font-black text-[#326B50]">{validCount}</p>
              <p className="mt-2 text-sm text-gray-600">Registros listos para importar</p>
            </div>

            <div className="rounded-3xl bg-red-100 p-5 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-red-700">Errores</p>
              <p className="mt-4 text-4xl font-black text-[#326B50]">{invalidCount}</p>
              <p className="mt-2 text-sm text-gray-600">Filas con inconsistencias</p>
            </div>

            <div className="rounded-3xl bg-green-100 p-5 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-green-700">Estado</p>
              <p className="mt-4 text-lg font-black text-[#326B50]">
                {invalidCount === 0 ? "Listo para cargar" : "Revisión requerida"}
              </p>
              <p className="mt-2 text-sm text-gray-600">
                {invalidCount === 0 ? "Sin errores detectados" : "Corrige las filas marcadas"}
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-[#EDE0C6] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-black text-[#326B50]">Vista previa</h3>
              <span className="rounded-full bg-[#EEF8F3] px-3 py-1 text-xs font-bold text-[#326B50]">
                Primeros 5 registros
              </span>
            </div>

            {previewRows.length === 0 ? (
              <p className="text-sm text-gray-500">No se encontraron filas válidas para mostrar.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#EFE2CC] text-gray-600">
                      <th className="px-3 py-2 font-bold">Nombre</th>
                      <th className="px-3 py-2 font-bold">Apellidos</th>
                      <th className="px-3 py-2 font-bold">Documento</th>
                      <th className="px-3 py-2 font-bold">Grupo</th>
                      <th className="px-3 py-2 font-bold">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.map((row, index) => (
                      <tr key={`${row.documento}-${index}`} className="border-b border-[#F5EBDC]">
                        <td className="px-3 py-2 text-[#326B50]">{row.nombre}</td>
                        <td className="px-3 py-2 text-[#326B50]">{row.apellidos}</td>
                        <td className="px-3 py-2 text-[#326B50]">{row.documento}</td>
                        <td className="px-3 py-2 text-[#326B50]">{row.grupo}</td>
                        <td className="px-3 py-2 text-[#326B50]">{row.estado}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {invalidRows.length > 0 && (
            <section className="rounded-3xl border border-red-200 bg-red-50 p-5">
              <h3 className="text-xl font-black text-red-700">Filas con errores</h3>
              <div className="mt-4 space-y-3">
                {invalidRows.map((row) => (
                  <div key={row.rowNumber} className="rounded-2xl border border-red-200 bg-white p-4">
                    <p className="text-sm font-black text-red-700">Fila {row.rowNumber}</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-red-700">
                      {row.errors.map((error) => (
                        <li key={`${row.rowNumber}-${error}`}>{error}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      ) : (
        <div className="rounded-3xl border border-dashed border-[#D3C4A9] bg-[#FFFDF9] p-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-3xl">📊</div>
          <h3 className="mt-4 text-2xl font-black text-[#326B50]">Aún no has importado ningún archivo</h3>
          <p className="mt-2 text-gray-600">
            Sube un Excel o CSV con columnas de niño y revisa la vista previa antes de continuar.
          </p>
        </div>
      )}
    </div>
  );
}
