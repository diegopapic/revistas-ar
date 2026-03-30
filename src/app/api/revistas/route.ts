import { NextRequest, NextResponse } from "next/server";
import { prisma as db } from "@/lib/db";
import slugify from "slugify";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const magazines = await db.magazine.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { articles: true, issues: true } } },
    });
    return NextResponse.json(magazines);
  } catch (e) {
    console.error("GET /api/revistas error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
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

    const existing = await db.magazine.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Ya existe una revista con ese nombre" }, { status: 409 });
    }

    const magazine = await db.magazine.create({
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
    console.error("POST /api/revistas error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
