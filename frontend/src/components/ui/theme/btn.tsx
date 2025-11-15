import { useThemeContext } from "../../../context/theme.tsx";
import Button from "../primitives/Button.tsx";

export default function ThemeBtn() {
  const { theme, setTheme, Themes } = useThemeContext();

  const toggleTheme = () => {
    setTheme(theme === Themes.Light ? Themes.Dark : Themes.Light);
  };

  return (
    <Button
      onClick={toggleTheme}
      type="button"
      variant="ghost"
      size="sm"
      startIcon={
        theme === Themes.Light
          ? { name: "Sun", size: 12 }
          : { name: "Moon", size: 12 }
      }
      title={
        theme === Themes.Light ? "Switch to dark mode" : "Switch to light mode"
      }
    />
  );
}
