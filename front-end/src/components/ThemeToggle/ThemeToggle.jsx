import useTheme from '../../hooks/useTheme';
import { FaMoon } from 'react-icons/fa6';
import { FaSun } from 'react-icons/fa6';
import "./ThemeToggle.css"
import { useEffect, useState } from 'react';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const [isDisabled, setIsDisabled] = useState(false)

  useEffect(() => {
    setIsDisabled(true)
    setTimeout(() => {
      setIsDisabled(false)
    }, 300)

  }, [theme])

  return (
    <div className='toggle-button'>
      <input type="checkbox" className="toggle-button__input" checked={theme === "dark"} onChange={toggleTheme} disabled={isDisabled}/>
      <span className='toggle-button__knob'></span>
      <FaMoon
        title='moon icon for dark mode toggle'
        size={25}
        style={{
          color: 'var(--clr-background)',
        }}
        className={`theme-icon ${theme === 'light' ? 'hidden' : 'visible'}`}
      />
      <FaSun
        title='sun icon for dark mode toggle'
        size={25}
        style={{
          color: 'var(--clr-background)',
        }}
        className={`theme-icon ${theme === 'light' ? 'visible' : 'hidden'}`}
      />
    </div>
  );
};

export default ThemeToggle;
