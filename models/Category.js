// Import necessary components from mongoose library
// Імпорт необхідних компонентів з бібліотеки mongoose
import mongoose, { model, models, Schema } from "mongoose";

// Define a schema for the 'Category' model
// Визначте схему для моделі 'Category'
const CategorySchema = new Schema({
  name: { type: String, required: true }, 
  // Name of the category (required field)
  // Назва категорії (обов'язкове поле)
  categoryImage: [{ type: String }],
   // Array of image URLs associated with the category
   // Масив URL-адрес зображень, пов'язаних з категорією
  parent: { type: mongoose.Types.ObjectId, ref: 'Category' }, 
  // Reference to the parent category
  // Посилання на батьківську категорію
  courses: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Course'
    }
  ], 
  // Array of references to 'Course' model instances
  // Масив посилань на екземпляри моделі 'Course'
});

// Create a Mongoose model for the 'Category' schema
// Створіть модель Mongoose для схеми 'Category'
export const Category = models?.Category || model('Category', CategorySchema);
