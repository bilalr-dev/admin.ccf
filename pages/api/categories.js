// Import necessary models and libraries
// Імпорт необхідних моделей та бібліотек
import { Category } from "@/models/Category";
import { Course } from "@/models/Course";
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "@/pages/api/auth/[...nextauth]";

// Request handling function for category-related queries
// Функція обробки для обробки запитів, пов'язаних із категоріями
export default async function handle(req, res) {
  // Extract the request method
  // Витягнути метод запиту
  const { method } = req;

  // Connect to MongoDB using mongoose
  // Підключитися до MongoDB за допомогою mongoose
  await mongooseConnect();

  // Check if the request is from an administrator
  // Перевірити, чи запит від адміністратора
  await isAdminRequest(req, res);

  // Handle different HTTP methods
  // Обробляти різні HTTP-методи
  if (method === 'GET') {
    // Retrieve and return all categories with populated parent and courses
    // Отримати та повернути всі категорії з підготовленими батьківськими та курсами
    res.json(await Category.find().populate('parent').populate('courses'));
  }

  if (method === 'POST') {
    // Extract data from the request body
    // Витягнути дані із тіла запиту
    const { name, parentCategory, courses, categoryImage } = req.body;

    // Create a new category and return the created document
    // Створити нову категорію та повернути створений документ
    const categoryDoc = await Category.create({
      name,
      parent: parentCategory || undefined,
      courses: courses || [],
      categoryImage: categoryImage || [],
    });

    // Return the created category document
    // Повернути створений документ категорії
    res.json(categoryDoc);
  }

  if (method === 'PUT') {
    // Extract data from the request body
    // Витягнути дані із тіла запиту
    const { _id, name, parentCategory, courses, categoryImage } = req.body;

    // Update the category with the specified ID and return the updated document
    // Оновити категорію із вказаним ID та повернути оновлений документ
    const categoryDoc = await Category.findByIdAndUpdate(
      _id,
      {
        name,
        parent: parentCategory || undefined,
        courses: courses || [],
        categoryImage: categoryImage || [],
      },
      { new: true }
    ).populate('parent').populate('courses');

    // Return the updated category document
    // Повернути оновлений документ категорії
    res.json(categoryDoc);
  }

  if (method === 'DELETE') {
    // Extract parameters from the query string
    // Витягнути параметри з рядка запиту
    const { _id, all } = req.query;

    // Delete categories based on the provided criteria
    // Видалити категорії на підставі наданих критеріїв
    if (all === 'true') {
      // Delete all categories along with associated courses
      // Видалити всі категорії разом із пов'язаними курсами
      const categoriesToDelete = await Category.find({});
      for (const categoryToDelete of categoriesToDelete) {
        const coursesToDelete = categoryToDelete.courses || [];
        await Course.deleteMany({ _id: { $in: coursesToDelete } });
      }

      // Delete all categories
      // Видалити всі категорії
      await Category.deleteMany({});
      res.json('All categories deleted.');
    } else if (_id) {
      // Delete a specific category along with associated courses
      // Видалити конкретну категорію разом із пов'язаними курсами
      const categoryToDelete = await Category.findOne({ _id });
      const coursesToDelete = categoryToDelete.courses || [];
      await Course.deleteMany({ _id: { $in: coursesToDelete } });

      // Delete the specific category
      // Видалити конкретну категорію
      await Category.deleteOne({ _id });
      res.json('Category deleted.');
    } else {
      // Invalid request
      // Неправильний запит
      res.status(400).json('Invalid request.');
    }
  }
}
