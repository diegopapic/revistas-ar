"use client";

import AuthorForm from "../_components/AuthorForm";

export default function NuevoAutorPage() {
  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Nuevo Autor</h1>
      <AuthorForm />
    </main>
  );
}
