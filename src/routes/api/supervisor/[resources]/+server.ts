import { json, error } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET({ params, cookies }) {
  const token = cookies.get('token');
  if (!token) throw error(401, 'Unauthorized');
  const user = jwt.verify(token, JWT_SECRET) as { id: number; role: string };
  if (user.role !== 'SUPERVISOR') throw error(403, 'Forbidden');

  if (params.resources === 'admins') {
    const admins = await prisma.user.findMany({
      where: { role: { in: ['ADMIN', 'SUPERVISOR'] } },
      select: { id: true, name: true, email: true, role: true },
    });
    return json(admins);
  }
  throw error(404, 'Resource not found');
}

export async function POST({ params, request, cookies }) {
  const token = cookies.get('token');
  if (!token) throw error(401, 'Unauthorized');
  const user = jwt.verify(token, JWT_SECRET) as { id: number; role: string };
  if (user.role !== 'SUPERVISOR') throw error(403, 'Forbidden');

  const { id } = await request.json();
  if (params.resources === 'admins/promote') {
    await prisma.user.update({ where: { id }, data: { role: 'SUPERVISOR' } });
    return json({ success: true });
  }
  if (params.resources === 'admins/demote') {
    await prisma.user.update({ where: { id }, data: { role: 'ADMIN' } });
    return json({ success: true });
  }
  throw error(404, 'Resource not found');
}