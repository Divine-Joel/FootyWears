import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "../../../lib/prisma";
import { verifyToken, createToken } from "../../../lib/auth";

export async function PATCH(request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded = token ? verifyToken(token) : null;

  if (!decoded) {
    return NextResponse.json(
      { error: "You must be logged in." },
      { status: 401 },
    );
  }

  const { name, email, currentPassword, newPassword } = await request.json();

  const user = await prisma.user.findUnique({ where: { id: decoded.id } });
  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const passwordMatches = await bcrypt.compare(currentPassword, user.password);
  if (!passwordMatches) {
    return NextResponse.json(
      { error: "Current password is incorrect." },
      { status: 401 },
    );
  }

  if (email !== user.email) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "That email is already in use." },
        { status: 409 },
      );
    }
  }

  const updateData = { name, email };

  if (newPassword) {
    updateData.password = await bcrypt.hash(newPassword, 10);
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: updateData,
  });

  const newToken = createToken(updatedUser);

  const response = NextResponse.json({
    id: updatedUser.id,
    name: updatedUser.name,
    email: updatedUser.email,
  });
  response.cookies.set("token", newToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return response;
}
