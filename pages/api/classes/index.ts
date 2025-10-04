import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      // Get all classes
      const classes = await prisma.class.findMany();
      return res.status(200).json(classes);
    case 'POST':
      // Create a new class
      const { name, orgId } = req.body;
      if (!name || !orgId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      try {
        const organizationId = String(orgId);
        const newClass = await prisma.class.create({
          data: { name, organizationId },
        });
        return res.status(201).json(newClass);
      } catch (error) {
        return res.status(500).json({ error: 'Failed to create class' });
      }
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
