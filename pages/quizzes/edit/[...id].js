import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import QuizForm from "@/components/QuizForm";

export default function EditQuizPage() {
  const [quizInfo, setQuizInfo] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get(`/api/quizzes?id=${id}`).then(response => {
      setQuizInfo(response.data);
    });
  }, [id]);

  return (
    <Layout>
      <h1>Edit Quiz</h1>
      {quizInfo && (
        <QuizForm initialData={quizInfo} />
      )}
    </Layout>
  );
}
