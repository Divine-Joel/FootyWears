import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "../../../lib/prisma";
import { verifyToken } from "../../../lib/auth";

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function GET() {
  const decoded = await getUser();
  if (!decoded)
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const items = await prisma.savedItem.findMany({
    where: { userId: decoded.id },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(items);
}

export async function POST(request) {
  const decoded = await getUser();
  if (!decoded)
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const { product, brand, category } = await request.json();

  const existing = await prisma.savedItem.findFirst({
    where: { userId: decoded.id, productId: product.id, brand, category },
  });

  if (existing) {
    await prisma.savedItem.delete({ where: { id: existing.id } });
    return NextResponse.json({ saved: false });
  }

  await prisma.savedItem.create({
    data: {
      userId: decoded.id,
      productId: product.id,
      brand,
      category,
      name: product.name,
      image: product.image,
      price: product.price,
    },
  });
  return NextResponse.json({ saved: true });
}
