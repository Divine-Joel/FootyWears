import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "../../../../lib/prisma";
import { verifyToken } from "../../../../lib/auth";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded = token ? verifyToken(token) : null;

  if (!decoded) {
    return NextResponse.json(
      { error: "You must be logged in." },
      { status: 401 },
    );
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: decoded.id },
  });

  if (cartItems.length === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  console.log("Key check:", process.env.PAYSTACK_SECRET_KEY?.slice(0, 8));
  const res = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: decoded.email,
      amount: total * 100, // Paystack wants the smallest unit (kobo)
      currency: "NGN",
    }),
  });

  const data = await res.json();

  if (!res.ok || !data.status) {
    return NextResponse.json(
      { error: data.message || "Could not start payment." },
      { status: 502 },
    );
  }

  return NextResponse.json({
    access_code: data.data.access_code,
    reference: data.data.reference,
  });
}
