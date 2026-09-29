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

  const items = await prisma.cartItem.findMany({
    where: { userId: decoded.id },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(items);
}

export async function POST(request) {
  const decoded = await getUser();
  if (!decoded)
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const {
    product,
    brand,
    category,
    size = "",
    color = "",
    quantity = 1,
  } = await request.json();

  const existing = await prisma.cartItem.findFirst({
    where: {
      userId: decoded.id,
      productId: product.id,
      brand,
      category,
      size,
      color,
    },
  });

  let item;
  if (existing) {
    item = await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity },
    });
  } else {
    item = await prisma.cartItem.create({
      data: {
        userId: decoded.id,
        productId: product.id,
        brand,
        category,
        name: product.name,
        image: product.image,
        price: product.price,
        size,
        color,
        quantity,
      },
    });
  }

  return NextResponse.json(item);
}

export async function PATCH(request) {
  const decoded = await getUser();
  if (!decoded)
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const { id, quantity } = await request.json();
  const item = await prisma.cartItem.update({
    where: { id },
    data: { quantity: Math.max(1, quantity) },
  });
  return NextResponse.json(item);
}

export async function DELETE(request) {
  const decoded = await getUser();
  if (!decoded)
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const body = await request.json();
  if (body.all) {
    await prisma.cartItem.deleteMany({ where: { userId: decoded.id } });
  } else {
    await prisma.cartItem.delete({ where: { id: body.id } });
  }
  return NextResponse.json({ success: true });
}
