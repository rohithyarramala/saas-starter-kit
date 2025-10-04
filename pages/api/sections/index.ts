import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      // Get all sections
      const sections = await prisma.section.findMany();
      return res.status(200).json(sections);
    case 'POST':
      // Create a new section
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      try {
        const newSection = await prisma.section.create({
          data: { name },
        });
        return res.status(201).json(newSection);
      } catch (error) {
        return res.status(500).json({ error: 'Failed to create section'+error });
      }
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
