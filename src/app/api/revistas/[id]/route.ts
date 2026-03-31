import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import slugify from "slugify";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const magazine = await getDb().magazine.findUnique({
    where: { id: parseInt(id, 10) },
    include: {
      _count: { select: { articles: true, issues: true } },
      issues: { orderBy: { number: "asc" }, select: { id: true, number: true, title: true } },
    },
  });
  if (!magazine) return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  return NextResponse.json(magazine);
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const body = await req.json();
  const { name, description, editorial, logoUrl, foundedYear, country } = body;

  if (!name?.trim()) {
    return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });
  }

  const slug = slugify(name, { lower: true, strict: true });

  const existing = await getDb().magazine.findFirst({
    where: { slug, NOT: { id: parseInt(id, 10) } },
  });
  if (existing) {
    return NextResponse.json({ error: "Ya existe otra revista con ese nombre" }, { status: 409 });
  }

  const magazine = await getDb().magazine.update({
    where: { id: parseInt(id, 10) },
    data: {
      name: name.trim(),
      slug,
      description: description?.trim() || null,
      editorial: editorial?.trim() || null,
      logoUrl: logoUrl?.trim() || null,
      foundedYear: foundedYear ? parseInt(foundedYear, 10) : null,
      country: country?.trim() || null,
    },
  });

  return NextResponse.json(magazine);
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const magazineId = parseInt(id, 10);

  const articleCount = await getDb().article.count({ where: { magazineId } });
  if (articleCount > 0) {
    return NextResponse.json(
      { error: `No se puede eliminar: tiene ${articleCount} artículo(s) asociado(s)` },
      { status: 409 },
    );
  }

  const issueCount = await getDb().issue.count({ where: { magazineId } });
  if (issueCount > 0) {
    return NextResponse.json(
      { error: `No se puede eliminar: tiene ${issueCount} número(s) asociado(s)` },
      { status: 409 },
    );
  }

  await getDb().magazine.delete({ where: { id: magazineId } });
  return NextResponse.json({ ok: true });
}
