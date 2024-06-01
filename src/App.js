import { Ruta } from './components/Ruta';
import "./App.css";
import { createContext, useState } from 'react';
import Header from './components/Header';
import CookieBanner from './components/CookieBaner';

export const ThemeContext = createContext(null);

export function App() {

  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

  return (
    <>
      <ThemeContext.Provider value={{theme, setTheme}}>
        
        <div className="App" id={theme}>
          <CookieBanner />
          
          <Header/>
                  
          <Ruta/>
          
        </div>
        
      </ThemeContext.Provider>
    </>
  );
}

export default App;