"use client";

import { use } from "react";

export default function EditarRevistaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <main>
      <h1>Editar Revista #{id}</h1>
    </main>
  );
}
