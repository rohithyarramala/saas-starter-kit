import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (typeof id !== 'string') return res.status(400).json({ error: 'Invalid id' });

  switch (req.method) {
    case 'GET':
      // Get section by id
      const section = await prisma.section.findUnique({ where: { id } });
      if (!section) return res.status(404).json({ error: 'Section not found' });
      return res.status(200).json(section);
    case 'PUT':
      // Update section
      const { name } = req.body;
      try {
        const updated = await prisma.section.update({
          where: { id },
          data: { name },
        });
        return res.status(200).json(updated);
      } catch (error) {
        return res.status(500).json({ error: 'Failed to update section' });
      }
    case 'DELETE':
      // Delete section
      try {
        await prisma.section.delete({ where: { id } });
        return res.status(204).end();
      } catch (error) {
        return res.status(500).json({ error: 'Failed to delete section' });
      }
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
