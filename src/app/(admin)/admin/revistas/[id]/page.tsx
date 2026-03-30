"use client";

import { use, useEffect, useState } from "react";
import MagazineForm from "../_components/MagazineForm";

type MagazineData = {
  id: number;
  name: string;
  description: string;
  editorial: string;
  logoUrl: string;
  foundedYear: string;
  country: string;
};

export default function EditarRevistaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [magazine, setMagazine] = useState<MagazineData | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/revistas/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((data) =>
        setMagazine({
          id: data.id,
          name: data.name ?? "",
          description: data.description ?? "",
          editorial: data.editorial ?? "",
          logoUrl: data.logoUrl ?? "",
          foundedYear: data.foundedYear?.toString() ?? "",
          country: data.country ?? "",
        }),
      )
      .catch(() => setNotFound(true));
  }, [id]);

  if (notFound) {
    return (
      <main className="p-6 max-w-5xl mx-auto">
        <p className="text-red-500">Revista no encontrada.</p>
      </main>
    );
  }

  if (!magazine) {
    return (
      <main className="p-6 max-w-5xl mx-auto">
        <p className="text-gray-500">Cargando...</p>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Editar Revista</h1>
      <MagazineForm initial={magazine} />
    </main>
  );
}
