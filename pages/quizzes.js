// Import necessary dependencies
// Імпорт необхідних залежностей
import Layout from "@/components/Layout";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from 'react-paginate';

// Quizzes component
// Компонент для квізів
export default function Quizzes() {
  // State variables for quizzes, search term, current page, and items per page
  // Змінні стану для квізів, терміну пошуку, поточної сторінки та елементів
  const [quizzes, setQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8;

  // Function to fetch quiz data from the server
  // Функція для отримання даних квізів з сервера
  const fetchData = async () => {
    try {
      const response = await axios.get('/api/quizzes');
      setQuizzes(response.data);
    } catch (error) {
      throw error;
    }
  };
  // Fetch data on component mount
  // Отримати дані при монтажі компонента
  useEffect(() => {
    fetchData();
  }, []);

  // Function to handle pagination change
  // Функція для обробки зміни сторінки
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };
  // Function to delete all quizzes
  // Функція для видалення всіх квізів
  const deleteAllQuizzes = async () => {
    await axios.delete("/api/quizzes?all=true");
    fetchData();
  };
  // Sort quizzes based on level and question text
  // Сортування квізів за рівнем і текстом питань
  const sortedQuizzes = [...quizzes].sort((a, b) => {
    const levelOrder = { Easy: 1, Medium: 2, Hard: 3 };
    const levelComparison = levelOrder[a.level] - levelOrder[b.level];
    if (levelComparison === 0) {
      return a.questions.map(question => question.text).join(', ')
        .localeCompare(b.questions.map(question => question.text).join(', '));
    }
    return levelComparison;
  });
  // Filter quizzes based on search term
  // Фільтрація квізів за терміном пошуку
  const filteredQuizzes = sortedQuizzes
    .filter(quiz =>
      quiz.level.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.questions.some(question =>
        question.text.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  // Calculate the total number of pages for pagination
  // Обчислення загальної кількості сторінок для пагінації
  const pageCount = Math.ceil(filteredQuizzes.length / itemsPerPage);

  // Render the Quizzes component
  // Рендер компонента для квізів
  return (
    <Layout>
      <h1>Quizzes</h1>
      <Link className="btn-primary" href={'/quizzes/new'}>
        Add new Quiz
      </Link>
      <div className="mt-4">
        <input
          type="text"
          placeholder="Search for a quiz by level or question"
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
          className="px-4 py-2 border rounded-md"
        />
      </div>
      <table className="basic mt-4">
        <thead>
          <tr>
            <td>Question</td>
            <td>Level</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          {filteredQuizzes
            .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
            .map((quiz) => (
              <tr key={quiz._id}>
                <td>{quiz.questions.map(question => question.text).join(', ')}</td>
                <td>{quiz.level}</td>
                <td>
                  <Link
                    className="btn-default"
                    href={'/quizzes/edit/' + quiz._id}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    Edit
                  </Link>
                  <Link
                    className="btn-red"
                    href={'/quizzes/delete/' + quiz._id}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                    Delete
                  </Link>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {filteredQuizzes.length > 0 && (
        <div>
          <div className="pagination-container mt-4">
            {/* ReactPaginate component for pagination */}
            {/* Компонент ReactPaginate для пагінації */}
            <ReactPaginate
              previousLabel={'<'}
              nextLabel={'>'}
              breakLabel={'...'}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageChange}
              containerClassName={'pagination'}
              activeClassName={'active'}
            />
          </div>

          <div className="mt-4">
            {/* Button to delete all quizzes */}
            {/* Кнопка для видалення всіх квізів */}
            <button
              onClick={() => deleteAllQuizzes()}
              className="btn-red py-2 px-4 border rounded-md"
            >
              Delete All
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}
