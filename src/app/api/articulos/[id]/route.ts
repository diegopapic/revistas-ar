import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import slugify from "slugify";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const article = await getDb().article.findUnique({
    where: { id: parseInt(id, 10) },
    include: {
      magazine: { select: { id: true, name: true } },
      issue: { select: { id: true, number: true, title: true } },
      section: { select: { id: true, name: true } },
      authors: { include: { author: { select: { id: true, name: true } } } },
      keywords: { include: { keyword: { select: { id: true, name: true } } } },
    },
  });
  if (!article) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(article);
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const articleId = parseInt(id, 10);
  const body = await req.json();
  const {
    title,
    content,
    excerpt,
    magazineId,
    issueId,
    sectionId,
    publishedAt,
    scannedUrl,
    authorIds,
    keywordIds,
  } = body;

  if (!title?.trim()) {
    return NextResponse.json({ error: "El título es obligatorio" }, { status: 400 });
  }
  if (!content?.trim()) {
    return NextResponse.json({ error: "El contenido es obligatorio" }, { status: 400 });
  }
  if (!magazineId) {
    return NextResponse.json({ error: "La revista es obligatoria" }, { status: 400 });
  }

  const slug = slugify(title, { lower: true, strict: true });

  const existing = await getDb().article.findFirst({
    where: { slug, NOT: { id: articleId } },
  });
  if (existing) {
    return NextResponse.json({ error: "Ya existe otro artículo con ese título" }, { status: 409 });
  }

  // Delete existing relations and recreate
  await getDb().articleAuthor.deleteMany({ where: { articleId } });
  await getDb().articleKeyword.deleteMany({ where: { articleId } });

  const article = await getDb().article.update({
    where: { id: articleId },
    data: {
      title: title.trim(),
      slug,
      content: content.trim(),
      excerpt: excerpt?.trim() || null,
      magazineId: parseInt(magazineId, 10),
      issueId: issueId ? parseInt(issueId, 10) : null,
      sectionId: sectionId ? parseInt(sectionId, 10) : null,
      publishedAt: publishedAt ? new Date(publishedAt) : null,
      scannedUrl: scannedUrl?.trim() || null,
      authors: {
        create: (authorIds ?? []).map((id: number) => ({ authorId: id })),
      },
      keywords: {
        create: (keywordIds ?? []).map((id: number) => ({ keywordId: id })),
      },
    },
  });

  return NextResponse.json(article);
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const articleId = parseInt(id, 10);

  // Delete relations first
  await getDb().articleAuthor.deleteMany({ where: { articleId } });
  await getDb().articleKeyword.deleteMany({ where: { articleId } });
  await getDb().article.delete({ where: { id: articleId } });

  return NextResponse.json({ ok: true });
}
