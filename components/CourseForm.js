// Import necessary libraries and components from React and Next.js
// Імпорт необхідних бібліотек та компонентів з React та Next.js
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Spinner from "@/components/Spinner";

// CourseForm component for creating or editing courses
// Компонент CourseForm для створення або редагування курсів
const CourseForm = ({
  _id,
  title: existingTitle,
  description: existingDescription,
  youtubeUrl: existingYoutubeUrl,
  images: existingImages,
  category: assignedCategory,
  bodyText: existingBodyText,
}) => {
  // State variables for managing form data
  // Змінні стану для управління даними форми
  const [title, setTitle] = useState(existingTitle || "");
  const [category, setCategory] = useState(assignedCategory || "");
  const [images, setImages] = useState(existingImages || []);
  const [description, setDescription] = useState(existingDescription || "");
  const [bodyText, setBodyText] = useState(existingBodyText || "");
  const [youtubeUrl, setYoutubeUrl] = useState(existingYoutubeUrl || "");
  const [goToCourses, setGoToCourses] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);
  const [youtubeUrlError, setYoutubeUrlError] = useState(null);
  const router = useRouter();
  const [selectedText, setSelectedText] = useState("");
const [buttonAction, setButtonAction] = useState("");

  // Accepted YouTube URL formats and corresponding regular expressions
  // Прийняті формати URL YouTube та відповідні регулярні вирази
  const acceptedYoutubeFormats = [
    "https://www.youtube.com/",
    "http://www.youtube.com/",
    "https://youtube.com/",
    "http://youtube.com/",
    "youtube.com/",
    "www.youtube.com/",
    "m.youtube.com/",
    "youtu.be/",
  ];
  const youtubeUrlPatterns = acceptedYoutubeFormats.map((format) => new RegExp(`^${format}`, "i"));

  // Fetch categories from the server on component mount
  // Отримання категорій з сервера при монтуванні компонента
  useEffect(() => {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }, []);

  // Validate form data on changes to relevant fields
  // Валідація даних форми при зміні відповідних полів
  useEffect(() => {
    const errors = {};
    if (title.trim() === "") {
      errors.title = "Title is required";
    }
    if (category.trim() === "") {
      errors.category = "Category is required";
    }
    if (images.length === 0) {
      errors.images = "Image is required";
    }
    if (youtubeUrl.trim() === "") {
      errors.youtubeUrl = "Youtube URL is required";
    }

    // Set validation errors or clear them based on form data
    // Встановлення помилок валідації або їх очищення на основі даних форми
    if (Object.keys(errors).length === 0) {
      setValidationErrors({});
    } else {
      setValidationErrors(errors);
    }
  }, [title, category, images, youtubeUrl]);

  // Validate YouTube URL format onBlur (when user finishes typing)
  // Валідація формату URL YouTube при втраті фокусу (коли користувач закінчив вводити)
  const validateYoutubeUrl = () => {
    if (youtubeUrl.trim() !== "") {
      const isValid = youtubeUrlPatterns.some((pattern) => pattern.test(youtubeUrl));
      setYoutubeUrlError(isValid ? null : "Invalid YouTube URL");
    }
  };

  // Validate the entire form for submission
  // Валідація всієї форми перед відправкою
  const validateForm = () => {
    return title.trim() !== "" && category.trim() !== "" && images.length > 0 && !youtubeUrlError;
  };

  // Save course data to the server
  // Збереження даних курсу на сервері
  const saveCourse = async (ev) => {
    ev.preventDefault();
    setShowErrors(true);

    const errors = {};
    if (title.trim() === "") {
      errors.title = "Title is required";
    }
    if (category.trim() === "") {
      errors.category = "Category is required";
    }
    if (images.length === 0) {
      errors.images = "Image is required";
    }
    if (youtubeUrl.trim() === "") {
      errors.youtubeUrl = "Youtube URL is required";
    }
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const data = {
      title,
      description,
      youtubeUrl,
      images,
      category,
      bodyText,
    };

    try {
      if (_id) {
        await axios.put("/api/courses", { ...data, _id });
      } else {
        await axios.post("/api/courses", data);
      }

      setGoToCourses(true);
    } catch (error) {
      console.error("Error saving course:", error);
    }
  };

  // Upload image file to the server
  // Завантаження файлу зображення на сервер
  const uploadImage = async (ev) => {
    const file = ev.target?.files[0];
    if (file && file.type.startsWith("image/")) {
      setIsUploading(true);
      const data = new FormData();
      data.append("file", file);

      try {
        const res = await axios.post("/api/upload", data);
        setImages([res.data.links[0]]);
      } catch (error) {
        console.error("Error uploading image:", error);
      }

      setIsUploading(false);
    }
  };

  // Handle cancel button click, navigate back
  // Обробка натискання кнопки скасування, перехід назад
  const handleCancel = () => {
    router.push('/courses');
  };

  // Handle click on image, open modal
  // Обробка кліку на зображенні, відкриття модального вікна
  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  // Handle close modal button click, close modal
  // Обробка натискання кнопки закриття модального вікна, закриття модального вікна
  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  // Redirect to courses page on successful form submission
  // Перенаправлення на сторінку курсів після успішної відправки форми
  useEffect(() => {
    if (goToCourses) {
      router.push("/courses");
    }
  }, [goToCourses]);

  const handleButtonClick = (startTag, endTag) => {
    const textarea = document.getElementById("bodyText");
    const text = textarea.value;
    const startIndex = textarea.selectionStart;
    const endIndex = textarea.selectionEnd;
  
    // Preserve the selected text
    const selectedText = text.substring(startIndex, endIndex);
  
    // Get the text before and after the selected range
    const textBefore = text.substring(0, startIndex);
    const textAfter = text.substring(endIndex);
  
    // Insert the tags around the selected text without moving the next line
    const newText = textBefore + startTag + selectedText + endTag + ' ' + textAfter;
  
    // Set the modified text
    setBodyText(newText);
  
    // Restore the selection
    textarea.setSelectionRange(startIndex + startTag.length, endIndex + startTag.length);
  };
  
  const handleListButtonClick = () => {
    const textarea = document.getElementById("bodyText");
    const text = textarea.value;
    const startIndex = textarea.selectionStart;
    const endIndex = textarea.selectionEnd;
  
    // Preserve the selected text
    const selectedText = text.substring(startIndex, endIndex);
  
    // Get the text before and after the selected range
    const textBefore = text.substring(0, startIndex);
    const textAfter = text.substring(endIndex);
  
    // Handle special case for lists
    let listItems;
    if (selectedText.includes("\n")) {
      // If multiple lines are selected, create a list
      listItems = selectedText
        .split("\n")
        .filter((line) => line.trim() !== "")
        .map((line) => `<li>• ${line}</li>`)
        .join("\n");
    } else {
      // If only one line is selected, create a single list item
      listItems = `<li>• ${selectedText}</li>`;
    }
    
    // Insert the tags around the selected text or list items without moving the next line
    const newText = textBefore + "<ul>" + listItems + "</ul>" + textAfter;
    
    // Set the modified text
    setBodyText(newText);
    
    // Restore the selection
    textarea.setSelectionRange(startIndex + "<ul>".length, endIndex + "<ul>".length);
    };
  
  return (
    // Course form HTML structure
    // HTML-структура форми курсу
    <form onSubmit={saveCourse}>
      <h2>
        {/* Required fields indicator */}
        {/* Позначка обов'язкових полів */}
        <span>(</span><span className="text-red-500">*</span>) required fields
      </h2>

      {/* Course name input field */}
      {/* Поле введення назви курсу */}
      <label>
        Course name
        <span className="text-red-500"> *</span>
      </label>
      <input
        type="text"
        placeholder="course name"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
        className={showErrors && validationErrors.title ? "border-red-500" : ""}
      />
      {showErrors && validationErrors.title && (
        <p className="text-red-500 text-sm">{validationErrors.title}</p>
      )}

      {/* Category selection dropdown */}
      {/* Випадаючий список вибору категорії */}
      <label>
        Category
        <span className="text-red-500"> *</span>
      </label>
      <select
        value={category}
        onChange={(ev) => setCategory(ev.target.value)}
        className={showErrors && validationErrors.category ? "border-red-500" : ""}
      >
        <option value="">Uncategorized</option>
        {categories.length > 0 &&
          categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
      </select>
      {showErrors && validationErrors.category && (
        <p className="text-red-500 text-sm">{validationErrors.category}</p>
      )}

      {/* Course thumbnail upload section */}
      {/* Розділ завантаження зображення курсу */}
      <label>
        Course Thumbnail
        <span className="text-red-500"> *</span>
      </label>
      <div className="mb-2 flex flex-wrap gap-1">
        {/* Add image placeholder */}
        {/* Заготовка для додавання зображення */}
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
        {/* Display uploaded images */}
        {/* Відображення завантажених зображень */}
        {!!images?.length &&
          images.map((link) => (
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
        {/* Display spinner during image upload */}
        {/* Відображення спінера під час завантаження зображення */}
        {isUploading && (
          <div className="h-24 flex items-center">
            <Spinner />
          </div>
        )}
       </div>
      {showErrors && validationErrors.images && (
        // Display error message if there are validation errors related to images
        // Виведення повідомлення про помилку, якщо є помилки валідації, пов'язані з зображеннями
        <p className="text-red-500 text-sm mt-2">{validationErrors.images}</p>
      )}

      <label>
        Description
        {/* Description input field */}
        {/* Поле введення опису */}
      </label>
      <textarea
        placeholder="description"
        value={description}
        onChange={(ev) => setDescription(ev.target.value)}
        style={{  overflowY: "scroll",resize: "none", }} // Add these styles

      />

      <label>
        Course
        {/* Course input field */}
        {/* Поле введення курсу */}
      </label>
      <div></div>
      <button
            type="button"
            onClick={() => handleButtonClick("<pre>", "</pre>")}
            className="btn-primary mr-1"
            title="Add a block of code"
          >
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-journal-code" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M8.646 5.646a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L10.293 8 8.646 6.354a.5.5 0 0 1 0-.708m-1.292 0a.5.5 0 0 0-.708 0l-2 2a.5.5 0 0 0 0 .708l2 2a.5.5 0 0 0 .708-.708L5.707 8l1.647-1.646a.5.5 0 0 0 0-.708"/>
    <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2"/>
    <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1z"/>
  </svg>
          </button>
          
          <button
          type="button"
          onClick={() => handleButtonClick("<code>", "</code>")}
          className="btn-primary mr-1"
          title="Add a code"
        >
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-code-slash" viewBox="0 0 16 16">
  <path d="M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0m6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0"/>
</svg>
        </button>

        <button
          type="button"
          onClick={() => handleButtonClick("<h5>", "</h5>")}
          className="btn-primary mr-1"
          title="Add title"

        >
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-type-h5" viewBox="0 0 16 16">
  <path d="M9 10.516h1.264c.193.976 1.112 1.364 2.01 1.364 1.005 0 2.067-.782 2.067-2.247 0-1.292-.983-2.082-2.089-2.082-1.012 0-1.658.596-1.924 1.077h-1.12L9.646 3h5.535v1.141h-4.415L10.5 7.28h.072c.201-.316.883-.84 1.967-.84 1.709 0 3.13 1.177 3.13 3.158 0 2.025-1.407 3.403-3.475 3.403-1.809 0-3.1-1.048-3.194-2.484ZM7.495 13V3.201H6.174v4.15H1.32V3.2H0V13h1.32V8.512h4.854V13z"/>
</svg>
</button>
        <button
          type="button"
          onClick={() => handleButtonClick("<p>", "</p>")}
          className="btn-primary mr-1"
          title="Add paragraph"
        >
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-paragraph" viewBox="0 0 16 16">
  <path d="M10.5 15a.5.5 0 0 1-.5-.5V2H9v12.5a.5.5 0 0 1-1 0V9H7a4 4 0 1 1 0-8h5.5a.5.5 0 0 1 0 1H11v12.5a.5.5 0 0 1-.5.5"/>
</svg>
        </button>
        <button
          type="button"
          onClick={() => handleButtonClick("<b>", "</b>")}
          className="btn-primary mr-1"
          title="Bold"
        >
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-type-bold" viewBox="0 0 16 16">
  <path d="M8.21 13c2.106 0 3.412-1.087 3.412-2.823 0-1.306-.984-2.283-2.324-2.386v-.055a2.176 2.176 0 0 0 1.852-2.14c0-1.51-1.162-2.46-3.014-2.46H3.843V13zM5.908 4.674h1.696c.963 0 1.517.451 1.517 1.244 0 .834-.629 1.32-1.73 1.32H5.908V4.673zm0 6.788V8.598h1.73c1.217 0 1.88.492 1.88 1.415 0 .943-.643 1.449-1.832 1.449H5.907z"/>
</svg>
        </button>
        <button
          type="button"
          onClick={() => handleButtonClick("<i>", "</i>")}
          className="btn-primary mr-1"
          title="Italic"
        >
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-type-italic" viewBox="0 0 16 16">
  <path d="M7.991 11.674 9.53 4.455c.123-.595.246-.71 1.347-.807l.11-.52H7.211l-.11.52c1.06.096 1.128.212 1.005.807L6.57 11.674c-.123.595-.246.71-1.346.806l-.11.52h3.774l.11-.52c-1.06-.095-1.129-.211-1.006-.806z"/>
</svg>
        </button>
        <button
          type="button"
          onClick={() => handleButtonClick("<u>", "</u>")}
          className="btn-primary mr-1"
          title="Underline"
        >
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-type-underline" viewBox="0 0 16 16">
  <path d="M5.313 3.136h-1.23V9.54c0 2.105 1.47 3.623 3.917 3.623s3.917-1.518 3.917-3.623V3.136h-1.23v6.323c0 1.49-.978 2.57-2.687 2.57s-2.687-1.08-2.687-2.57zM12.5 15h-9v-1h9z"/>
</svg>
        </button>
        <button
          type="button"
          onClick={handleListButtonClick}
          className="btn-primary mr-1"
          title="Add list"
        >
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list-columns-reverse" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M0 .5A.5.5 0 0 1 .5 0h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 0 .5m4 0a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1h-10A.5.5 0 0 1 4 .5m-4 2A.5.5 0 0 1 .5 2h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m4 0a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m-4 2A.5.5 0 0 1 .5 4h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m4 0a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m-4 2A.5.5 0 0 1 .5 6h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m4 0a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 0 1h-8a.5.5 0 0 1-.5-.5m-4 2A.5.5 0 0 1 .5 8h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m4 0a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 0 1h-8a.5.5 0 0 1-.5-.5m-4 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m4 0a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1h-10a.5.5 0 0 1-.5-.5m-4 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m4 0a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5m-4 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m4 0a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5"/>
</svg>
        </button>

      <textarea
      id="bodyText" // Add this id
      placeholder="Course"
      value={bodyText}
      onChange={(ev) => setBodyText(ev.target.value)}
      style={{ height: "200px", overflowY: "scroll",resize: "none", }} // Add these styles
    />
 


      <label>
        Youtube Link
        <span className="text-red-500"> *</span>
        {/* Youtube URL input field */}
        {/* Поле введення посилання на YouTube */}
      </label>
      <input
        type="text"
        placeholder="youtubeUrl"
        value={youtubeUrl}
        onChange={(ev) => setYoutubeUrl(ev.target.value)}
        onBlur={validateYoutubeUrl} 
        // Trigger validation when the user finishes typing
        // Запуск валідації, коли користувач завершить введення
        className={(showErrors && validationErrors.youtubeUrl) || youtubeUrlError ? "border-red-500" : ""}
      />
      {(showErrors && validationErrors.youtubeUrl) && (
        // Display error message if there are validation errors related to the YouTube URL
        // Виведення повідомлення про помилку, якщо є помилки валідації, пов'язані з посиланням на YouTube
        <p className="text-red-500 text-sm">{validationErrors.youtubeUrl}</p>
      )}
      {youtubeUrlError && (
        // Display error message for an invalid YouTube URL
        // Виведення повідомлення про помилку для неправильного посилання на YouTube
        <p className="text-red-500 text-sm">{youtubeUrlError}</p>
      )}

      <button type="submit" className="btn-primary" disabled={!validateForm()}>
        {/* Save button */}
         {/* Кнопка "Зберегти" */}
        Save
      </button>
      <button type="button" className="btn-red ml-1" onClick={handleCancel}>
        {/* Cancel button */}
        {/* Кнопка "Скасувати" */}
        Cancel
      </button>

      {/* Image Modal */}
      {/* Модаль зображення */}
      {selectedImage && (
        // Display the selected image in a modal
        // Відображення вибраного зображення в модальному вікні
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center"
          onClick={handleCloseModal}
        >
          <div className="max-w-2xl max-h-2xl overflow-hidden rounded-lg p-4 relative">
            <img
              src={selectedImage}
              alt="Selected"
              className="rounded-lg max-w-full max-h-full"
            />
            <button
              className="absolute top-1 right-1 text-white bg-red-500 rounded-full p-1 hover:bg-red-600"
              onClick={handleCloseModal}
            >
              {/* Close button for the image modal */}
              {/* Кнопка закриття для модального вікна зображення */}
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
          </div>
        </div>
      )}
    </form>
  );
};

export default CourseForm;