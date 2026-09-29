import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export function createToken(user, expiresIn = "7d") {
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    JWT_SECRET,
    { expiresIn },
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}
