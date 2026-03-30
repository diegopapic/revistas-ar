import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import slugify from "slugify";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const sections = await getDb().section.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { articles: true } } },
    });
    return NextResponse.json(sections);
  } catch (e) {
    const err = e as Error & { code?: string; meta?: unknown };
    console.error("GET /api/secciones error:", err);
    return NextResponse.json(
      { error: err.message, code: err.code, meta: err.meta },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });
    }

    const slug = slugify(name, { lower: true, strict: true });

    const existing = await getDb().section.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Ya existe una sección con ese nombre" }, { status: 409 });
    }

    const section = await getDb().section.create({
      data: { name: name.trim(), slug },
    });

    return NextResponse.json(section, { status: 201 });
  } catch (e) {
    const err = e as Error & { code?: string; meta?: unknown };
    console.error("POST /api/secciones error:", err);
    return NextResponse.json(
      { error: err.message, code: err.code, meta: err.meta },
      { status: 500 },
    );
  }
}
