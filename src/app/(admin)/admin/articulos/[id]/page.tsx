"use client";

import { use } from "react";

export default function EditarArticuloPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <main>
      <h1>Editar Artículo #{id}</h1>
    </main>
  );
}
