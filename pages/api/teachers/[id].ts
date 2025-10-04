import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcryptjs/umd/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (typeof id !== 'string') return res.status(400).json({ error: 'Invalid id' });

  switch (req.method) {
    case 'GET':
      // Get teacher by id
      // Get teacher by id, ensure they are a teacher via OrganizationMember
      const teacher = await prisma.user.findUnique({
        where: { id },
        include: {
          organizationMember: true,
        },
      });
      const isTeacher = teacher?.organizationMember?.some((m) => m.role === 'TEACHER');
      if (!teacher || !isTeacher) return res.status(404).json({ error: 'Teacher not found' });
      return res.status(200).json(teacher);
    case 'PUT':
      // Update teacher
      const { name, email, password } = req.body;
      let updateData: any = { name, email };
      if (password && password.trim() !== '') {
        const encrypted_password = await import('bcryptjs').then(bcrypt => bcrypt.hash(password, 10));
        updateData.password = encrypted_password;
      }
      try {
        const updated = await prisma.user.update({
          where: { id },
          data: updateData,
        });
        return res.status(200).json(updated);
      } catch (error) {
        return res.status(500).json({ error: 'Failed to update teacher' });
      }
   
    case 'DELETE':
      // Delete teacher
      try {
        await prisma.user.delete({ where: { id } });
        return res.status(204).end();
      } catch (error) {
        return res.status(500).json({ error: 'Failed to delete teacher' });
      }
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
