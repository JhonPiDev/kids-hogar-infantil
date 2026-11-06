import { acudientes, docentes, grupos, niños } from "@/data/mock";
import type { Acudiente, Docente, Grupo, Niño } from "@/types";

import { comparePin } from "@/lib/security";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function fetchFromSupabase<T>(table: string): Promise<T[] | null> {
  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/${table}?select=*`, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T[];
  } catch {
    return null;
  }
}

export async function getChildren(): Promise<Niño[]> {
  const rows = await fetchFromSupabase<Niño>("children");
  return rows ?? niños;
}

export async function getGroups(): Promise<Grupo[]> {
  const rows = await fetchFromSupabase<Grupo>("groups");
  return rows ?? grupos;
}

export async function getTeachers(): Promise<Docente[]> {
  const rows = await fetchFromSupabase<Docente>("teachers");
  return rows ?? docentes;
}

export async function getGuardians(): Promise<Acudiente[]> {
  const rows = await fetchFromSupabase<Acudiente>("guardians");
  return rows ?? acudientes;
}

export async function getChildById(id: string): Promise<Niño | null> {
  const children = await getChildren();
  return children.find((child) => child.id === id) ?? null;
}

export async function verifyChildPin(childId: string, enteredPin: string): Promise<boolean> {
  const child = await getChildById(childId);

  if (!child) {
    return false;
  }

  return comparePin(enteredPin, child.pin);
}
