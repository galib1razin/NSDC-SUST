import { json, error } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET({ cookies }) {
  const token = cookies.get('token');
  if (!token) throw error(401, 'Unauthorized');
  const user = jwt.verify(token, JWT_SECRET) as { id: number; role: string };

  const notifications = await prisma.notification.findMany({
    where: { recipients: { some: { id: user.id } } },
    orderBy: { createdAt: 'desc' },
  });
  return json(notifications);
}

export async function POST({ request, cookies }) {
  const token = cookies.get('token');
  if (!token) throw error(401, 'Unauthorized');
  const user = jwt.verify(token, JWT_SECRET) as { id: number; role: string };
  if (user.role !== 'ADMIN' && user.role !== 'SUPERVISOR') throw error(403, 'Forbidden');

  const { title, message, recipientIds } = await request.json();
  const notification = await prisma.notification.create({
    data: {
      title,
      message,
      recipients: { connect: recipientIds.map((id: number) => ({ id })) },
    },
  });
  return json({ success: true, notification });
}