import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
    include: { organizationMember: true },
  });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  // Check if user is a teacher
  const isTeacher = user.organizationMember.some((m) => m.role === 'TEACHER');
  if (!isTeacher) return res.status(403).json({ error: 'Not a teacher account' });

  // Check password
  const valid = await bcrypt.compare(password, user.password || '');
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  // Return basic user info (do not return password)
  return res.status(200).json({ id: user.id, name: user.name, email: user.email });
}
