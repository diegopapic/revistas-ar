import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma as db } from "@/lib/db";
import slugify from "slugify";

export const dynamic = "force-dynamic";

export async function GET() {
  const magazines = await db.magazine.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { articles: true, issues: true } } },
  });
  return NextResponse.json(magazines);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

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
}
