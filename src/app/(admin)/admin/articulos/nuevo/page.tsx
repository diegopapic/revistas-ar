"use client";

import Link from "next/link";
import ArticleForm from "../_components/ArticleForm";

export default function NuevoArticuloPage() {
  return (
    <main className="p-6 max-w-5xl mx-auto">
      <Link
        href="/admin/articulos"
        className="text-sm text-gray-500 hover:text-gray-800 mb-4 inline-block"
      >
        ← Volver a artículos
      </Link>
      <h1 className="text-2xl font-bold mb-6">Nuevo Artículo</h1>
      <ArticleForm />
    </main>
  );
}
