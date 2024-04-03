import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';


// QuizForm component that allows creating or editing quizzes
// Компонент QuizForm, який дозволяє створювати чи редагувати тести
const QuizForm = ({ initialData }) => {
  const router = useRouter();

  // State to manage the list of quizzes
  // Стан для управління списком тестів
  const [quizzes, setQuizzes] = useState([]);
  // State to manage form data
  // Стан для управління даними форми
  const [formData, setFormData] = useState(
    initialData || {
      level: 'Easy',
      questions: [
        {
          text: '',
          choices: [{ text: '' }, { text: '' }, { text: '' }, { text: '' }],
          correctAnswerIndex: 0,
        },
      ],
    }
  );
  // State to manage form validation errors
  // Стан для управління помилками валідації форми
  const [formErrors, setFormErrors] = useState({
    level: '',
    questions: [],
  });

  // Fetch quizzes from the server on every change in form data
  // Отримання тестів з серверу при зміні даних форми
  useEffect(() => {
    fetchQuizzes();
  }, [formData]);

  // Function to fetch quizzes from the server
  // Функція для отримання тестів з серверу
  const fetchQuizzes = async () => {
    try {
      const response = await axios.get('/api/quizzes');
      setQuizzes(response.data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  // Function to validate the form data
  // Функція для валідації даних форми
  const validateForm = () => {
    const newFormErrors = { level: '', questions: [] };

    if (!formData.level) {
      newFormErrors.level = 'Level is required.';
    }

    formData.questions.forEach((question, index) => {
      const questionErrors = {};
      if (!question.text) {
        questionErrors.text = 'Question text is required.';
      }

      question.choices.forEach((choice, choiceIndex) => {
        if (!choice.text) {
          questionErrors[`choice${choiceIndex}`] = `Choice ${choiceIndex + 1} is required.`;
        }
      });

      newFormErrors.questions[index] = questionErrors;
    });

    setFormErrors(newFormErrors);

    // Check if there are no errors
    // Перевірка на наявність помилок
    return (
      Object.values(newFormErrors.level).length === 0 &&
      newFormErrors.questions.every((errors) => Object.values(errors).length === 0)
    );
  };

  // Event handler for input changes in the form
  // Обробник події зміни введених даних в формі
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Event handler for question text changes in the form
  // Обробник події зміни тексту питання в формі
  const handleQuestionChange = (index, event) => {
    const { name, value } = event.target;
    const newQuestions = [...formData.questions];
    newQuestions[index] = {
      ...newQuestions[index],
      [name]: value,
    };
    setFormData({
      ...formData,
      questions: newQuestions,
    });
  };

  // Event handler for choice text changes in the form
  // Обробник події зміни тексту варіанту відповіді в формі
  const handleChoiceChange = (questionIndex, choiceIndex, event) => {
    const { value } = event.target;
    const newQuestions = [...formData.questions];
    newQuestions[questionIndex].choices[choiceIndex].text = value;
    setFormData({
      ...formData,
      questions: newQuestions,
    });
  };

  // Event handler for correct choice changes in the form
  // Обробник події зміни правильного варіанту відповіді в формі
  const handleCorrectChoiceChange = (questionIndex, event) => {
    const { value } = event.target;
    const newQuestions = [...formData.questions];
    newQuestions[questionIndex].correctAnswerIndex = parseInt(value);
    setFormData({
      ...formData,
      questions: newQuestions,
    });
  };
  const handleCancel = () => {
    router.push('/quizzes');
  };
  // Event handler for form submission
  // Обробник події подання форми
  const submitForm = async (event) => {
    event.preventDefault();

    // If the form is not valid, do not submit
    // Якщо форма невалідна, не подавати
    if (!validateForm()) {
      return;
    }

    try {
      if (initialData) {
        await axios.put(`/api/quizzes?id=${initialData._id}`, formData);
      } else {
        await axios.post('/api/quizzes', formData);
      }

      fetchQuizzes();
      clearForm();
      if (router.query.id) {
        // Redirect to the quizzes page only in edit mode
        router.push('/quizzes');
      }

    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };
    // Handle cancel button click, navigate back
  // Обробка натискання кнопки скасування, перехід назад


  // Function to clear the form
  // Функція для очищення форми
  const clearForm = () => {
    setFormData({
      level: 'Easy',
      questions: [
        {
          text: '',
          choices: [{ text: '' }, { text: '' }, { text: '' }, { text: '' }],
          correctAnswerIndex: 0,
        },
      ],
    });
    setFormErrors({ level: '', questions: [] });
  };

  // Render the QuizForm component
  // Відображення компоненту QuizForm
  return (
    <div className="quiz-form-container">
      <h1 className="text-2xl mb-4">Quiz Form</h1>
      <form onSubmit={submitForm}>
        {/* Level selection dropdown */}
        {/* Випадаючий список вибору рівня */}
        <label className="block mb-2">
          Level:
          <select
            className={`text-black border rounded p-1 ${formErrors.level ? 'border-red-500' : ''}`}
            name="level"
            value={formData.level}
            onChange={handleInputChange}
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          {formErrors.level && <p className="text-red-500">{formErrors.level}</p>}
        </label>
        {/* Question and choices input fields */}
        {/* Поля введення питання та варіантів відповіді */}
        {formData.questions.map((question, questionIndex) => (
          <div key={questionIndex} className="mb-4">
            {/* Question text input */}
            {/* Введення тексту питання */}
            <label className="block mb-2">
              Question Text:
              <input
                type="text"
                name="text"
                placeholder="Question Text"
                value={question.text}
                onChange={(event) => handleQuestionChange(questionIndex, event)}
                className={`text-black border rounded p-1 ${formErrors.questions[questionIndex]?.text ? 'border-red-500' : ''}`}
              />
              {formErrors.questions[questionIndex]?.text && (
                <p className="text-red-500">{formErrors.questions[questionIndex].text}</p>
              )}
            </label>
            {/* Choices text inputs */}
            {/* Введення тексту варіантів відповіді */}
            {question.choices.map((choice, choiceIndex) => (
              <label key={choiceIndex} className="block mb-2">
                {`Choice ${choiceIndex + 1}:`}
                <input
                  type="text"
                  placeholder={`Choice ${choiceIndex + 1}`}
                  value={choice.text}
                  onChange={(event) => handleChoiceChange(questionIndex, choiceIndex, event)}
                  className={`text-black border rounded p-1 ${formErrors.questions[questionIndex]?.[`choice${choiceIndex}`] ? 'border-red-500' : ''}`}
                />
                {formErrors.questions[questionIndex]?.[`choice${choiceIndex}`] && (
                  <p className="text-red-500">{formErrors.questions[questionIndex][`choice${choiceIndex}`]}</p>
                )}
              </label>
            ))}
            {/* Correct answer selection dropdown */}
            {/* Випадаючий список вибору правильної відповіді */}
            <label className="block mb-2">
              Correct Answer Index:
              <select
                value={question.correctAnswerIndex}
                onChange={(event) => handleCorrectChoiceChange(questionIndex, event)}
                className={`text-black border rounded p-1 ${formErrors.questions[questionIndex]?.correctAnswerIndex ? 'border-red-500' : ''}`}
              >
                {question.choices.map((_, index) => (
                  <option key={index} value={index}>
                    {index + 1}
                  </option>
                ))}
              </select>
              {formErrors.questions[questionIndex]?.correctAnswerIndex && (
                <p className="text-red-500">{formErrors.questions[questionIndex].correctAnswerIndex}</p>
              )}
            </label>
          </div>
        ))}
        {/* Form submission and clearing buttons */}
        {/* Кнопки подання та очищення форми */}
        <div className="flex">
          <button className="btn-primary mr-2" type="submit">Save Quiz</button>
          <button className="btn-red" type="button" onClick={clearForm}>Clear Form</button>
          <button type="button" className="btn-red ml-1" onClick={handleCancel}>Cancel</button>

        </div>
      </form>
    </div>
  );
};

export default QuizForm;
