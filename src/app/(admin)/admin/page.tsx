"use client";

import Link from "next/link";

const sections = [
  {
    title: "Revistas",
    description: "Administrar revistas: nombre, editorial, año de fundación, logo.",
    href: "/admin/revistas",
  },
  {
    title: "Autores",
    description: "Administrar autores: biografía, foto, fechas de nacimiento y muerte.",
    href: "/admin/autores",
  },
  {
    title: "Artículos",
    description: "Administrar artículos: contenido, autores, secciones, keywords.",
    href: "/admin/articulos",
  },
  {
    title: "Secciones",
    description: "Gestionar las secciones en las que se organizan los artículos.",
    href: "/admin/secciones",
  },
  {
    title: "Keywords",
    description: "Gestionar las etiquetas de los artículos.",
    href: "/admin/keywords",
  },
];

export default function AdminDashboard() {
  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Panel de administración</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="border rounded-lg p-5 hover:bg-gray-50 transition-colors"
          >
            <h2 className="font-semibold text-lg mb-1">{s.title}</h2>
            <p className="text-sm text-gray-600">{s.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
