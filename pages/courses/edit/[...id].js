// Import necessary components and libraries
// Імпорт необхідних компонентів та бібліотек

import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import CourseForm from "@/components/CourseForm";

// Functional component to edit a course
// Функціональний компонент для редагування курсу

export default function EditCoursePage() {
  const [courseInfo, setCourseInfo] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  // Fetch course data when the component mounts or when 'id' changes
  // Отримання даних курсу при монтуванні компонента або зміні 'id'

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get('/api/courses?id='+id).then(response => {
      setCourseInfo(response.data);
    });
  }, [id]);

  return (
    <Layout>
      <h1>Edit course</h1>
      {courseInfo && (
        // Render the CourseForm component with the fetched course data
        // Відображення компонента CourseForm із отриманими даними курсу
        <CourseForm {...courseInfo} />
      )}
    </Layout>
  );
}
