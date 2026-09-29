import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { createToken } from "../../../lib/auth";

export async function POST(request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 },
    );
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 },
    );
  }

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
    path: "/",
    // no maxAge set on purpose — this makes it a session cookie,
    // which the browser clears automatically once it's fully closed
  });

  return response;
}
