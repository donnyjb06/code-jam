import './Header.css';
import ThemeToggle from '../ThemeToggle/ThemeToggle';

const Header = () => {
  return (
    <header className='header'>
      <p className='header__logo'>SightSee</p>
      <ThemeToggle />
    </header>
  );
};

export default Header;
