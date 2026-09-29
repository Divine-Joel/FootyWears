import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { createToken } from "../../../lib/auth";

export async function POST(request) {
  const { name, email, password } = await request.json();

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "All fields are required." },
      { status: 400 },
    );
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json(
      { error: "An account with this email already exists." },
      { status: 409 },
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  const token = createToken(user);

  const response = NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
  });
  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days, in seconds
    path: "/",
  });

  return response;
}
