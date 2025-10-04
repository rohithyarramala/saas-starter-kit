import { getSession } from '@/lib/session';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getStudents, createStudent } from '../../../models/student';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession(req, res);
  const organizationId = session?.user?.organizationId;
    if (!organizationId) {
      return res.status(401).json({ error: 'No organization found in session.' });
    }
    switch (req.method) {
      case 'GET': {
        const students = await getStudents(organizationId);
        res.status(200).json(students);
        break;
      }
      case 'POST': {
        const student = await createStudent(req.body, organizationId);
        res.status(201).json(student);
        break;
      }
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
