// Import necessary functions and libraries for database backup
// Імпорт необхідних функцій та бібліотек для резервного копіювання бази даних
import { backupDatabase, mongooseConnect } from '../../lib/mongoose';

// Request handling function for database backup
// Функція обробки для резервного копіювання бази даних
export default async function handler(req, res) {
  // Check if the request method is POST
  // Перевірити, чи метод запиту - POST
  if (req.method === 'POST') {
    try {
      // Connect to MongoDB using mongoose
      // Підключитися до MongoDB за допомогою mongoose
      await mongooseConnect();

      // Perform the database backup
      // Виконати резервне копіювання бази даних
      const backupData = await backupDatabase();

      // Respond with the backup data
      // Відповісти із даними резервної копії
      res.status(200).json(backupData);
    } catch (error) {
      // Log and respond with an error message if backup fails
      // Зареєструвати та відповісти із повідомленням про помилку, якщо резервне копіювання не вдалося
      res.status(500).json({ message: 'Backup failed' });
    }
  } else {
    // Respond with a Method Not Allowed status if the request method is not POST
    // Відповісти статусом Method Not Allowed, якщо метод запиту не є POST
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
