"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { FormEvent } from "react";

import { acudientes } from "@/data/mock";
import type { EstadoNiño, GrupoNombre, Niño } from "@/types";

const grupoOptions: GrupoNombre[] = [
  "párvulos",
  "caminadores",
  "prejardín",
  "jardín",
];

const estadoOptions: EstadoNiño[] = ["activo", "retirado", "lista de espera"];

type FormState = {
  nombre: string;
  apellidos: string;
  fechaNacimiento: string;
  documento: string;
  grupo: GrupoNombre | "";
  foto: string;
  alergias: string;
  condiciones: string;
  eps: string;
  observaciones: string;
  estado: EstadoNiño;
};

type FormErrors = Partial<Record<keyof FormState | "acudienteInfo" | "autorizaciones", string>>;

type AcudienteFormState = {
  nombre: string;
  apellidos: string;
  documento: string;
  parentesco: string;
  telefono: string;
  correo: string;
  contactoNombre: string;
  contactoTelefono: string;
  contactoParentesco: string;
  autorizadas: string;
};

const initialForm: FormState = {
  nombre: "",
  apellidos: "",
  fechaNacimiento: "",
  documento: "",
  grupo: "",
  foto: "",
  alergias: "",
  condiciones: "",
  eps: "",
  observaciones: "",
  estado: "activo",
};

const initialAcudienteForm: AcudienteFormState = {
  nombre: "",
  apellidos: "",
  documento: "",
  parentesco: "",
  telefono: "",
  correo: "",
  contactoNombre: "",
  contactoTelefono: "",
  contactoParentesco: "",
  autorizadas: "",
};

type AutorizacionesState = {
  tratamientoDatos: boolean;
  usoFotos: boolean;
  fecha: string;
  constancia: string;
};

const initialAutorizaciones: AutorizacionesState = {
  tratamientoDatos: false,
  usoFotos: false,
  fecha: "",
  constancia: "",
};

