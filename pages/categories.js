// Set state variables with fetched data
// Встановлення змінних стану з отриманими даними

import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { withSwal } from "react-sweetalert2";
import ReactPaginate from 'react-paginate';
import Spinner from "@/components/Spinner";

function Categories({ swal }) {
  // State variables for category data and form handling
  // Змінні стану для даних категорії та обробки форми
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const [isUploading, setIsUploading] = useState(false);
  const [categoryImage, setCategoryImage] = useState([]);
  const [parentCategory, setParentCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false); 
  const itemsPerPage = 8;

  useEffect(() => {
    // Fetch categories when component mounts
    // Отримати категорії при монтажі компонента
    fetchCategories();
  }, []);

  function fetchCategories() {
    // Fetch categories from the API and sort them alphabetically
    // Отримати категорії з API та впорядкувати їх за алфавітом
    axios.get("/api/categories").then((result) => {
      const sortedCategories = result.data.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setCategories(sortedCategories);
    });
  }

  const handleImageClick = (image) => {
    // Set selected image on thumbnail click
    // Встановити вибране зображення при кліку на ескіз
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    // Close image modal
    // Закрити модальне вікно зображення
    setSelectedImage(null);
  };

  async function saveCategory(ev) {
    // Handle form submission to save or update a category
    // Обробка відправки форми для збереження чи оновлення категорії
    ev.preventDefault();
    setFormSubmitted(true);

    if (!name.trim() || categoryImage.length === 0) {
      // Display an error message for no image uploaded
      // Відображення повідомлення про помилку, якщо зображення не завантажено
      return;
    }

    const data = {
      name,
      parentCategory,
      categoryImage,
    };

    if (editedCategory) {
      // If editing, include category ID and send a PUT request
      // Якщо ви редагуєте, включіть ідентифікатор категорії та надішліть запит PUT
      data._id = editedCategory._id;
      await axios.put("/api/categories", data);
      setEditedCategory(null);
    } else {
      // If creating new category, send a POST request
      // Якщо створюєте нову категорію, відправте запит POST
      await axios.post("/api/categories", data);
    }

    // Reset form fields and fetch updated categories
    // Скидання полів форми та отримання оновлених категорій
    setName("");
    setParentCategory("");
    setCategoryImage([]);
    setFormSubmitted(false);
    fetchCategories();
  }

  function editCategory(category) {
    // Set the selected category for editing
    // Встановити вибрану категорію для редагування
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
    setCategoryImage(category.categoryImage || []); 
  }

  function deleteCategory(category) {
    // Confirm and delete a category
    // Підтвердити та видалити категорію
    swal
      .fire({
        title: "Are you sure?",
        text: `Do you want to delete ${category.name}?`,
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Yes, Delete!",
        confirmButtonColor: "#d55",
        reverseButtons: false,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const { _id } = category;
          await axios.delete("/api/categories?_id=" + _id);
          fetchCategories();
        }
      });
  }

  const uploadImage = async (ev) => {
    // Handle image upload and update categoryImage state
    // Обробка завантаження зображення та оновлення стану categoryImage
    const file = ev.target?.files[0];
    if (file && file.type.startsWith("image/")) {
      setIsUploading(true);
      const data = new FormData();
      data.append("file", file);

      try {
        const res = await axios.post("/api/upload", data);
        setCategoryImage([res.data.links[0]]);
      } catch (error) {
          throw error;
      }

      setIsUploading(false);
    }
  };

  function deleteAllCategories() {
    // Confirm and delete all categories
    // Підтвердити та видалити всі категорії
    swal.fire({
        title: "Are you sure?",
        text: "This will delete all categories. Are you sure you want to proceed?",
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Yes, Delete All!",
        confirmButtonColor: "#d55",
        reverseButtons: false,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          await axios.delete("/api/categories?all=true");
          fetchCategories();
        }
      });
  }

  const filteredCategories = categories
    .filter(
      (category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (category?.parent?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

  const pageCount = Math.ceil(filteredCategories.length / itemsPerPage);
  const handlePageChange = ({ selected }) => {
    // Update current page when pagination changes
    // Оновлення поточної сторінки при зміні пагінації
    setCurrentPage(selected);
  };
  return (
    <Layout>
      <h1>Categories</h1>
      <h2 className="text-sm mb-2">
        <span>(</span><span className="text-red-500">*</span>) required fields
      </h2>
      <label>
        {editedCategory
          ? `Edit category ${editedCategory.name}`
          : "Create new category"}
        <span className="text-red-500"> *</span>
      </label>
      <form onSubmit={saveCategory}>
        <div className="flex gap-1">
          <input
            type="text" 
            placeholder={"Category name"}
            onChange={(ev) => setName(ev.target.value)}
            value={name}
            className={`px-4 py-2 border rounded-md ${!name.trim() && formSubmitted ? 'border-red-500' : ''}`}
          />
          <select
            onChange={(ev) => setParentCategory(ev.target.value)}
            value={parentCategory}
            className="px-4 py-2 border rounded-md"
          >
            <option value="">No parent category</option>
            {categories.length > 0 &&
              categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>
        {(!name.trim() && formSubmitted) && (
          <div className="text-red-500 mt-2">
            Category name cannot be empty.
          </div>
        )}
        <div className="mb-2"></div>
        <label>
            Category Thumbnail
            <span className="text-red-500"> *</span>
          </label>
        <div className="flex gap-1">
          <div className="mb-2 flex flex-wrap gap-1">
            <label className="w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-sm bg-white shadow-sm border border-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
              <div>Add image</div>
              <input type="file" accept="image/*" onChange={uploadImage} className="hidden" />
            </label>
            {!!categoryImage?.length &&              categoryImage.map((link) => (
                <div
                  key={link}
                  className="relative h-24"
                  onClick={() => handleImageClick(link)}
                >
                  <img
                    src={link}
                    alt=""
                    className="w-64 h-48 ml-2 object-cover rounded-lg cursor-pointer hover:opacity-75"
                  />
                  {selectedImage === link && (
                    <button
                      className="absolute top-1 right-1 text-white bg-red-500 rounded-full p-1 hover:bg-red-600"
                      onClick={handleCloseModal}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            {isUploading && (
              <div className="h-24 flex items-center">
                <Spinner />
              </div>
            )}
          </div>
        </div>

        {(categoryImage.length === 0 && formSubmitted) && (
          <div className="text-red-500 mt-2">
            Image is required.
          </div>
        )}
        <button
              type="submit"
              className="btn-primary py-2 px-4"
            >
              Save
            </button>
      </form>
      {!editedCategory && (
        <div>
          <div className="mt-4">
            <input
              type="text"
              placeholder="Search for a category by name or parent category"
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
              className="px-4 py-2 border rounded-md"
            />
          </div>
          <table className="basic mt-4">
            <thead>
              <tr>
                <td>Category name</td>
                <td>Parent category</td>
                <td>Action</td>
              </tr>
            </thead>
            <tbody>
              {filteredCategories
                .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
                .map((category) => (
                  <tr key={category._id}>
                    <td>{category.name}</td>
                    <td>{category?.parent?.name}</td>
                    <td className="flex gap-1">
                      <button
                        onClick={() => editCategory(category)}
                        className="btn-default py-2 px-4 border rounded-md flex items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4 inline-block mr-1"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => deleteCategory(category)}
                        className="btn-red py-2 px-4 border rounded-md flex items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4 inline-block mr-1"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {filteredCategories.length > 0 && (
            <div className="pagination-container mt-4">
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
          )}

          {filteredCategories.length > 0 && (
            <div className="mt-4">
              <button
                onClick={deleteAllCategories}
                className="btn-red py-2 px-4 border rounded-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 inline-block mr-1"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
                Delete All
              </button>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}

export default withSwal(({ swal }, ref) => <Categories swal={swal} />);
