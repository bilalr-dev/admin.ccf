// Import the MongoClient from the 'mongodb' library
// Імпортуйте MongoClient з бібліотеки 'mongodb'
import { MongoClient } from 'mongodb';

// Check if the environment variable 'MONGODB_URI' is missing or invalid
// Перевірте, чи відсутній або невірний змінний середовища 'MONGODB_URI'
if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

// Assign the value of the 'MONGODB_URI' environment variable to the 'uri' variable
// Присвойте значення змінної середовища 'MONGODB_URI' змінній 'uri'
const uri = process.env.MONGODB_URI;

// Define options for MongoDB connection (empty object for default options)
// Визначте параметри підключення MongoDB (порожній об'єкт для значень за замовчуванням)
const options = {};

// Declare variables for MongoDB client and clientPromise
// Оголосіть змінні для клієнта MongoDB та clientPromise
let client;
let clientPromise;

// Check if the environment is set to 'development'
// Перевірте, чи встановлено середовище розробки ('development')
if (process.env.NODE_ENV === 'development') {
  // Check if the global _mongoClientPromise is not defined
  // Перевірте, чи глобальна змінна _mongoClientPromise не визначена
  if (!global._mongoClientPromise) {
    // Create a new MongoClient instance and connect to the MongoDB server
    // Створіть новий екземпляр MongoClient та підключіться до сервера MongoDB
    client = new MongoClient(uri, options);

    // Set the global _mongoClientPromise to the connection promise
    // Встановіть глобальну змінну _mongoClientPromise на обіцянку підключення
    global._mongoClientPromise = client.connect();
  }

  // Use the global _mongoClientPromise for the clientPromise
  // Використовуйте глобальну змінну _mongoClientPromise для clientPromise
  clientPromise = global._mongoClientPromise;
} else {
  // Create a new MongoClient instance and connect to the MongoDB server
  // Створіть новий екземпляр MongoClient та підключіться до сервера MongoDB
  client = new MongoClient(uri, options);

  // Set the clientPromise to the connection promise
  // Встановіть clientPromise на обіцянку підключення
  clientPromise = client.connect();
}

// Export the clientPromise for MongoDB connection throughout the application
// Експортуйте clientPromise для підключення до MongoDB у всьому додатку
export default clientPromise;
