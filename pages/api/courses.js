// Import necessary models and libraries
// Імпорт необхідних моделей та бібліотек

import { Course } from "@/models/Course";
import { Category } from "@/models/Category"; // Import Category model
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "@/pages/api/auth/[...nextauth]";

// Handler function to handle course-related requests
// Функція обробки запитів, пов'язаних із курсами

export default async function handle(req, res) {
  // Extract the request method
  // Виділення методу запиту

  const { method } = req;

  // Connect to MongoDB using mongoose
  // Підключення до MongoDB за допомогою mongoose

  await mongooseConnect();

  // Check if the request is from an admin
  // Перевірка, чи запит від адміністратора

  await isAdminRequest(req, res);

  // Handle GET request for courses
  // Обробка GET-запиту для курсів

  if (method === "GET") {
    if (req.query?.id) {
      // Return a specific course by ID
      // Повернення конкретного курсу за ідентифікатором

      res.json(await Course.findOne({ _id: req.query.id }));
    } else {
      // Return all courses
      // Повернення всіх курсів

      res.json(await Course.find());
    }
  }

  // Handle POST request for creating a new course
  // Обробка POST-запиту для створення нового курсу

  if (method === "POST") {
    const { title, description, youtubeUrl, images, category, bodyText } = req.body;

    // Find the category by its ID
    // Знаходження категорії за ідентифікатором

    const categoryDoc = await Category.findOne({ _id: category });

    // Return a 400 error if the category is not found
    // Повернення помилки 400, якщо категорію не знайдено

    if (!categoryDoc) {
      return res.status(400).json("Invalid category ID.");
    }

    // Create a new course and add it to the category's courses list
    // Створення нового курсу та додавання його до списку курсів категорії

    const courseDoc = await Course.create({
      title,
      description,
      youtubeUrl,
      images,
      category: categoryDoc._id,
      bodyText,
    });

    // Update the category's courses list
    // Оновлення списку курсів категорії

    categoryDoc.courses.push(courseDoc._id);
    await categoryDoc.save();

    res.json(courseDoc);
  }

  // Handle PUT request for updating an existing course
  // Обробка PUT-запиту для оновлення існуючого курсу

  if (method === "PUT") {
    const { title, description, youtubeUrl, images, category, _id, bodyText } = req.body;

    // Update the course with the provided ID in the database
    // Оновлення курсу за вказаним ідентифікатором у базі даних

    await Course.updateOne(
      { _id },
      {
        $set: {
          title,
          description,
          youtubeUrl,
          images,
          category,
          bodyText,
        },
      }
    );

    res.json(true);
  }

  // Handle DELETE request for deleting a course or all courses
  // Обробка DELETE-запиту для видалення курсу чи всіх курсів

  if (method === "DELETE") {
    if (req.query?.id) {
      // Find the course by its ID
      // Знаходження курсу за ідентифікатором

      const courseDoc = await Course.findOne({ _id: req.query.id });

      // Return a 400 error if the course is not found
      // Повернення помилки 400, якщо курс не знайдено

      if (!courseDoc) {
        return res.status(400).json("Invalid course ID.");
      }

      // Remove the course ID from the corresponding category's courses list
      // Видалення ідентифікатора курсу зі списку курсів відповідної категорії

      const categoryDoc = await Category.findOne({ _id: courseDoc.category });
      categoryDoc.courses = categoryDoc.courses.filter(
        (courseId) => courseId.toString() !== req.query.id
      );
      await categoryDoc.save();

      // Delete the course
      // Видалення курсу

      await Course.deleteOne({ _id: req.query.id });
      res.json(true);
    } else if (req.query?.all === "true") {
      // Delete all courses
      // Видалення всіх курсів

      await Course.deleteMany({});
      res.json(true);
    } else {
      // Return a 400 error for an invalid request
      // Повернення помилки 400 для недійсного запиту

      res.status(400).json("Invalid request.");
    }
  }
}
