import { json, error } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Type guard to check if error has status and message
function isErrorWithStatus(err: unknown): err is { status: number; message: string } {
  return typeof err === 'object' && err !== null && 'status' in err && 'message' in err;
}

export async function POST({ request, cookies }) {
  const { email, password, action } = await request.json();

  if (action === 'login') {
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw error(401, 'User not found');
      }
      if (!user.approved) {
        throw error(401, 'Account not approved yet');
      }
      if (!(await bcrypt.compare(password, user.password))) {
        throw error(401, 'Invalid password');
      }

      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
      cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Allow non-secure in dev
        path: '/',
        maxAge: 60 * 60, // 1 hour
      });
      console.log('Token set:', token); // Debug output
      return json({
        success: true,
        redirect: user.role === 'SUPERVISOR' ? '/supervisor' : user.role === 'ADMIN' ? '/admin' : '/dashboard',
      });
    } catch (err) {
      console.error('Login error:', err);
      if (isErrorWithStatus(err)) {
        throw error(err.status, err.message);
      }
      throw error(500, 'Login failed'); // Fallback for unexpected errors
    }
  }

  if (action === 'register') {
    try {
      const { name, regNo, session, dept, whatsapp, phone, facebook, linkedin, whyJoin, password: rawPassword } = await request.json();
      const hashedPassword = await bcrypt.hash(rawPassword, 10);
      const user = await prisma.user.create({
        data: { name, email, password: hashedPassword, role: 'MEMBER', approved: false },
      });
      return json({ success: true, message: 'Registration submitted for approval' });
    } catch (err) {
      console.error('Register error:', err);
      if (isErrorWithStatus(err)) {
        throw error(err.status, err.message);
      }
      throw error(400, 'Registration failed'); // Fallback
    }
  }

  throw error(400, 'Invalid action');
}