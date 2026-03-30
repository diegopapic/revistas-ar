"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type MagazineData = {
  id?: number;
  name: string;
  description: string;
  editorial: string;
  logoUrl: string;
  foundedYear: string;
  country: string;
};

const empty: MagazineData = {
  name: "",
  description: "",
  editorial: "",
  logoUrl: "",
  foundedYear: "",
  country: "",
};

export default function MagazineForm({ initial }: { initial?: MagazineData }) {
  const router = useRouter();
  const isEdit = !!initial?.id;
  const [form, setForm] = useState<MagazineData>(initial ?? empty);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function set(field: keyof MagazineData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const url = isEdit ? `/api/revistas/${initial!.id}` : "/api/revistas";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/admin/revistas");
    } else {
      const data = await res.json();
      setError(data.error || "Error al guardar");
    }
    setSaving(false);
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
          placeholder="Ej: Crisis"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Editorial</span>
        <input
          value={form.editorial}
          onChange={(e) => set("editorial", e.target.value)}
          className="border rounded px-3 py-2"
          placeholder="Ej: Ediciones de la Urraca"
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Año de fundación</span>
          <input
            type="number"
            value={form.foundedYear}
            onChange={(e) => set("foundedYear", e.target.value)}
            className="border rounded px-3 py-2"
            placeholder="Ej: 1986"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">País</span>
          <input
            value={form.country}
            onChange={(e) => set("country", e.target.value)}
            className="border rounded px-3 py-2"
            placeholder="Ej: Argentina"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Descripción</span>
        <textarea
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          rows={3}
          className="border rounded px-3 py-2"
          placeholder="Breve descripción de la revista..."
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">URL del logo</span>
        <input
          value={form.logoUrl}
          onChange={(e) => set("logoUrl", e.target.value)}
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
          {saving ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear revista"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/revistas")}
          className="border px-4 py-2 rounded text-sm hover:bg-gray-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
