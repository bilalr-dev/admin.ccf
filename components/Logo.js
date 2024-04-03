// Import necessary libraries and components from Next.js
// Імпорт необхідних бібліотек та компонентів з Next.js
import Link from "next/link";

// Functional component for rendering the logo and linking to the home page
// Функціональний компонент для відображення логотипу та посилання на головну сторінку
export default function Logo() {
  return (
    // Link component from Next.js used for client-side navigation
    // Компонент Link з Next.js, який використовується для навігації на клієнтському боці
    <Link href={'/'}>
      {/* Container for the logo, with flex layout and spacing */}
      {/* Контейнер для логотипу з гнучким розташуванням та відступами */}
      <div className="flex gap-1">
        {/* SVG icon for the logo */}
        {/* SVG-іконка для логотипу */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          {/* Path for the logo, depicting a play button and lines */}
          {/* Шлях для логотипу, який зображує кнопку відтворення та лінії */}
          <path strokeLinecap="round" strokeLinejoin="round" d="m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>
        {/* Text for the logo, indicating the site's name */}
        {/* Текст для логотипу, який вказує на назву сайту */}
        <span className="">
          CodeCraftingLab
        </span>
      </div>
    </Link>
  );
}
