import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  if (typeof id !== 'string')
    return res.status(400).json({ error: 'Invalid id' });

  switch (req.method) {
    case 'GET':
      // Get subject by id
      const subject = await prisma.subject.findUnique({ where: { id } });
      if (!subject) return res.status(404).json({ error: 'Subject not found' });
      return res.status(200).json(subject);
    case 'PUT':
      // Update subject
      const { name, desc } = req.body;
      try {
        const updated = await prisma.subject.update({
          where: { id },
          data: { name, desc },
        });
        return res.status(200).json(updated);
      } catch (error) {
        return res.status(500).json({ error: 'Failed to update subject' });
      }
    case 'DELETE':
      // Delete subject
      try {
        await prisma.subject.delete({ where: { id } });
        return res.status(204).end();
      } catch (error) {
        return res.status(500).json({ error: 'Failed to delete subject' });
      }
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
