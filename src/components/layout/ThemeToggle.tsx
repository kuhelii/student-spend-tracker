
import React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

const ThemeToggle: React.FC = () => {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Use theme or systemTheme for icon
  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <button
      className="flex items-center gap-1 px-2 py-1 rounded transition-colors text-gray-400 hover:text-yellow-400 dark:hover:text-yellow-300 focus:outline-none"
      title="Toggle dark/light mode"
      onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle dark mode"
      type="button"
    >
      {currentTheme === "dark" ? (
        <Sun size={20} />
      ) : (
        <Moon size={20} />
      )}
      <span className="hidden sm:inline text-xs">
        {currentTheme === "dark" ? "Light" : "Dark"}
      </span>
    </button>
  );
};

export default ThemeToggle;

