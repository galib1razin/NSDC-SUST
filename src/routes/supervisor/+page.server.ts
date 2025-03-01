import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const load: PageServerLoad = async ({ cookies }) => {
  const token = cookies.get('token');
  if (!token) throw redirect(302, '/signin');

  const user = jwt.verify(token, JWT_SECRET) as { id: number; role: string };
  if (user.role !== 'SUPERVISOR') throw error(403, 'Forbidden');

  return {};
};