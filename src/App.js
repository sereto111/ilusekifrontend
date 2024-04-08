/* import Header from './components/Header'; */
import { Register } from './components/Register';
import "./App.css";
import { createContext, useState } from 'react';

export const ThemeContext = createContext(null);

export function App() {

  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

  return (
    <>
      <ThemeContext.Provider value={{theme, setTheme}}>
        
        <div className="App" id={theme}>
          <Register/>
          
          {/* <Ruta/> */}
          
        </div>
        
      </ThemeContext.Provider>
    </>
  );
}

export default App;