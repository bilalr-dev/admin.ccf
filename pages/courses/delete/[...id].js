// Import necessary components and libraries
// Імпорт необхідних компонентів та бібліотек

import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

// Functional component to delete a course
// Функціональний компонент для видалення курсу

export default function DeleteCoursePage() {
  const router = useRouter();
  const [courseInfo, setCourseInfo] = useState();
  const { id } = router.query;

  // Fetch course data when the component mounts or when 'id' changes
  // Отримання даних курсу при монтуванні компонента або зміні 'id'

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get('/api/courses?id=' + id).then(response => {
      setCourseInfo(response.data);
    });
  }, [id]);

  // Function to navigate back to the courses page
  // Функція для повернення на сторінку курсів

  function goBack() {
    router.push('/courses');
  }

  // Async function to delete the course and navigate back to the courses page
  // Асинхронна функція для видалення курсу та повернення на сторінку курсів

  async function deleteCourse() {
    await axios.delete('/api/courses?id=' + id);
    router.push('/courses');
  }

  return (
    <Layout>
      <div className="text-center mt-6">
        {/* Display a confirmation message with the course title to be deleted */}
        {/* Відображення підтверджуючого повідомлення із заголовком курсу для видалення */}
        <p className="mb-4 text-white">Do you really want to delete the course &quot;{courseInfo?.title}&quot;?</p>
        <div className="flex gap-2 justify-center">
          {/* Button to confirm deletion */}
          {/* Кнопка для підтвердження видалення */}
          <button onClick={deleteCourse} className="btn-red">Yes</button>
          {/* Button to cancel and go back */}
          {/* Кнопка для скасування та повернення назад */}
          <button className="btn-default" onClick={goBack}>No</button>
        </div>
      </div>
    </Layout>
  );
}
