// Import necessary components and libraries
// Імпорт необхідних компонентів та бібліотек

import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

// Functional component to delete a quiz
// Функціональний компонент для видалення вікторини

export default function DeleteQuizPage() {
  const router = useRouter();
  const [quizInfo, setQuizInfo] = useState();
  const { id } = router.query;

  // Fetch quiz data when the component mounts or when 'id' changes
  // Отримання даних вікторини при монтуванні компонента або зміні 'id'

  useEffect(() => {
    if (!id) {
      return;
    }

    axios.get('/api/quizzes?id=' + id).then(response => {
      setQuizInfo(response.data);
    });
  }, [id]);

  // Function to navigate back to the quizzes page
  // Функція для повернення на сторінку вікторин

  function goBack() {
    router.push('/quizzes');
  }

  // Async function to delete the quiz and navigate back to the quizzes page
  // Асинхронна функція для видалення вікторини та повернення на сторінку вікторин

  async function deleteQuiz() {
    await axios.delete('/api/quizzes?id=' + id);
    router.push('/quizzes');
  }

  return (
    <Layout>
      <div className="text-center mt-6">
        {/* Display a confirmation message with the question to be deleted */}
        {/* Відображення підтверджуючого повідомлення із питанням для видалення */}
        <p className="mb-4 text-white">Do you really want to delete the question &quot;{quizInfo?.questions.map(question => question.text).join(', ')}&quot;?</p>
        <div className="flex gap-2 justify-center">
          {/* Button to confirm deletion */}
          {/* Кнопка для підтвердження видалення */}
          <button onClick={deleteQuiz} className="btn-red">Yes</button>
          {/* Button to cancel and go back */}
          {/* Кнопка для скасування та повернення назад */}
          <button className="btn-default" onClick={goBack}>No</button>
        </div>
      </div>
    </Layout>
  );
}
