"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Magazine = {
  id: number;
  name: string;
  slug: string;
  editorial: string | null;
  foundedYear: number | null;
  country: string | null;
  _count: { articles: number; issues: number };
};

export default function AdminRevistasPage() {
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/revistas")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setMagazines(data);
        else console.error("API error:", data);
      })
      .catch((e) => console.error("Fetch error:", e))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(mag: Magazine) {
    if (!confirm(`¿Eliminar "${mag.name}"? Esta acción no se puede deshacer.`)) return;
    setDeleting(mag.id);
    const res = await fetch(`/api/revistas/${mag.id}`, { method: "DELETE" });
    if (res.ok) {
      setMagazines((prev) => prev.filter((m) => m.id !== mag.id));
    } else {
      const data = await res.json();
      alert(data.error || "Error al eliminar");
    }
    setDeleting(null);
  }

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-800 mb-4 inline-block">
        ← Volver al panel
      </Link>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Revistas</h1>
        <Link
          href="/admin/revistas/nuevo"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm"
        >
          + Nueva revista
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : magazines.length === 0 ? (
        <p className="text-gray-500">No hay revistas cargadas.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2 pr-4 font-semibold">Nombre</th>
                <th className="py-2 pr-4 font-semibold">Editorial</th>
                <th className="py-2 pr-4 font-semibold">Año</th>
                <th className="py-2 pr-4 font-semibold">País</th>
                <th className="py-2 pr-4 font-semibold text-right">Artículos</th>
                <th className="py-2 pr-4 font-semibold text-right">Números</th>
                <th className="py-2 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {magazines.map((mag) => (
                <tr key={mag.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 pr-4">
                    <Link
                      href={`/admin/revistas/${mag.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {mag.name}
                    </Link>
                  </td>
                  <td className="py-2 pr-4 text-gray-600">{mag.editorial || "—"}</td>
                  <td className="py-2 pr-4 text-gray-600">{mag.foundedYear || "—"}</td>
                  <td className="py-2 pr-4 text-gray-600">{mag.country || "—"}</td>
                  <td className="py-2 pr-4 text-right text-gray-600">{mag._count.articles}</td>
                  <td className="py-2 pr-4 text-right text-gray-600">{mag._count.issues}</td>
                  <td className="py-2 text-right">
                    <button
                      onClick={() => handleDelete(mag)}
                      disabled={deleting === mag.id}
                      className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
                    >
                      {deleting === mag.id ? "Eliminando..." : "Eliminar"}
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
