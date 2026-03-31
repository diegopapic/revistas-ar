"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TiptapEditor from "./TiptapEditor";
import MultiSelect from "./MultiSelect";

type ArticleData = {
  id?: number;
  title: string;
  content: string;
  excerpt: string;
  magazineId: string;
  issueId: string;
  sectionId: string;
  publishedAt: string;
  scannedUrl: string;
  authorIds: number[];
  keywordIds: number[];
};

type Option = { id: number; name: string };
type IssueOption = { id: number; number: number | null; title: string | null };

const empty: ArticleData = {
  title: "",
  content: "",
  excerpt: "",
  magazineId: "",
  issueId: "",
  sectionId: "",
  publishedAt: "",
  scannedUrl: "",
  authorIds: [],
  keywordIds: [],
};

export default function ArticleForm({ initial }: { initial?: ArticleData }) {
  const router = useRouter();
  const isEdit = !!initial?.id;
  const [form, setForm] = useState<ArticleData>(initial ?? empty);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [magazines, setMagazines] = useState<Option[]>([]);
  const [authors, setAuthors] = useState<Option[]>([]);
  const [sections, setSections] = useState<Option[]>([]);
  const [keywords, setKeywords] = useState<Option[]>([]);
  const [issues, setIssues] = useState<IssueOption[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/revistas").then((r) => r.json()),
      fetch("/api/autores").then((r) => r.json()),
      fetch("/api/secciones").then((r) => r.json()),
      fetch("/api/keywords").then((r) => r.json()),
    ]).then(([mags, auths, secs, kws]) => {
      if (Array.isArray(mags)) setMagazines(mags.map((m: Option) => ({ id: m.id, name: m.name })));
      if (Array.isArray(auths)) setAuthors(auths.map((a: Option) => ({ id: a.id, name: a.name })));
      if (Array.isArray(secs)) setSections(secs.map((s: Option) => ({ id: s.id, name: s.name })));
      if (Array.isArray(kws)) setKeywords(kws.map((k: Option) => ({ id: k.id, name: k.name })));
    });
  }, []);

  // Load issues when magazine changes
  useEffect(() => {
    if (!form.magazineId) {
      setIssues([]);
      return;
    }
    fetch(`/api/revistas/${form.magazineId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.issues && Array.isArray(data.issues)) {
          setIssues(data.issues);
        } else {
          setIssues([]);
        }
      })
      .catch(() => setIssues([]));
  }, [form.magazineId]);

  function set(field: keyof ArticleData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const url = isEdit ? `/api/articulos/${initial!.id}` : "/api/articulos";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          content: form.content,
          excerpt: form.excerpt,
          magazineId: form.magazineId ? parseInt(form.magazineId, 10) : null,
          issueId: form.issueId ? parseInt(form.issueId, 10) : null,
          sectionId: form.sectionId ? parseInt(form.sectionId, 10) : null,
          publishedAt: form.publishedAt || null,
          scannedUrl: form.scannedUrl,
          authorIds: form.authorIds,
          keywordIds: form.keywordIds,
        }),
      });

      if (res.ok) {
        router.push("/admin/articulos");
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-3xl">
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Título *</span>
        <input
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          required
          className="border rounded px-3 py-2"
          placeholder="Título del artículo"
        />
      </label>

      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium">Contenido *</span>
        <TiptapEditor
          content={form.content}
          onChange={(html) => setForm((prev) => ({ ...prev, content: html }))}
        />
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Extracto</span>
        <textarea
          value={form.excerpt}
          onChange={(e) => set("excerpt", e.target.value)}
          rows={2}
          className="border rounded px-3 py-2"
          placeholder="Breve resumen del artículo..."
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Revista *</span>
          <select
            value={form.magazineId}
            onChange={(e) => {
              set("magazineId", e.target.value);
              set("issueId", "");
            }}
            required
            className="border rounded px-3 py-2"
          >
            <option value="">Seleccionar...</option>
            {magazines.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Número</span>
          <select
            value={form.issueId}
            onChange={(e) => set("issueId", e.target.value)}
            className="border rounded px-3 py-2"
            disabled={!form.magazineId || issues.length === 0}
          >
            <option value="">Sin número</option>
            {issues.map((i) => (
              <option key={i.id} value={i.id}>
                {i.number ? `#${i.number}` : ""} {i.title || ""}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Sección</span>
        <select
          value={form.sectionId}
          onChange={(e) => set("sectionId", e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">Sin sección</option>
          {sections.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </label>

      <MultiSelect
        label="Autores"
        options={authors}
        selected={form.authorIds}
        onChange={(ids) => setForm((prev) => ({ ...prev, authorIds: ids }))}
      />

      <MultiSelect
        label="Keywords"
        options={keywords}
        selected={form.keywordIds}
        onChange={(ids) => setForm((prev) => ({ ...prev, keywordIds: ids }))}
      />

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Fecha de publicación</span>
          <input
            type="date"
            value={form.publishedAt}
            onChange={(e) => set("publishedAt", e.target.value)}
            className="border rounded px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">URL de escaneo</span>
          <input
            value={form.scannedUrl}
            onChange={(e) => set("scannedUrl", e.target.value)}
            className="border rounded px-3 py-2"
            placeholder="https://..."
          />
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm disabled:opacity-50"
        >
          {saving ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear artículo"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/articulos")}
          className="border px-4 py-2 rounded text-sm hover:bg-gray-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
