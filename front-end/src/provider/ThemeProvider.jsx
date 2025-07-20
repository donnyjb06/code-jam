import { useState, useEffect } from "react";
import getInitialTheme from "../utils/getInitialTheme";

const ThemeProvider = ({children}) => {
  const [theme, setTheme] = useState(() => getInitialTheme())

  useEffect(() => {
    const updateTheme = () => {
      localStorage.setItem("theme", theme)
      if (theme === "dark") {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }

    updateTheme();
  }, [theme])

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === "dark" ? "light" : "dark");
  }

  return (
    <ThemeContext.Provider value={{toggleTheme, theme}}>
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeProvider