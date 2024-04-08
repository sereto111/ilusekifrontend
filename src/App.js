import { Ruta } from './components/Ruta';
import "./App.css";
import { createContext, useState } from 'react';
import Header from './components/Header';

export const ThemeContext = createContext(null);

export function App() {

  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

  return (
    <>
      <ThemeContext.Provider value={{theme, setTheme}}>
        
        <div className="App" id={theme}>
          <Header/>

          {/* <Register/> */}
          
          <Ruta/>
          
        </div>
        
      </ThemeContext.Provider>
    </>
  );
}

export default App;