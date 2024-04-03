// Import necessary dependencies
// Імпорт необхідних залежностей
import React, { useRef, useState } from 'react';
import Layout from '@/components/Layout';
import axios from 'axios';

// Custom SVG icon component for restore operation
// Власний компонент SVG-іконки для операції відновлення
const CustomRestoreIcon = () => (
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m0-3-3-3m0 0-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75" />
</svg>

);
// Custom SVG icon component for backup operation
// Власний компонент SVG-іконки для операції резервного копіювання
const CustomBackupIcon = () => (
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m-6 3.75 3 3m0 0 3-3m-3 3V1.5m6 9h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75" />
</svg>

);

// Settings component
// Компонент Налаштувань
const Settings = () => {
  const fileInputRef = useRef(null);
  const [restoreSuccess, setRestoreSuccess] = useState(false);

  // Function to handle backup operation
  // Функція для обробки операції резервного копіювання
  const handleBackup = async () => {
    try {
      // Send backup request to the server
      // Відправка запиту на резервне копіювання на сервер
      const response = await axios.post('/api/backup');
      // Create a Blob from the response data
      // Створення Blob із даних відповіді
      const blob = new Blob([JSON.stringify(response.data)], {
        type: 'application/json',
      });
      // Generate a unique filename based on date and time
      // Генерація унікального імені файлу на основі дати та часу
      const currentDate = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
      const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/:/g, '-');
      const fileName = `ccl_backup_${currentDate}_${currentTime}.json`;
      // Create a download link and trigger the download
      // Створення посилання для завантаження та спричинення завантаження
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // Revoke the Object URL to free up resources
      // Анулювання Object URL для звільнення ресурсів
      window.URL.revokeObjectURL(url);
    } catch (error) {
        throw error;
    }
  };
  // Function to handle restore operation
  // Функція для обробки операції відновлення
  const handleRestore = async () => {
    try {
      // Check if a file is selected
      // Перевірка, чи обраний файл
      if (fileInputRef.current?.files.length > 0) {
        const file = fileInputRef.current.files[0];
        // Read the content of the selected file
        // Зчитування вмісту обраного файлу
        const fileContent = await file.text();
        // Parse the JSON content of the file
        // Розбір JSON-вмісту файлу  
        const restoreData = JSON.parse(fileContent);
         // Send restore request to the server
        // Відправка запиту на відновлення на сервер 
        const response = await axios.post('/api/restore', restoreData);
        // Set restore success state based on the server response
        // Встановлення стану успіху відновлення на основі відповіді сервера  
        if (response.status === 200) {
          setRestoreSuccess(true);
        } else {
          setRestoreSuccess(false);
        }
      } 
    } catch (error) {
      // Handle errors during restore
      // Обробка помилок під час відновлення
      setRestoreSuccess(false);
    }
  };
  // Render the Settings component
  // Рендер компонента Налаштувань
  return (
    <Layout>
    <h1>Settings</h1>
    <div className="container mx-auto p-4 ">
      <div className="mb-4 p-2 border border-gray-300 bg-white bg-opacity-20 rounded-md">
        <h2 className="text-lg font-semibold mb-1">Backup Data</h2>
        <p className="mb-2 mt-1 text-gray-500 ">
          Backs up your database, keeping your data safe. If something goes wrong, you can easily restore your database to a previous state, making sure your information is always secure.
        </p>
        <button
          onClick={handleBackup}
          className="btn-primary flex items-center p-1 text-xs hover:bg-blue-600 hover:text-white"
        >
          <CustomBackupIcon /> <span className="ml-1">Backup Data</span>
        </button>
      </div>
      <div className="mb-4 p-2 border border-gray-300 bg-white bg-opacity-20 rounded-md">
        <h2 className="text-lg font-semibold mb-1">Restore Data</h2>
        <p className="mb-2 mt-1 text-gray-500 ">
          If things go wrong, it undoes the damage, bringing your database back to safety. It&apos;s like an instant recovery button for your important information.
        </p>
        <div className="flex items-center gap-1">
          <input
            type="file"
            accept=".json"
            ref={fileInputRef}
            className="border-none"
            placeholder=""
          />
        </div>
        <button
          onClick={handleRestore}
          className="btn-primary flex items-center p-1 text-xs hover:bg-blue-600 hover:text-white mt-1"
        >
          <CustomRestoreIcon /> <span className="ml-1">Restore Data</span>
        </button>
          {/* Display restore success message if applicable */}
          {/* Відображення повідомлення про успішне відновлення, якщо це застосовно */}
        {restoreSuccess && <p className="text-sky-100 mt-1">Restore successful!</p>}
      </div>
    </div>
  </Layout>
  );
};
// Export the Settings component
// Експорт компонента Налаштувань
export default Settings;
