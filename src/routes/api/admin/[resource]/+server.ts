import { json, error } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET({ params, cookies }) {
  const token = cookies.get('token');
  if (!token) throw error(401, 'Unauthorized');
  const user = jwt.verify(token, JWT_SECRET) as { id: number; role: string };
  if (user.role !== 'ADMIN' && user.role !== 'SUPERVISOR') throw error(403, 'Forbidden');

  if (params.resource === 'users/pending') {
    const users = await prisma.user.findMany({ where: { approved: false } });
    return json(users);
  }
  if (params.resource === 'blogs/pending') {
    const blogs = await prisma.blog.findMany({ where: { approved: false } });
    return json(blogs);
  }
  if (params.resource === 'users') {
    const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true } });
    return json(users);
  }
  throw error(404, 'Resource not found');
}

export async function POST({ params, request, cookies }) {
  const token = cookies.get('token');
  if (!token) throw error(401, 'Unauthorized');
  const user = jwt.verify(token, JWT_SECRET) as { id: number; role: string };
  if (user.role !== 'ADMIN' && user.role !== 'SUPERVISOR') throw error(403, 'Forbidden');

  if (params.resource === 'users/approve') {
    const { id } = await request.json();
    await prisma.user.update({ where: { id }, data: { approved: true } });
    return json({ success: true });
  }
  if (params.resource === 'blogs/approve') {
    const { id } = await request.json();
    await prisma.blog.update({ where: { id }, data: { approved: true } });
    return json({ success: true });
  }
  if (params.resource === 'users/add') {
    const { name, email, password, role } = await request.json();
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: { name, email, password: hashedPassword, role, approved: true },
    });
    return json({ success: true });
  }
  throw error(404, 'Resource not found');
}