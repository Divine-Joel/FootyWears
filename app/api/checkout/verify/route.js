import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "../../../../lib/prisma";
import { verifyToken } from "../../../../lib/auth";

export async function POST(request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded = token ? verifyToken(token) : null;

  if (!decoded) {
    return NextResponse.json(
      { error: "You must be logged in." },
      { status: 401 },
    );
  }

  const { reference } = await request.json();
  if (!reference) {
    return NextResponse.json(
      { error: "Missing payment reference." },
      { status: 400 },
    );
  }

  // If this payment already created an order, just return it (safe against double calls)
  const existing = await prisma.order.findUnique({
    where: { paystackRef: reference },
  });
  if (existing) {
    if (existing.userId !== decoded.id) {
      return NextResponse.json(
        { error: "Invalid payment reference." },
        { status: 409 },
      );
    }
    return NextResponse.json(existing);
  }

  // Ask Paystack directly whether this payment really succeeded
  const res = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } },
  );
  const data = await res.json();

  if (!res.ok || !data.status || data.data.status !== "success") {
    return NextResponse.json(
      { error: "Payment was not successful." },
      { status: 400 },
    );
  }

  if (
    data.data.customer?.email?.toLowerCase() !== decoded.email.toLowerCase()
  ) {
    return NextResponse.json(
      { error: "Payment does not belong to this account." },
      { status: 403 },
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

  // The amount Paystack actually charged must match the cart
  if (data.data.amount !== total * 100) {
    return NextResponse.json(
      { error: "Payment amount does not match your cart." },
      { status: 400 },
    );
  }

  const [order] = await prisma.$transaction([
    prisma.order.create({
      data: {
        userId: decoded.id,
        total,
        paystackRef: reference,
        status: "Paid",
        items: {
          create: cartItems.map((item) => ({
            name: item.name,
            image: item.image,
            price: item.price,
            quantity: item.quantity,
            size: item.size || null,
            color: item.color || null,
          })),
        },
      },
      include: { items: true },
    }),
    prisma.cartItem.deleteMany({ where: { userId: decoded.id } }),
  ]);

  return NextResponse.json(order);
}
