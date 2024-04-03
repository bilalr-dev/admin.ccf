// Import necessary dependencies
// Імпорт необхідних залежностей
import Layout from "@/components/Layout";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from 'react-paginate';

// Courses component
// Компонент для курсів
export default function Courses() {
  // State variables for courses, categories, search term, current page, and items per page
  // Змінні стану для курсів, категорій, терміну пошуку, поточної сторінки та кількості елементів на сторінці
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8;

  // Fetch data from the API for courses and categories
  // Отримання даних з API для курсів та категорій
  const fetchData = async () => {
    try {
      const [coursesResponse, categoriesResponse] = await Promise.all([
        axios.get('/api/courses'),
        axios.get('/api/categories'),
      ]);

      // Sort courses alphabetically and filter out Uncategorized category
      // Сортування курсів за алфавітом та відфільтрування категорії Uncategorized
      const sortedCourses = coursesResponse.data
        .sort((a, b) => a.title.localeCompare(b.title))
        .filter(course => course.category?.name !== 'Uncategorized');

      // Set state variables with fetched data
      // Встановлення змінних стану з отриманими даними
      setCourses(sortedCourses);
      setCategories(categoriesResponse.data);
    } catch (error) {
      throw error;
    }
  };

  // Fetch data on component mount
  // Отримання даних при монтуванні компонента
  useEffect(() => {
    fetchData();
  }, []);

  // Handle page change for pagination
  // Обробка зміни сторінки для пагінації
  const handlePageChange = ({ selected }) => setCurrentPage(selected);

  // Delete all courses and fetch updated data
  // Видалення всіх курсів та отримання оновлених даних
  const deleteAllCourses = async () => {
    await axios.delete("/api/courses?all=true");
    fetchData();
  };

  // Filter courses based on search term
  // Фільтрація курсів за терміном пошуку
  const filteredCourses = courses
    .filter(course =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (categories.find(cat => cat._id === course.category)?.name || 'Uncategorized').toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Calculate total number of pages for pagination
  // Обчислення загальної кількості сторінок для пагінації
  const pageCount = Math.ceil(filteredCourses.length / itemsPerPage);

  // Render the Courses component
  // Рендер компонента для курсів
  return (
    <Layout>
      <h1>Courses</h1>
      {/* Link to add a new course */}
      {/* Посилання для додавання нового курсу */}
      <Link className="btn-primary" href="/courses/new">
        Add new Course
      </Link>

      <div className="mt-4">
        {/* Search input for filtering courses */}
        {/* Введення пошуку для фільтрації курсів */}
        <input
          type="text"
          placeholder="Search for a course by name or category"
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
          className="px-4 py-2 border rounded-md"
        />
      </div>

      <table className="basic mt-4">
        <thead>
          <tr>
            <td>Course name</td>
            <td>Category</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          {/* Map through filtered courses to display in the table */}
          {/* Проходження по відфільтрованих курсах для відображення у таблиці */}
          {filteredCourses
            .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
            .map((course) => (
              <tr key={course._id}>
                <td>{course.title}</td>
                {/* Display category name or 'Uncategorized' if no category */}
                {/* Відображення назви категорії чи 'Uncategorized', якщо категорії немає */}
                <td>{categories.find((cat) => cat._id === course.category)?.name || 'Uncategorized'}</td>
                <td>
                  {/* Edit button with link to edit course */}
                  {/* Кнопка редагування з посиланням на редагування курсу */}
                  <Link className="btn-default" href={`/courses/edit/${course._id}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    Edit
                  </Link>
                  {/* Delete button with link to delete course */}
                  {/* Кнопка видалення з посиланням на видалення курсу */}
                  <Link className="btn-red" href={`/courses/delete/${course._id}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                    Delete
                  </Link>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Display pagination if there are multiple pages */}
      {/* Відображення пагінації, якщо є кілька сторінок */}
      {filteredCourses.length > 0 && (
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

          {/* Delete All button to delete all courses */}
          {/* Кнопка "Видалити все" для видалення всіх курсів */}
          <div className="mt-4">
            <button
              onClick={deleteAllCourses}
              className="btn-red py-2 px-4 border rounded-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 inline-block mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
              Delete All
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}
