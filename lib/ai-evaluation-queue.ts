// lib/ai-evaluation-queue.ts
// This is a placeholder for the AI evaluation queue logic. You should wire this up to BullMQ or your preferred queue system.
import { prisma } from './prisma';
import { Queue } from 'bullmq';

const aiEvaluationQueue = new Queue('ai-evaluation', {
  connection: {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
    // password: process.env.REDIS_PASSWORD,
  },
});

export async function enqueueEvaluationJob(evaluationId: string) {
  // Fetch all submissions for the evaluation
  const evaluation = await prisma.evaluation.findUnique({
    where: { id: evaluationId },
    include: { submissions: true },
  });
  if (!evaluation) throw new Error('Evaluation not found');

  // For each submission, enqueue a background job
  for (const submission of evaluation.submissions) {
    await aiEvaluationQueue.add('ai-evaluate', {
      submissionId: submission.id,
      evaluationId,
    });
  }
  // Optionally, update evaluation status to 'in-progress'
  await prisma.evaluation.update({
    where: { id: evaluationId },
    data: { status: 'in-progress' },
  });
}
