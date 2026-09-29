import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "../../../lib/prisma";
import { verifyToken } from "../../../lib/auth";

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  return token ? verifyToken(token) : null;
}

export async function GET() {
  const decoded = await getUser();
  if (!decoded) {
    return NextResponse.json(
      { error: "You must be logged in." },
      { status: 401 },
    );
  }

  const orders = await prisma.order.findMany({
    where: { userId: decoded.id, hidden: false },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}

export async function DELETE() {
  const decoded = await getUser();
  if (!decoded) {
    return NextResponse.json(
      { error: "You must be logged in." },
      { status: 401 },
    );
  }

  await prisma.order.updateMany({
    where: { userId: decoded.id },
    data: { hidden: true },
  });

  return NextResponse.json({ success: true });
}
