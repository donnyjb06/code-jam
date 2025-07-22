import Header from './components/Header/Header';
import Main from './components/Main/Main';
import Footer from './components/Footer/Footer';
import './App.css';
import ThemeProvider from './provider/ThemeProvider';
import RouteProvider from './provider/RouteProvider';

function App() {
  return (
    <>
      <ThemeProvider>
        <RouteProvider>
          <Header />
          <Main />
          <Footer />
        </RouteProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
