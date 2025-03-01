import { json, error } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import { put } from '@vercel/blob';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST({ request, cookies }) {
  const token = cookies.get('token');
  if (!token) throw error(401, 'Unauthorized');

  const user = jwt.verify(token, JWT_SECRET) as { id: number; role: string };
  const formData = await request.formData();
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const image = formData.get('image') as File;

  let imageUrl: string | undefined;
  if (image) {
    const { url } = await put(image.name, image, { access: 'public' });
    imageUrl = url;
  }

  const blog = await prisma.blog.create({
    data: {
      title,
      content,
      image: imageUrl,
      authorId: user.id,
      approved: user.role === 'ADMIN' || user.role === 'SUPERVISOR',
    },
  });

  return json({ success: true, blog });
}

export async function GET() {
  const blogs = await prisma.blog.findMany({
    where: { approved: true, visible: true },
    include: { author: { select: { name: true } } },
  });
  return json(blogs);
}
