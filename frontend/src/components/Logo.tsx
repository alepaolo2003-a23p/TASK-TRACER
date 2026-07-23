import { useTheme } from '../contexts/ThemeContext';
import logoBlack from '../assets/stride-logo-black.png';
import logoWhite from '../assets/stride-logo-white.png';

interface Props {
  className?: string;
}

export default function Logo({ className = 'h-8 w-auto' }: Props) {
  const { darkMode } = useTheme();
  return (
    <img
      src={darkMode ? logoWhite : logoBlack}
      alt="Stride"
      className={className}
    />
  );
}
