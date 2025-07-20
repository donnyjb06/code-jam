import './Header.css';

const Header = () => {

  return (
    <header className='header'>
      <nav className='nav'>
        <img src={logo} alt='' className='nav__logo' />
        <p className={isError ? 'error' : 'non-error'}>nisdnfopsda</p>
      </nav>
      <button onClick={handleClick}>toggle error</button>
    </header>
  );
};

export default Header;
