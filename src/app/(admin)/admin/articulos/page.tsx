"use client";

import Link from "next/link";

export default function AdminArticulosPage() {
  return (
    <main className="p-6 max-w-5xl mx-auto">
      <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-800 mb-4 inline-block">
        ← Volver al panel
      </Link>
      <h1 className="text-2xl font-bold mb-6">Artículos</h1>
      <p className="text-gray-500">Próximamente.</p>
    </main>
  );
}
