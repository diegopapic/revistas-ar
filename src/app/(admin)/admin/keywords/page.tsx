"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Keyword {
  id: number;
  name: string;
  slug: string;
  _count: { articles: number };
}

export default function AdminKeywordsPage() {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/keywords")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setKeywords(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const refetch = async () => {
    const res = await fetch("/api/keywords");
    const data = await res.json();
    if (Array.isArray(data)) setKeywords(data);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setSaving(true);
    setError("");

    const res = await fetch("/api/keywords", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim() }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Error al crear");
      setSaving(false);
      return;
    }

    setNewName("");
    setSaving(false);
    await refetch();
  };

  const handleRename = async (id: number) => {
    if (!editingName.trim()) return;
    setSaving(true);
    setError("");

    const res = await fetch(`/api/keywords/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editingName.trim() }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Error al renombrar");
      setSaving(false);
      return;
    }

    setEditingId(null);
    setEditingName("");
    setSaving(false);
    await refetch();
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`¿Eliminar el keyword "${name}"?`)) return;
    setError("");

    const res = await fetch(`/api/keywords/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Error al eliminar");
      return;
    }

    await refetch();
  };

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-800 mb-4 inline-block">
        &larr; Volver al panel
      </Link>
      <h1 className="text-2xl font-bold mb-6">Keywords</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleCreate} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Nuevo keyword..."
          className="border rounded px-3 py-2 flex-1"
        />
        <button
          type="submit"
          disabled={saving || !newName.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Crear
        </button>
      </form>

      {loading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : keywords.length === 0 ? (
        <p className="text-gray-500">No hay keywords todavía.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2 px-2">Nombre</th>
              <th className="py-2 px-2">Slug</th>
              <th className="py-2 px-2 text-center">Artículos</th>
              <th className="py-2 px-2"></th>
            </tr>
          </thead>
          <tbody>
            {keywords.map((k) => (
              <tr key={k.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-2">
                  {editingId === k.id ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="border rounded px-2 py-1 flex-1"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleRename(k.id);
                          if (e.key === "Escape") setEditingId(null);
                        }}
                      />
                      <button
                        onClick={() => handleRename(k.id)}
                        disabled={saving}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingId(k.id);
                        setEditingName(k.name);
                      }}
                      className="text-left hover:text-blue-600"
                      title="Click para renombrar"
                    >
                      {k.name}
                    </button>
                  )}
                </td>
                <td className="py-2 px-2 text-gray-500 text-sm">{k.slug}</td>
                <td className="py-2 px-2 text-center">{k._count.articles}</td>
                <td className="py-2 px-2 text-right">
                  <button
                    onClick={() => handleDelete(k.id, k.name)}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
