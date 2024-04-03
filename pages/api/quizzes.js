import { Quiz } from '@/models/Quiz';
import { mongooseConnect } from '@/lib/mongoose';
import { isAdminRequest } from '@/pages/api/auth/[...nextauth]';

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();
  await isAdminRequest(req, res);

  if (method === 'GET') {
    if (req.query?.id) {
      try {
        const quiz = await Quiz.findOne({ _id: req.query.id });

        if (!quiz) {
          return res.status(404).json({ error: "Quiz not found" });
        }

        return res.status(200).json(quiz);
      } catch (error) {
        console.error('Error fetching quiz by ID:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    } else {
      const quizzes = await Quiz.find();
      res.json(quizzes);
    }
  }

  if (method === 'POST') {
    const { level, questions } = req.body;
    const quizDoc = await Quiz.create({
      level,
      questions,
    });
    res.json(quizDoc);
  }

  if (method === 'PUT') {
    const { level, questions, _id } = req.body;

    try {
      const updatedQuiz = await Quiz.findByIdAndUpdate(_id, { level, questions }, { new: true });

      if (!updatedQuiz) {
        return res.status(404).json({ error: 'Quiz not found' });
      }
      res.json(updatedQuiz);
    } catch (error) {
      console.error('Error updating quiz:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  if (method === 'DELETE') {
    if (req.query?.id) {
      await Quiz.deleteOne({ _id: req.query.id });
      res.json(true);
    } else if (req.query?.all === 'true') {
      await Quiz.deleteMany({});
      res.json(true);
    } else {
      res.status(400).json('Invalid request.');
    }
  }
}
