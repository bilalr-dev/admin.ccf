import CourseForm from "@/components/CourseForm";
import Layout from "@/components/Layout";

export default function NewCourse() {
  return (
    <Layout>
      <h1>New Course</h1>
      <CourseForm />
    </Layout>
  );
}