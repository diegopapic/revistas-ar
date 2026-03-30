import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import slugify from "slugify";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const author = await getDb().author.findUnique({
    where: { id: parseInt(id, 10) },
    include: { _count: { select: { articles: true } } },
  });
  if (!author) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(author);
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const body = await req.json();
  const { name, bio, photoUrl, birthDate, birthPlace, deathDate, deathPlace } = body;

  if (!name?.trim()) {
    return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });
  }

  const slug = slugify(name, { lower: true, strict: true });

  const existing = await getDb().author.findFirst({
    where: { slug, NOT: { id: parseInt(id, 10) } },
  });
  if (existing) {
    return NextResponse.json({ error: "Ya existe otro autor con ese nombre" }, { status: 409 });
  }

  const author = await getDb().author.update({
    where: { id: parseInt(id, 10) },
    data: {
      name: name.trim(),
      slug,
      bio: bio?.trim() || null,
      photoUrl: photoUrl?.trim() || null,
      birthDate: birthDate ? new Date(birthDate) : null,
      birthPlace: birthPlace?.trim() || null,
      deathDate: deathDate ? new Date(deathDate) : null,
      deathPlace: deathPlace?.trim() || null,
    },
  });

  return NextResponse.json(author);
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const authorId = parseInt(id, 10);

  const articleCount = await getDb().articleAuthor.count({ where: { authorId } });
  if (articleCount > 0) {
    return NextResponse.json(
      { error: `No se puede eliminar: tiene ${articleCount} artículo(s) asociado(s)` },
      { status: 409 },
    );
  }

  await getDb().author.delete({ where: { id: authorId } });
  return NextResponse.json({ ok: true });
}
