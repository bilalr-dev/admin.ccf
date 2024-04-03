// Import the mongoose library for MongoDB interaction
// Імпортуйте бібліотеку mongoose для взаємодії з MongoDB
import mongoose from 'mongoose';

// Import the schemas for Category, Course, and Quiz models
// Імпортуйте схеми для моделей Category, Course та Quiz
import CategorySchema from '../models/Category';
import CourseSchema from '../models/Course';
import QuizSchema from '../models/Quiz';

// Register the Category, Course, and Quiz models with mongoose
// Зареєструйте моделі Category, Course та Quiz в mongoose
mongoose.model('Category', CategorySchema);
mongoose.model('Course', CourseSchema);
mongoose.model('Quiz', QuizSchema);

// Function to establish a connection to the MongoDB database
// Функція для встановлення з'єднання з базою даних MongoDB
export function mongooseConnect() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.asPromise();
  } else {
    const uri = process.env.MONGODB_URI;
    return mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  }
}

// Function to perform a backup of the database
// Функція для виконання резервного копіювання бази даних
export async function backupDatabase() {
  try {
    await mongooseConnect();

    // Get mongoose models for Category, Course, and Quiz
    // Отримайте моделі mongoose для Category, Course та Quiz
    const Category = mongoose.model('Category');
    const Course = mongoose.model('Course');
    const Quiz = mongoose.model('Quiz');

    // Fetch all categories, courses, and quizzes from the database
    // Отримайте всі категорії, курси та тести з бази даних
    const categories = await Category.find({});
    const courses = await Course.find({});
    const quizzes = await Quiz.find({});

    // Create a backup object containing categories, courses, and quizzes
    // Створіть об'єкт резервної копії, що містить категорії, курси та тести
    const backupData = {
      categories,
      courses,
      quizzes,
    };

    return backupData;
  } catch (error) {
    throw error;
  }
}

// Function to restore the database from a given backup data
// Функція для відновлення бази даних з вказаними даними резервної копії
export async function restoreDatabase(data) {
  try {
    await mongooseConnect();

    // Delete all existing records in the Category, Course, and Quiz collections
    // Видаліть всі існуючі записи в колекціях Category, Course та Quiz
    await mongoose.model('Category').deleteMany({});
    await mongoose.model('Course').deleteMany({});
    await mongoose.model('Quiz').deleteMany({});

    // Create new records for categories, courses, and quizzes based on the backup data
    // Створюйте нові записи для категорій, курсів та тестів на основі даних резервної копії
    const restoredCategories = await mongoose.model('Category').create(data.categories);

    // Create a mapping between original category IDs and restored category IDs
    // Створити відображення між початковими ідентифікаторами категорій та відновленими ідентифікаторами категорій
    const categoryMap = new Map(data.categories.map((original, index) => [original._id, restoredCategories[index]._id]));

    // Modify courses with updated category references
    // Змініть курси з оновленими посиланнями на категорії
    const restoredCourses = data.courses.map(course => {
      const newCourse = { ...course };
      newCourse.category = categoryMap.get(course.category);
      return newCourse;
    });

    // Modify quizzes with updated category and course references
    // Змініть тести з оновленими посиланнями на категорії та курси
    const restoredQuizzes = data.quizzes.map(quiz => {
      const newQuiz = { ...quiz };
      newQuiz.category = categoryMap.get(quiz.category);
      newQuiz.course = restoredCourses.find(course => course.originalId === quiz.course).id; // Assuming originalId is used for mapping courses
      return newQuiz;
    });

    // Create new records for restored courses and quizzes
    // Створити нові записи для відновлених курсів та тестів
    await mongoose.model('Course').create(restoredCourses);
    await mongoose.model('Quiz').create(restoredQuizzes);
  } catch (error) {
    throw error;
  }
}
