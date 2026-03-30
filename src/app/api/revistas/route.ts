import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import slugify from "slugify";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const magazines = await getDb().magazine.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { articles: true, issues: true } } },
    });
    return NextResponse.json(magazines);
  } catch (e) {
    const err = e as Error & { code?: string; meta?: unknown };
    console.error("GET /api/revistas error:", err);
    return NextResponse.json(
      { error: err.message, code: err.code, meta: err.meta },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, editorial, logoUrl, foundedYear, country } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });
    }

    const slug = slugify(name, { lower: true, strict: true });

    const existing = await getDb().magazine.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Ya existe una revista con ese nombre" }, { status: 409 });
    }

    const magazine = await getDb().magazine.create({
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

    return NextResponse.json(magazine, { status: 201 });
  } catch (e) {
    const err = e as Error & { code?: string; meta?: unknown };
    console.error("POST /api/revistas error:", err);
    return NextResponse.json(
      { error: err.message, code: err.code, meta: err.meta },
      { status: 500 },
    );
  }
}
