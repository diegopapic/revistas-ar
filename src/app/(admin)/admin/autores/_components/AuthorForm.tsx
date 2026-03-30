"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type AuthorData = {
  id?: number;
  name: string;
  bio: string;
  photoUrl: string;
  birthDate: string;
  birthPlace: string;
  deathDate: string;
  deathPlace: string;
};

const empty: AuthorData = {
  name: "",
  bio: "",
  photoUrl: "",
  birthDate: "",
  birthPlace: "",
  deathDate: "",
  deathPlace: "",
};

export default function AuthorForm({ initial }: { initial?: AuthorData }) {
  const router = useRouter();
  const isEdit = !!initial?.id;
  const [form, setForm] = useState<AuthorData>(initial ?? empty);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function set(field: keyof AuthorData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const url = isEdit ? `/api/autores/${initial!.id}` : "/api/autores";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push("/admin/autores");
        return;
      }

      const data = await res.json();
      setError(data.error || "Error al guardar");
    } catch {
      setError("Error de conexión al guardar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Nombre *</span>
        <input
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          required
          className="border rounded px-3 py-2"
          placeholder="Ej: Rodolfo Walsh"
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Fecha de nacimiento</span>
          <input
            type="date"
            value={form.birthDate}
            onChange={(e) => set("birthDate", e.target.value)}
            className="border rounded px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Lugar de nacimiento</span>
          <input
            value={form.birthPlace}
            onChange={(e) => set("birthPlace", e.target.value)}
            className="border rounded px-3 py-2"
            placeholder="Ej: Buenos Aires"
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Fecha de fallecimiento</span>
          <input
            type="date"
            value={form.deathDate}
            onChange={(e) => set("deathDate", e.target.value)}
            className="border rounded px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Lugar de fallecimiento</span>
          <input
            value={form.deathPlace}
            onChange={(e) => set("deathPlace", e.target.value)}
            className="border rounded px-3 py-2"
            placeholder="Ej: Buenos Aires"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Biografía</span>
        <textarea
          value={form.bio}
          onChange={(e) => set("bio", e.target.value)}
          rows={4}
          className="border rounded px-3 py-2"
          placeholder="Breve biografía del autor..."
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">URL de la foto</span>
        <input
          value={form.photoUrl}
          onChange={(e) => set("photoUrl", e.target.value)}
          className="border rounded px-3 py-2"
          placeholder="https://res.cloudinary.com/..."
        />
      </label>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm disabled:opacity-50"
        >
          {saving ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear autor"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/autores")}
          className="border px-4 py-2 rounded text-sm hover:bg-gray-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
