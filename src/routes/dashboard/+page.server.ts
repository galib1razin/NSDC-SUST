import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types'; // Import generated types
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const load: PageServerLoad = async ({ cookies }) => {
  const token = cookies.get('token');
  if (!token) throw redirect(302, '/signin');

  try {
    jwt.verify(token, JWT_SECRET);
  } catch (e) {
    throw redirect(302, '/signin');
  }

  return {};
};