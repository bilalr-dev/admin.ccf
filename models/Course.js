// Import necessary components from mongoose library
// Імпорт необхідних компонентів з бібліотеки mongoose
import mongoose, { model, Schema, models } from "mongoose";

// Define a schema for the 'Course' model
// Визначте схему для моделі 'Course'

const CourseSchema = new Schema({
  title: { type: String, required: true }, 
  // Title of the course (required field)
  // Назва курсу (обов'язкове поле)
  description: String, 
  // Description of the course
  // Опис курсу
  bodyText: String, 
  // Body text content of the course
  // Текст вмісту курсу
  youtubeUrl: { type: String, required: true }, 
  // YouTube URL for the course (required field)
  // URL-адреса YouTube для курсу (обов'язкове поле)
  images: [{ type: String }], 
  // Array of image URLs associated with the course
  // Масив URL-адрес зображень, пов'язаних з курсом
  category: { type: mongoose.Types.ObjectId, ref: 'Category' }, 
  // Reference to the 'Category' model
  // Посилання на модель 'Category'
}, {
  timestamps: true, 
  // Automatically add timestamps for creation and update
 // Автоматично додавайте часові мітки для створення та оновлення
});

// Create a Mongoose model for the 'Course' schema
// Створіть модель Mongoose для схеми 'Course'
export const Course = models.Course || model('Course', CourseSchema);
