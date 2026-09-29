import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "../../../lib/prisma";

export async function POST(request) {
  const { token, password } = await request.json();

  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: { gt: new Date() },
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: "This reset link is invalid or has expired." },
      { status: 400 },
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  return NextResponse.json({ success: true });
}