const parseList = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export default function NuevoNinoPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [acudienteForm, setAcudienteForm] = useState<AcudienteFormState>(initialAcudienteForm);
  const [autorizaciones, setAutorizaciones] = useState<AutorizacionesState>(initialAutorizaciones);
  const [selectedCaregiverIds, setSelectedCaregiverIds] = useState<string[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [savedChildren, setSavedChildren] = useState<Niño[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  const recentChildren = useMemo(() => savedChildren.slice(0, 3), [savedChildren]);

  const updateField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setFeedback(null);
  };

  const updateAcudienteField = (field: keyof AcudienteFormState, value: string) => {
    setAcudienteForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, acudienteInfo: undefined }));
    setFeedback(null);
  };

  const toggleCaregiver = (caregiverId: string) => {
    setSelectedCaregiverIds((current) => {
      if (current.includes(caregiverId)) {
        return current.filter((id) => id !== caregiverId);
      }

      return [...current, caregiverId];
    });

    setErrors((current) => ({ ...current, acudienteInfo: undefined }));
    setFeedback(null);
  };

  const updateAutorizacion = (field: keyof AutorizacionesState, value: boolean | string) => {
    setAutorizaciones((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, autorizaciones: undefined }));
    setFeedback(null);
  };

  const validateForm = () => {
    const nextErrors: FormErrors = {};

    if (!form.nombre.trim()) {
      nextErrors.nombre = "El nombre es obligatorio.";
    }

    if (!form.apellidos.trim()) {
      nextErrors.apellidos = "Los apellidos son obligatorios.";
    }

    if (!form.fechaNacimiento) {
      nextErrors.fechaNacimiento = "La fecha de nacimiento es obligatoria.";
    } else {
      const birthDate = new Date(form.fechaNacimiento);
      const today = new Date();

      if (Number.isNaN(birthDate.getTime()) || birthDate > today) {
        nextErrors.fechaNacimiento = "La fecha no puede estar en el futuro.";
      }
    }

    if (!form.documento.trim()) {
      nextErrors.documento = "El documento es obligatorio.";
    } else if (form.documento.trim().length < 6) {
      nextErrors.documento = "El documento debe tener al menos 6 caracteres.";
    }

    if (!form.grupo) {
      nextErrors.grupo = "Selecciona un grupo.";
    }

    if (!form.eps.trim()) {
      nextErrors.eps = "La EPS es obligatoria.";
    }

    if (form.observaciones.trim().length > 500) {
      nextErrors.observaciones = "Las observaciones deben tener máximo 500 caracteres.";
    }

    const hasSelectedCaregivers = selectedCaregiverIds.length > 0;
    const hasAcudienteDraft = Object.values(acudienteForm).some((value) => value.trim().length > 0);

    if (!hasSelectedCaregivers && !hasAcudienteDraft) {
      nextErrors.acudienteInfo = "Debes vincular al menos un acudiente o completar sus datos.";
    }

    if (hasAcudienteDraft) {
      const requiredFields: Array<keyof AcudienteFormState> = [
        "nombre",
        "apellidos",
        "documento",
        "parentesco",
        "telefono",
        "contactoNombre",
        "contactoTelefono",
      ];

      const missingField = requiredFields.find((field) => !acudienteForm[field].trim());

      if (missingField) {
        nextErrors.acudienteInfo = `Completa el campo de ${missingField.replace(/([A-Z])/g, " $1").toLowerCase()} del acudiente.`;
      }
    }

    if (!autorizaciones.tratamientoDatos) {
      nextErrors.autorizaciones = "Es obligatorio autorizar el tratamiento de datos para guardar la ficha.";
    }

    if (!autorizaciones.fecha.trim()) {
      nextErrors.autorizaciones = "La fecha de autorización es obligatoria.";
    }

    if (!autorizaciones.constancia.trim()) {
      nextErrors.autorizaciones = "La constancia del acudiente es obligatoria.";
    }

    return nextErrors;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateForm();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setFeedback("Revisa los campos marcados antes de guardar.");
      return;
    }

    const linkedCaregivers = selectedCaregiverIds.length > 0 ? selectedCaregiverIds : [`acudiente-${Date.now()}`];

    const newChild: Niño = {
      id: `registro-${Date.now()}`,
      nombre: form.nombre.trim(),
      apellidos: form.apellidos.trim(),
      fechaNacimiento: form.fechaNacimiento,
      documento: form.documento.trim(),
      grupo: form.grupo as GrupoNombre,
      foto: form.foto.trim() || undefined,
      salud: {
        alergias: parseList(form.alergias),
        condiciones: parseList(form.condiciones),
        eps: form.eps.trim(),
      },
      observaciones: form.observaciones.trim(),
      estado: form.estado,
      avatar: "🧒",
      pin: "🧒✨🌟🐾",
      acudienteIds: linkedCaregivers,
    };

    setSavedChildren((current) => [newChild, ...current]);
    setFeedback(`Niño ${newChild.nombre} ${newChild.apellidos} guardado en memoria.`);
    setForm(initialForm);
    setAcudienteForm(initialAcudienteForm);
    setAutorizaciones(initialAutorizaciones);
    setSelectedCaregiverIds([]);
    setErrors({});
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 border-b border-[#EFE2CC] pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-500">
            Registro
          </p>
          <h2 className="mt-2 text-3xl font-black text-[#326B50]">Nuevo niño</h2>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/panel/ninos"
            className="inline-flex items-center justify-center rounded-full border border-[#326B50] bg-white px-4 py-2.5 text-sm font-bold text-[#326B50] transition hover:bg-[#EEF8F3]"
          >
            Volver a la lista
          </Link>
        </div>
      </header>

      {feedback && (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
            feedback.toLowerCase().includes("revisa")
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-green-200 bg-green-50 text-green-700"
          }`}
        >
          {feedback}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-3xl border border-[#EDE0C6] bg-[#F9F6F0] p-4 md:p-5">
          <div className="mb-4">
            <h3 className="text-xl font-black text-[#326B50]">Datos básicos</h3>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-[#326B50]">Nombre</span>
              <input
                type="text"
                value={form.nombre}
                onChange={(event) => updateField("nombre", event.target.value)}
                placeholder="Ej. Mateo"
                className="w-full rounded-2xl border border-[#E7D9BD] bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-[#326B50] focus:ring-2 focus:ring-[#326B50]/10"
              />
              {errors.nombre && <span className="mt-1 block text-xs font-medium text-red-600">{errors.nombre}</span>}
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-[#326B50]">Apellidos</span>
              <input
                type="text"
                value={form.apellidos}
                onChange={(event) => updateField("apellidos", event.target.value)}
                placeholder="Ej. García"
                className="w-full rounded-2xl border border-[#E7D9BD] bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-[#326B50] focus:ring-2 focus:ring-[#326B50]/10"
              />
              {errors.apellidos && <span className="mt-1 block text-xs font-medium text-red-600">{errors.apellidos}</span>}
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-[#326B50]">Fecha de nacimiento</span>
              <input
                type="date"
                value={form.fechaNacimiento}
                onChange={(event) => updateField("fechaNacimiento", event.target.value)}
                className="w-full rounded-2xl border border-[#E7D9BD] bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-[#326B50] focus:ring-2 focus:ring-[#326B50]/10"
              />
              {errors.fechaNacimiento && (
                <span className="mt-1 block text-xs font-medium text-red-600">{errors.fechaNacimiento}</span>
              )}
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-[#326B50]">Documento</span>
              <input
                type="text"
                value={form.documento}
                onChange={(event) => updateField("documento", event.target.value)}
                placeholder="Ej. 1010101010"
                className="w-full rounded-2xl border border-[#E7D9BD] bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-[#326B50] focus:ring-2 focus:ring-[#326B50]/10"
              />
              {errors.documento && <span className="mt-1 block text-xs font-medium text-red-600">{errors.documento}</span>}
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-[#326B50]">Grupo</span>
              <select
                value={form.grupo}
                onChange={(event) => updateField("grupo", event.target.value)}
                className="w-full rounded-2xl border border-[#E7D9BD] bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-[#326B50] focus:ring-2 focus:ring-[#326B50]/10"
              >
                <option value="">Selecciona un grupo</option>
                {grupoOptions.map((grupo) => (
                  <option key={grupo} value={grupo}>
                    {grupo}
                  </option>
                ))}
              </select>
              {errors.grupo && <span className="mt-1 block text-xs font-medium text-red-600">{errors.grupo}</span>}
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-[#326B50]">Estado</span>
              <select
                value={form.estado}
                onChange={(event) => updateField("estado", event.target.value)}
                className="w-full rounded-2xl border border-[#E7D9BD] bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-[#326B50] focus:ring-2 focus:ring-[#326B50]/10"
              >
                {estadoOptions.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-bold text-[#326B50]">Foto opcional</span>
              <input
                type="url"
                value={form.foto}
                onChange={(event) => updateField("foto", event.target.value)}
                placeholder="https://ejemplo.com/foto.jpg"
                className="w-full rounded-2xl border border-[#E7D9BD] bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-[#326B50] focus:ring-2 focus:ring-[#326B50]/10"
              />
            </label>
          </div>
        </section>

        <section className="rounded-3xl border border-[#EDE0C6] bg-[#F9F6F0] p-4 md:p-5">
          <div className="mb-4">
            <h3 className="text-xl font-black text-[#326B50]">Salud y observaciones</h3>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-[#326B50]">Alergias</span>
              <textarea
                value={form.alergias}
                onChange={(event) => updateField("alergias", event.target.value)}
                rows={3}
                placeholder="Ej. maní, huevo"
                className="w-full rounded-2xl border border-[#E7D9BD] bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-[#326B50] focus:ring-2 focus:ring-[#326B50]/10"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-[#326B50]">Condiciones</span>
              <textarea
                value={form.condiciones}
                onChange={(event) => updateField("condiciones", event.target.value)}
                rows={3}
                placeholder="Ej. asma, sueño ligero"
                className="w-full rounded-2xl border border-[#E7D9BD] bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-[#326B50] focus:ring-2 focus:ring-[#326B50]/10"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-bold text-[#326B50]">EPS</span>
              <input
                type="text"
                value={form.eps}
                onChange={(event) => updateField("eps", event.target.value)}
                placeholder="Ej. Sanitas"
                className="w-full rounded-2xl border border-[#E7D9BD] bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-[#326B50] focus:ring-2 focus:ring-[#326B50]/10"
              />
              {errors.eps && <span className="mt-1 block text-xs font-medium text-red-600">{errors.eps}</span>}
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-bold text-[#326B50]">Observaciones</span>
              <textarea
                value={form.observaciones}
                onChange={(event) => updateField("observaciones", event.target.value)}
                rows={4}
                placeholder="Escribe información relevante para el seguimiento del niño."
                className="w-full rounded-2xl border border-[#E7D9BD] bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-[#326B50] focus:ring-2 focus:ring-[#326B50]/10"
              />
              {errors.observaciones && (
                <span className="mt-1 block text-xs font-medium text-red-600">{errors.observaciones}</span>
              )}
            </label>
          </div>
        </section>

        <section className="rounded-3xl border border-[#EDE0C6] bg-[#F9F6F0] p-4 md:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-xl font-black text-[#326B50]">Acudientes</h3>
            <span className="rounded-full bg-[#326B50] px-3 py-1 text-xs font-bold text-white">
              {selectedCaregiverIds.length} vinculados
            </span>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-[#E7D9BD] bg-white p-4">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-[#326B50]">
                Vincular acudientes existentes
              </p>

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {acudientes.map((acudiente) => {
                  const isSelected = selectedCaregiverIds.includes(acudiente.id);

                  return (
                    <button
                      key={acudiente.id}
                      type="button"
                      onClick={() => toggleCaregiver(acudiente.id)}
                      className={[
                        "rounded-2xl border p-3 text-left transition",
                        isSelected
                          ? "border-[#326B50] bg-[#EEF8F3] shadow-sm"
                          : "border-[#E7D9BD] bg-[#FFFDF9] hover:border-[#326B50]/50",
                      ].join(" ")}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-base font-black text-[#326B50]">
                          {acudiente.nombre} {acudiente.apellidos}
                        </span>
                        <span className="text-xl">{isSelected ? "✅" : "○"}</span>
                      </div>
                      <p className="mt-2 text-xs font-medium text-gray-600">{acudiente.parentesco}</p>
                      <p className="mt-1 text-xs text-gray-500">{acudiente.telefono}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-[#326B50]">Nombre del acudiente</span>
                <input
                  type="text"
                  value={acudienteForm.nombre}
                  onChange={(event) => updateAcudienteField("nombre", event.target.value)}
                  placeholder="Ej. María"
                  className="w-full rounded-2xl border border-[#E7D9BD] bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-[#326B50] focus:ring-2 focus:ring-[#326B50]/10"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-[#326B50]">Apellidos</span>
                <input
                  type="text"
                  value={acudienteForm.apellidos}
                  onChange={(event) => updateAcudienteField("apellidos", event.target.value)}
                  placeholder="Ej. López"
                  className="w-full rounded-2xl border border-[#E7D9BD] bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-[#326B50] focus:ring-2 focus:ring-[#326B50]/10"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-[#326B50]">Documento</span>
                <input
                  type="text"
                  value={acudienteForm.documento}
                  onChange={(event) => updateAcudienteField("documento", event.target.value)}
                  placeholder="Ej. 1234567890"
                  className="w-full rounded-2xl border border-[#E7D9BD] bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-[#326B50] focus:ring-2 focus:ring-[#326B50]/10"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-[#326B50]">Parentesco</span>
                <input
                  type="text"
                  value={acudienteForm.parentesco}
                  onChange={(event) => updateAcudienteField("parentesco", event.target.value)}
                  placeholder="Ej. madre"
                  className="w-full rounded-2xl border border-[#E7D9BD] bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-[#326B50] focus:ring-2 focus:ring-[#326B50]/10"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-[#326B50]">Teléfono</span>
                <input
                  type="tel"
                  value={acudienteForm.telefono}
                  onChange={(event) => updateAcudienteField("telefono", event.target.value)}
                  placeholder="Ej. 3201234567"
                  className="w-full rounded-2xl border border-[#E7D9BD] bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-[#326B50] focus:ring-2 focus:ring-[#326B50]/10"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-[#326B50]">Correo</span>
                <input
                  type="email"
                  value={acudienteForm.correo}
                  onChange={(event) => updateAcudienteField("correo", event.target.value)}
                  placeholder="Ej. maria@email.com"
                  className="w-full rounded-2xl border border-[#E7D9BD] bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-[#326B50] focus:ring-2 focus:ring-[#326B50]/10"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-[#326B50]">Contacto de emergencia</span>
                <input
                  type="text"
                  value={acudienteForm.contactoNombre}
                  onChange={(event) => updateAcudienteField("contactoNombre", event.target.value)}
                  placeholder="Ej. Carlos López"
                  className="w-full rounded-2xl border border-[#E7D9BD] bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-[#326B50] focus:ring-2 focus:ring-[#326B50]/10"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-[#326B50]">Teléfono de emergencia</span>
                <input
                  type="tel"
                  value={acudienteForm.contactoTelefono}
                  onChange={(event) => updateAcudienteField("contactoTelefono", event.target.value)}
                  placeholder="Ej. 3129876543"
                  className="w-full rounded-2xl border border-[#E7D9BD] bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-[#326B50] focus:ring-2 focus:ring-[#326B50]/10"
                />
              </label>

              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-bold text-[#326B50]">Parentesco del contacto</span>
                <input
                  type="text"
                  value={acudienteForm.contactoParentesco}
                  onChange={(event) => updateAcudienteField("contactoParentesco", event.target.value)}
                  placeholder="Ej. abuelo"
                  className="w-full rounded-2xl border border-[#E7D9BD] bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-[#326B50] focus:ring-2 focus:ring-[#326B50]/10"
                />
              </label>

              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-bold text-[#326B50]">Personas autorizadas</span>
                <textarea
                  value={acudienteForm.autorizadas}
                  onChange={(event) => updateAcudienteField("autorizadas", event.target.value)}
                  rows={3}
                  placeholder="Ej. Ana López, Felipe Ruiz"
                  className="w-full rounded-2xl border border-[#E7D9BD] bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-[#326B50] focus:ring-2 focus:ring-[#326B50]/10"
                />
              </label>
            </div>

            {errors.acudienteInfo && (
              <p className="text-sm font-medium text-red-600">{errors.acudienteInfo}</p>
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-[#EDE0C6] bg-[#F9F6F0] p-4 md:p-5">
          <div className="mb-4">
            <h3 className="text-xl font-black text-[#326B50]">Autorizaciones</h3>
          </div>

          <div className="space-y-4">
            <label className="flex items-start gap-3 rounded-2xl border border-[#E7D9BD] bg-white p-4">
              <input
                type="checkbox"
                checked={autorizaciones.tratamientoDatos}
                onChange={(event) =>
                  updateAutorizacion("tratamientoDatos", event.target.checked)
                }
                className="mt-1 h-5 w-5 accent-[#326B50]"
              />
              <span className="text-sm text-gray-700">
                Autorizo el tratamiento de datos personales del niño conforme a la Ley 1581 de 2012,
                con fines educativos y de cuidado institucional.
              </span>
            </label>

            <label className="flex items-start gap-3 rounded-2xl border border-[#E7D9BD] bg-white p-4">
              <input
                type="checkbox"
                checked={autorizaciones.usoFotos}
                onChange={(event) => updateAutorizacion("usoFotos", event.target.checked)}
                className="mt-1 h-5 w-5 accent-[#326B50]"
              />
              <span className="text-sm text-gray-700">
                Autorizo el uso de fotos y evidencias del niño para fines pedagógicos y de comunicación
                institucional.
              </span>
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-[#326B50]">Fecha de autorización</span>
                <input
                  type="date"
                  value={autorizaciones.fecha}
                  onChange={(event) => updateAutorizacion("fecha", event.target.value)}
                  className="w-full rounded-2xl border border-[#E7D9BD] bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-[#326B50] focus:ring-2 focus:ring-[#326B50]/10"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-[#326B50]">Constancia</span>
                <input
                  type="text"
                  value={autorizaciones.constancia}
                  onChange={(event) => updateAutorizacion("constancia", event.target.value)}
                  placeholder="Nombre del acudiente responsable"
                  className="w-full rounded-2xl border border-[#E7D9BD] bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-[#326B50] focus:ring-2 focus:ring-[#326B50]/10"
                />
              </label>
            </div>

            {errors.autorizaciones && (
              <p className="text-sm font-medium text-red-600">{errors.autorizaciones}</p>
            )}
          </div>
        </section>

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => {
              setForm(initialForm);
              setAcudienteForm(initialAcudienteForm);
              setAutorizaciones(initialAutorizaciones);
              setSelectedCaregiverIds([]);
              setErrors({});
              setFeedback(null);
            }}
            className="inline-flex items-center justify-center rounded-full border border-[#D9C8A3] bg-white px-5 py-3 text-sm font-bold text-[#326B50] transition hover:bg-[#F3F8F5]"
          >
            Limpiar
          </button>
          <button
            type="button"
            onClick={() => {
              setForm(initialForm);
              setAcudienteForm(initialAcudienteForm);
              setSelectedCaregiverIds([]);
              setErrors({});
              setFeedback(null);
            }}
            className="inline-flex items-center justify-center rounded-full border border-[#D9C8A3] bg-white px-5 py-3 text-sm font-bold text-[#326B50] transition hover:bg-[#F3F8F5]"
          >
            Limpiar
          </button>

          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-[#326B50] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#294f3f]"
          >
            Guardar niño
          </button>
        </div>
      </form>

      {recentChildren.length > 0 && (
        <section className="rounded-3xl border border-[#EDE0C6] bg-[#F5FAF7] p-4 md:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-xl font-black text-[#326B50]">Guardados en esta sesión</h3>
            <span className="rounded-full bg-[#326B50] px-3 py-1 text-xs font-bold text-white">
              {savedChildren.length} niño(s)
            </span>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {recentChildren.map((nino) => (
              <article key={nino.id} className="rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-3xl">
                    {nino.avatar}
                  </div>
                  <div>
                    <p className="text-base font-black text-[#326B50]">
                      {nino.nombre} {nino.apellidos}
                    </p>
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-gray-500">
                      {nino.grupo}
                    </p>
                  </div>
                </div>

                <div className="mt-3 space-y-2 text-sm text-gray-600">
                  <p>
                    <span className="font-bold text-[#326B50]">Documento:</span> {nino.documento}
                  </p>
                  <p>
                    <span className="font-bold text-[#326B50]">EPS:</span> {nino.salud.eps}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
