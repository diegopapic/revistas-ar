import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import slugify from "slugify";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const body = await req.json();
  const { name } = body;

  if (!name?.trim()) {
    return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });
  }

  const slug = slugify(name, { lower: true, strict: true });

  const existing = await getDb().keyword.findFirst({
    where: { slug, NOT: { id: parseInt(id, 10) } },
  });
  if (existing) {
    return NextResponse.json({ error: "Ya existe otro keyword con ese nombre" }, { status: 409 });
  }

  const keyword = await getDb().keyword.update({
    where: { id: parseInt(id, 10) },
    data: { name: name.trim(), slug },
  });

  return NextResponse.json(keyword);
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const keywordId = parseInt(id, 10);

  const articleCount = await getDb().articleKeyword.count({ where: { keywordId } });
  if (articleCount > 0) {
    return NextResponse.json(
      { error: `No se puede eliminar: tiene ${articleCount} artículo(s) asociado(s)` },
      { status: 409 },
    );
  }

  await getDb().keyword.delete({ where: { id: keywordId } });
  return NextResponse.json({ ok: true });
}
