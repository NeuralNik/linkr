import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative h-10 w-10 rounded-lg border border-border transition-all duration-500 hover:glow-effect"
      style={{
        transformStyle: "preserve-3d",
        transform: theme === "dark" ? "rotateY(180deg)" : "rotateY(0deg)",
        transition: "transform 0.6s ease, box-shadow 0.5s ease",
      }}
    >
      <Sun
        className={`h-5 w-5 transition-all duration-500 ${
          theme === "dark" ? "rotate-90 scale-0" : "rotate-0 scale-100"
        }`}
        style={{
          backfaceVisibility: "hidden",
          transform: "rotateY(0deg)",
          opacity: theme === "dark" ? 0 : 1,
          transition: "opacity 0.4s ease",
        }}
      />
      <Moon
        className={`absolute h-5 w-5 transition-all duration-500 ${
          theme === "dark" ? "rotate-0 scale-100" : "-rotate-90 scale-0"
        }`}
        style={{
          transform: "rotateY(180deg)",
          backfaceVisibility: "hidden",
          opacity: theme === "dark" ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}