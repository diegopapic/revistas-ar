"use client";

import { use, useEffect, useState } from "react";
import AuthorForm from "../_components/AuthorForm";

type AuthorData = {
  id: number;
  name: string;
  bio: string;
  photoUrl: string;
  birthDate: string;
  birthPlace: string;
  deathDate: string;
  deathPlace: string;
};

function toDateInput(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toISOString().split("T")[0];
}

export default function EditarAutorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [author, setAuthor] = useState<AuthorData | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/autores/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((data) =>
        setAuthor({
          id: data.id,
          name: data.name ?? "",
          bio: data.bio ?? "",
          photoUrl: data.photoUrl ?? "",
          birthDate: toDateInput(data.birthDate),
          birthPlace: data.birthPlace ?? "",
          deathDate: toDateInput(data.deathDate),
          deathPlace: data.deathPlace ?? "",
        }),
      )
      .catch(() => setNotFound(true));
  }, [id]);

  if (notFound) {
    return (
      <main className="p-6 max-w-5xl mx-auto">
        <p className="text-red-500">Autor no encontrado.</p>
      </main>
    );
  }

  if (!author) {
    return (
      <main className="p-6 max-w-5xl mx-auto">
        <p className="text-gray-500">Cargando...</p>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Editar Autor</h1>
      <AuthorForm initial={author} />
    </main>
  );
}
