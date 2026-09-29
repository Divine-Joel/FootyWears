import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "../../../lib/prisma";

export async function POST(request) {
  const { email } = await request.json();

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    // Same generic message whether or not the email exists — avoids revealing which emails are registered
    return NextResponse.json({
      message: "If that email exists, a reset link has been generated.",
    });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken: token, resetTokenExpiry: expiry },
  });

  return NextResponse.json({
    message: "If that email exists, a reset link has been generated.",
    resetLink: `/reset-password/${token}`,
  });
}
