import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (typeof id !== 'string') return res.status(400).json({ error: 'Invalid id' });

  switch (req.method) {
    case 'GET':
      // Get class by id
      const classItem = await prisma.class.findUnique({ where: { id } });
      if (!classItem) return res.status(404).json({ error: 'Class not found' });
      return res.status(200).json(classItem);
    case 'PUT':
      // Update class
      const { name } = req.body;
      try {
        const updated = await prisma.class.update({
          where: { id },
          data: { name },
        });
        return res.status(200).json(updated);
      } catch (error) {
        return res.status(500).json({ error: 'Failed to update class' });
      }
    case 'DELETE':
      // Delete class
      try {
        await prisma.class.delete({ where: { id } });
        return res.status(204).end();
      } catch (error) {
        return res.status(500).json({ error: 'Failed to delete class' });
      }
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
