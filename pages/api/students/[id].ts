import { getSession } from '@/lib/session';
import type { NextApiRequest, NextApiResponse } from 'next';
import { updateStudent, deleteStudent } from '../../../models/student';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid student id.' });
    }
    switch (req.method) {
      case 'PUT': {
        const student = await updateStudent(id, req.body);
        res.status(200).json(student);
        break;
      }
      case 'DELETE': {
        await deleteStudent(id);
        res.status(204).end();
        break;
      }
      default:
        res.setHeader('Allow', ['PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
