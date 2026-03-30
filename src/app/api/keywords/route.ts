import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import slugify from "slugify";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const keywords = await getDb().keyword.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { articles: true } } },
    });
    return NextResponse.json(keywords);
  } catch (e) {
    const err = e as Error & { code?: string; meta?: unknown };
    console.error("GET /api/keywords error:", err);
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

    const existing = await getDb().keyword.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Ya existe un keyword con ese nombre" }, { status: 409 });
    }

    const keyword = await getDb().keyword.create({
      data: { name: name.trim(), slug },
    });

    return NextResponse.json(keyword, { status: 201 });
  } catch (e) {
    const err = e as Error & { code?: string; meta?: unknown };
    console.error("POST /api/keywords error:", err);
    return NextResponse.json(
      { error: err.message, code: err.code, meta: err.meta },
      { status: 500 },
    );
  }
}
