import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      // Get all subjects
      const subjects = await prisma.subject.findMany();
      return res.status(200).json(subjects);
    case 'POST':
      // Create a new subject
      const { name, desc, teacherId } = req.body;

      if (!name || !desc || !teacherId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      try {
        const newSubject = await prisma.subject.create({
          data: { name, desc, teacherId },
        });
        return res.status(201).json(newSubject);
      } catch (error) {
        return res.status(500).json({ error: 'Failed to create subject' + error });
      }
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
