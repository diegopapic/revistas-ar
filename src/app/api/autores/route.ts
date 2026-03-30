import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import slugify from "slugify";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const authors = await getDb().author.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { articles: true } } },
    });
    return NextResponse.json(authors);
  } catch (e) {
    const err = e as Error & { code?: string; meta?: unknown };
    console.error("GET /api/autores error:", err);
    return NextResponse.json(
      { error: err.message, code: err.code, meta: err.meta },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, bio, photoUrl, birthDate, birthPlace, deathDate, deathPlace } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });
    }

    const slug = slugify(name, { lower: true, strict: true });

    const existing = await getDb().author.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Ya existe un autor con ese nombre" }, { status: 409 });
    }

    const author = await getDb().author.create({
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

    return NextResponse.json(author, { status: 201 });
  } catch (e) {
    const err = e as Error & { code?: string; meta?: unknown };
    console.error("POST /api/autores error:", err);
    return NextResponse.json(
      { error: err.message, code: err.code, meta: err.meta },
      { status: 500 },
    );
  }
}
