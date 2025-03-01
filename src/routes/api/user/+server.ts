import { json, error } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET({ cookies }) {
  const token = cookies.get('token');
  if (!token) throw error(401, 'Unauthorized');

  const decoded = jwt.verify(token, JWT_SECRET) as { id: number; role: string };
  const user = await prisma.user.findUnique({ where: { id: decoded.id }, select: { id: true, name: true, email: true, role: true } });
  if (!user) throw error(404, 'User not found');

  return json(user);
}