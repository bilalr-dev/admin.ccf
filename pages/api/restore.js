// Import necessary functions from the mongoose library
// Імпорт необхідних функцій з бібліотеки mongoose
import { restoreDatabase, mongooseConnect } from '../../lib/mongoose';

// Handler function to handle database restoration requests
// Функція обробки запитів на відновлення бази даних
export default async function handler(req, res) {
  // Check if the request method is POST
  // Перевірка, чи метод запиту є POST
  if (req.method === 'POST') {
    try {
      // Connect to MongoDB using mongoose
      // Підключення до MongoDB за допомогою mongoose
      await mongooseConnect();
      // Get the restore data from the request body
      // Отримання даних для відновлення з тіла запиту
      const restoreData = req.body;
      // Perform the database restore operation
      // Виконання операції відновлення бази даних
      await restoreDatabase(restoreData);
      // Send a JSON response indicating a successful restore
      // Відправлення JSON-відповіді, що підтверджує успішне відновлення
      res.status(200).json({ message: 'Restore successful' });
    } catch (error) {
      // Send a JSON response indicating a failed restore
      // Відправлення JSON-відповіді, що підтверджує неуспішне відновлення
      res.status(500).json({ message: 'Restore failed' });
    }
  } else {
    // Send a JSON response indicating that the method is not allowed
    // Відправлення JSON-відповіді, що підтверджує, що метод не дозволений
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
