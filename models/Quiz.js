// Import necessary components from mongoose library
// Імпорт необхідних компонентів з бібліотеки mongoose

import { model, Schema, models } from 'mongoose';

// Define a schema for the 'Choice' model
// Визначте схему для моделі 'Choice'

const ChoiceSchema = new Schema({
  text: {
    type: String,
    required: true, // Choice text is a required field
  },
});

// Define a schema for the 'Quiz' model
// Визначте схему для моделі 'Quiz'

const QuizSchema = new Schema({
  level: {
    type: String,
    required: true, 
    // Quiz level is a required field
    // Рівень вікторини є обов'язковим полем
    enum: ['Easy', 'Medium', 'Hard'], 
    // Quiz level should be one of the specified values
    // Рівень вікторини повинен бути одним із вказаних значень
  },
  questions: [
    {
      text: {
        type: String,
        required: true, 
        // Question text is a required field
        // Текст питання є обов'язковим полем
      },
      choices: [ChoiceSchema], 
      // Embed the 'Choice' schema for representing answer choices
      // Вбудована схема 'Choice' для представлення варіантів відповідей
      correctAnswerIndex: {
        type: Number,
        required: true, 
        // Index of correct answer is a required field
        // Індекс правильної відповіді є обов'язковим полем
      },
    },
  ],
});

// Create a Mongoose model for the 'Quiz' schema
// Створіть модель Mongoose для схеми 'Quiz'

export const Quiz = models?.Quiz || model('Quiz', QuizSchema);
