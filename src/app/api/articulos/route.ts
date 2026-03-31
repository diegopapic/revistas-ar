import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import slugify from "slugify";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const magazineId = url.searchParams.get("magazineId");
    const authorId = url.searchParams.get("authorId");
    const sectionId = url.searchParams.get("sectionId");

    const where: Record<string, unknown> = {};
    if (magazineId) where.magazineId = parseInt(magazineId, 10);
    if (sectionId) where.sectionId = parseInt(sectionId, 10);
    if (authorId) {
      where.authors = { some: { authorId: parseInt(authorId, 10) } };
    }

    const articles = await getDb().article.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        magazine: { select: { id: true, name: true } },
        section: { select: { id: true, name: true } },
        authors: { include: { author: { select: { id: true, name: true } } } },
        keywords: { include: { keyword: { select: { id: true, name: true } } } },
      },
    });
    return NextResponse.json(articles);
  } catch (e) {
    const err = e as Error & { code?: string; meta?: unknown };
    console.error("GET /api/articulos error:", err);
    return NextResponse.json(
      { error: err.message, code: err.code, meta: err.meta },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
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

    const existing = await getDb().article.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Ya existe un artículo con ese título" }, { status: 409 });
    }

    const article = await getDb().article.create({
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

    return NextResponse.json(article, { status: 201 });
  } catch (e) {
    const err = e as Error & { code?: string; meta?: unknown };
    console.error("POST /api/articulos error:", err);
    return NextResponse.json(
      { error: err.message, code: err.code, meta: err.meta },
      { status: 500 },
    );
  }
}
