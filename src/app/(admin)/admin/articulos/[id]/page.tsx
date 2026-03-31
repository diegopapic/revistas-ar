"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import ArticleForm from "../_components/ArticleForm";

type ArticleData = {
  id: number;
  title: string;
  content: string;
  excerpt: string | null;
  magazineId: number;
  issueId: number | null;
  sectionId: number | null;
  publishedAt: string | null;
  scannedUrl: string | null;
  authors: { author: { id: number } }[];
  keywords: { keyword: { id: number } }[];
};

function toDateInput(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toISOString().split("T")[0];
}

export default function EditarArticuloPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/articulos/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((data: ArticleData) => setArticle(data))
      .catch(() => setNotFound(true));
  }, [id]);

  if (notFound) {
    return (
      <main className="p-6 max-w-5xl mx-auto">
        <p className="text-red-500">Artículo no encontrado.</p>
      </main>
    );
  }

  if (!article) {
    return (
      <main className="p-6 max-w-5xl mx-auto">
        <p className="text-gray-500">Cargando...</p>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <Link
        href="/admin/articulos"
        className="text-sm text-gray-500 hover:text-gray-800 mb-4 inline-block"
      >
        ← Volver a artículos
      </Link>
      <h1 className="text-2xl font-bold mb-6">Editar Artículo</h1>
      <ArticleForm
        initial={{
          id: article.id,
          title: article.title,
          content: article.content,
          excerpt: article.excerpt ?? "",
          magazineId: String(article.magazineId),
          issueId: article.issueId ? String(article.issueId) : "",
          sectionId: article.sectionId ? String(article.sectionId) : "",
          publishedAt: toDateInput(article.publishedAt),
          scannedUrl: article.scannedUrl ?? "",
          authorIds: article.authors.map((a) => a.author.id),
          keywordIds: article.keywords.map((k) => k.keyword.id),
        }}
      />
    </main>
  );
}
