"use client";

import { use } from "react";

export default function EditarAutorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <main>
      <h1>Editar Autor #{id}</h1>
    </main>
  );
}
