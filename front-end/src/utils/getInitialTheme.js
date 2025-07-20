const getInitialTheme = () => {
  const storedTheme = localStorage.getItem("theme")
  if (storedTheme) {
    return storedTheme
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default getInitialTheme