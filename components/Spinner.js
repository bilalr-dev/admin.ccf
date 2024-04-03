// Import the BounceLoader component from the 'react-spinners' library
// Імпортуйте компонент BounceLoader з бібліотеки 'react-spinners'
import { BounceLoader } from "react-spinners";

// Spinner component that displays a bouncing loader
// Компонент Spinner, який відображає анімоване завантаження вигляду "відбивання"
export default function Spinner() {
  // Render the BounceLoader component with specified color and speedMultiplier
  // Відображення компонента BounceLoader з вказаним кольором та множником швидкості
  return (
    <BounceLoader color={'#1E3A8A'} speedMultiplier={2} />
  );
}
