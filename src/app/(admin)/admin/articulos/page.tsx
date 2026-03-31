"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ArticleRow = {
  id: number;
  title: string;
  slug: string;
  magazine: { id: number; name: string } | null;
  section: { id: number; name: string } | null;
  authors: { author: { id: number; name: string } }[];
  createdAt: string;
};

type Option = { id: number; name: string };

export default function AdminArticulosPage() {
  const [articles, setArticles] = useState<ArticleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  const [magazines, setMagazines] = useState<Option[]>([]);
  const [authors, setAuthors] = useState<Option[]>([]);
  const [sections, setSections] = useState<Option[]>([]);

  const [filterMagazine, setFilterMagazine] = useState("");
  const [filterAuthor, setFilterAuthor] = useState("");
  const [filterSection, setFilterSection] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/revistas").then((r) => r.json()),
      fetch("/api/autores").then((r) => r.json()),
      fetch("/api/secciones").then((r) => r.json()),
    ]).then(([mags, auths, secs]) => {
      if (Array.isArray(mags)) setMagazines(mags);
      if (Array.isArray(auths)) setAuthors(auths);
      if (Array.isArray(secs)) setSections(secs);
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams();
    if (filterMagazine) params.set("magazineId", filterMagazine);
    if (filterAuthor) params.set("authorId", filterAuthor);
    if (filterSection) params.set("sectionId", filterSection);

    fetch(`/api/articulos?${params}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (Array.isArray(data)) setArticles(data);
        else console.error("API error:", data);
      })
      .catch((e) => {
        if (!cancelled) console.error("Fetch error:", e);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [filterMagazine, filterAuthor, filterSection]);

  async function handleDelete(art: ArticleRow) {
    if (!confirm(`¿Eliminar "${art.title}"? Esta acción no se puede deshacer.`)) return;
    setDeleting(art.id);
    const res = await fetch(`/api/articulos/${art.id}`, { method: "DELETE" });
    if (res.ok) {
      setArticles((prev) => prev.filter((a) => a.id !== art.id));
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
        <h1 className="text-2xl font-bold">Artículos</h1>
        <Link
          href="/admin/articulos/nuevo"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm"
        >
          + Nuevo artículo
        </Link>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <select
          value={filterMagazine}
          onChange={(e) => setFilterMagazine(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="">Todas las revistas</option>
          {magazines.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
        <select
          value={filterAuthor}
          onChange={(e) => setFilterAuthor(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="">Todos los autores</option>
          {authors.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
        <select
          value={filterSection}
          onChange={(e) => setFilterSection(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="">Todas las secciones</option>
          {sections.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : articles.length === 0 ? (
        <p className="text-gray-500">No hay artículos.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2 pr-4 font-semibold">Título</th>
                <th className="py-2 pr-4 font-semibold">Revista</th>
                <th className="py-2 pr-4 font-semibold">Autores</th>
                <th className="py-2 pr-4 font-semibold">Sección</th>
                <th className="py-2 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {articles.map((art) => (
                <tr key={art.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 pr-4">
                    <Link
                      href={`/admin/articulos/${art.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {art.title}
                    </Link>
                  </td>
                  <td className="py-2 pr-4 text-gray-600">{art.magazine?.name || "—"}</td>
                  <td className="py-2 pr-4 text-gray-600">
                    {art.authors.map((a) => a.author.name).join(", ") || "—"}
                  </td>
                  <td className="py-2 pr-4 text-gray-600">{art.section?.name || "—"}</td>
                  <td className="py-2 text-right">
                    <button
                      onClick={() => handleDelete(art)}
                      disabled={deleting === art.id}
                      className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
                    >
                      {deleting === art.id ? "Eliminando..." : "Eliminar"}
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
