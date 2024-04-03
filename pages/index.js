// Import necessary dependencies
// Імпорт необхідних залежностей
import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";

// Home component
// Компонент для головної сторінки
export default function Home() {
  // Retrieve user session information using the useSession hook
  // Отримання інформації про сеанс користувача за допомогою хука useSession
  const { data: session } = useSession();

  // Render the Home component with user information
  // Рендер компонента для головної сторінки з інформацією про користувача
  return (
    <Layout>
      <div className="text-blue-900 flex justify-between">
        {/* Greeting message with the user's name */}
        {/* Привітання з іменем користувача */}
        <h2>
          Hello, <b>{session?.user?.name}</b>
        </h2>
        {/* User information displayed in a flex container */}
        {/* Відображення інформації про користувача в гнучкому контейнері */}
        <div className="flex bg-gray-300 gap-1 text-black rounded-lg overflow-hidden">
          {/* User profile image */}
          {/* Зображення профілю користувача */}
          <img src={session?.user?.image} alt="" className="w-6 h-6" />
          {/* User name displayed beside the profile image */}
          {/* Ім'я користувача, відображене поруч із зображенням профілю */}
          <span className="px-2">
            {session?.user?.name}
          </span>
        </div>
      </div>
    </Layout>
  );
}
