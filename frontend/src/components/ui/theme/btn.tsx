import { useThemeContext } from "../../../context/theme.tsx";
import { Sun, Moon } from "lucide-react";

export default function ThemeBtn() {
  const { theme, setTheme, Themes } = useThemeContext();

  const toggleTheme = () => {
    setTheme(theme === Themes.Light ? Themes.Dark : Themes.Light);
  };

  return (
    <button onClick={toggleTheme} type="button">
      {theme === Themes.Light ? <Sun /> : <Moon />}
    </button>
  );
}
