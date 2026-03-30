"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Author = {
  id: number;
  name: string;
  slug: string;
  birthDate: string | null;
  deathDate: string | null;
  birthPlace: string | null;
  _count: { articles: number };
};

function formatDate(iso: string | null) {
  if (!iso) return null;
  const d = new Date(iso);
  return d.toLocaleDateString("es-AR");
}

export default function AdminAutoresPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/autores")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setAuthors(data);
        else console.error("API error:", data);
      })
      .catch((e) => console.error("Fetch error:", e))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(author: Author) {
    if (!confirm(`¿Eliminar "${author.name}"? Esta acción no se puede deshacer.`)) return;
    setDeleting(author.id);
    const res = await fetch(`/api/autores/${author.id}`, { method: "DELETE" });
    if (res.ok) {
      setAuthors((prev) => prev.filter((a) => a.id !== author.id));
    } else {
      const data = await res.json();
      alert(data.error || "Error al eliminar");
    }
    setDeleting(null);
  }

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Autores</h1>
        <Link
          href="/admin/autores/nuevo"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm"
        >
          + Nuevo autor
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : authors.length === 0 ? (
        <p className="text-gray-500">No hay autores cargados.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2 pr-4 font-semibold">Nombre</th>
                <th className="py-2 pr-4 font-semibold">Nacimiento</th>
                <th className="py-2 pr-4 font-semibold">Fallecimiento</th>
                <th className="py-2 pr-4 font-semibold">Lugar</th>
                <th className="py-2 pr-4 font-semibold text-right">Artículos</th>
                <th className="py-2 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {authors.map((author) => (
                <tr key={author.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 pr-4">
                    <Link
                      href={`/admin/autores/${author.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {author.name}
                    </Link>
                  </td>
                  <td className="py-2 pr-4 text-gray-600">{formatDate(author.birthDate) || "—"}</td>
                  <td className="py-2 pr-4 text-gray-600">{formatDate(author.deathDate) || "—"}</td>
                  <td className="py-2 pr-4 text-gray-600">{author.birthPlace || "—"}</td>
                  <td className="py-2 pr-4 text-right text-gray-600">{author._count.articles}</td>
                  <td className="py-2 text-right">
                    <button
                      onClick={() => handleDelete(author)}
                      disabled={deleting === author.id}
                      className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
                    >
                      {deleting === author.id ? "Eliminando..." : "Eliminar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
